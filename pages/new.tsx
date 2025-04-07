import { AcademicCapIcon, DocumentChartBarIcon, LockClosedIcon, PencilIcon } from '@heroicons/react/24/outline';
import { joiResolver } from '@hookform/resolvers/joi';
import BigNumber from 'bignumber.js';
import Joi from 'joi';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import type { NextPage } from "next";
import { StreamItemType } from '../components/gallery/StreamTypeItem';
import TokenSelect, { TokenWithMetadata } from '../components/new_stream/TokenSelect';
import RequiresAuth from '../components/RequiresAuth';
import BackButtonWrapper from '../components/shared/BackWrapper';
import Layout from '../components/shared/Layout';
import { ICreateStream, StreamType } from '../types';
import { Segments } from '../utils/models/Segments';
import { galleryPath, homePath } from '../utils/routes';
import { streamTypes } from './gallery';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { Transaction } from "@mysten/sui/transactions";
import { CoinStruct } from '@mysten/sui/dist/cjs/client';
import { useTransaction } from '../hooks/useTransaction';
import { classNames } from '../utils/presentation';
import ManualCreateStream from '../components/new_stream/ManualCreateStream';
import CsvCreateStream from '../components/new_stream/CsvCreateSteram';

export interface CreateStreamAiInput {
  wallet_address: string;
  duration: string;
  amount: string;
  token: string;
  cliff?: string;
  stream_type: string;
  step_count?: string;
}

const mergeAndSplitCoins = (tx: Transaction, coins: CoinStruct[], amounts: string[]) => {
  const [coin] = coins.splice(0, 1);
  if (coins.length) {
    tx.mergeCoins(coin.coinObjectId, coins.map(item => item.coinObjectId));
  }
  const splitCoin = tx.splitCoins(coin.coinObjectId, amounts);

  return splitCoin;
}

export const streamItemSchema = Joi.object({
  recipient: Joi.string()
    .pattern(/^0x[a-fA-F0-9]{64}$/)
    .required(),
  amount: Joi.number().positive().required(),
  duration: Joi.number().positive().required(),
  cliff: Joi.number().positive().max(Joi.ref("duration")),
  steps_count: Joi.number().positive().integer(),
});

const schema = Joi.object<ICreateStream>({
  payment_token: Joi.string()
    .pattern(/^0x[a-f0-9]+::.+::.+$/)
    .required(),
  streams: Joi.array().items(streamItemSchema).min(1).required(),
});

const allowedCsvTypes: StreamType[] = [StreamType.Linear];

const Home: NextPage = () => {
  const account = useCurrentAccount();
  const router = useRouter();

  const formMethods = useForm<ICreateStream>({
    resolver: joiResolver(schema),
    defaultValues: {
      streams: [{
        recipient: "",
      }]
    }
  });
  const {
    control,
    handleSubmit,
    setValue
  } = formMethods;

  const { fields, remove, append } = useFieldArray({
    control,
    name: "streams",
  });

  const [streamType, setStreamType] = useState<StreamItemType>();
  const [selectedToken, setSelectedToken] = useState<TokenWithMetadata>();
  const [loading, setLoading] = useState(false);
  const { sendTransaction } = useTransaction();
  const [creationType, setCreationType] = useState<'manual' | 'csv'>('manual');

  const [aiInput, setAiInput] = useState<CreateStreamAiInput>();

  const switchCreationType = (type: 'manual' | 'csv') => {
    if (type === creationType) return;

    if (type === 'manual') {
      if (fields.length === 0) {
        // @ts-ignore
        append({ recipient: "" });
      }
      setCreationType('manual');
    } else {
      fields.forEach((field, index) => {
        remove(index);
      });
      setCreationType('csv');
    }
  }

  const { data: accountCoins } = useSuiClientQuery(
    'getCoins',
    {
      owner: account?.address!,
      coinType: selectedToken?.coinType,
    },
  );

  useEffect(() => {
    if (!router?.query?.stream_type) return;

    setStreamType(streamTypes.find((e) => e.id === router.query.stream_type));
  }, [router?.query?.stream_type]);

  useEffect(() => {
    setStreamType(streamTypes.find((e) => e.id === router.query.stream_type));

    // @ts-ignore
    setAiInput(router?.query as CreateStreamAiInput);

    if (router?.query?.step_count) {
      setValue("streams.0.steps_count", parseInt(router.query.step_count as string));
    }
  }, [router?.query]);

  const createStream = async (formData: ICreateStream) => {
    if (!account?.address) return;

    try {
      setLoading(true);

      const tx = new Transaction();
      tx.setSender(account.address);
      tx.setGasBudget(50_000_000);

      let coins;
      if (selectedToken?.coinType === process.env.NEXT_PUBLIC_SUI_COIN) {
        coins = tx.splitCoins(tx.gas, formData.streams.map((stream) => {
          return new BigNumber(stream.amount).shiftedBy(selectedToken?.decimals || 9).toString();
        }));
      } else {
        coins = mergeAndSplitCoins(tx, accountCoins?.data || [], formData.streams.map((stream) => {
          return new BigNumber(stream.amount).shiftedBy(selectedToken?.decimals || 9).toString();
        }));
      }

      formData.streams.forEach((stream, index) => {
        const amountBigNumber = new BigNumber(stream.amount).shiftedBy(selectedToken?.decimals || 9);

        let segments;
        if (isStepsType && stream?.steps_count) {
          segments = Segments.fromNewStream(stream, amountBigNumber);
        } else {
          segments = new Segments({
            duration: stream.duration,
            amount: amountBigNumber.toString(),
            exponent: isExponentialType ? 3 : 1,
          });
        }

        const segmentsVector = segments.toVector(tx);
        const cliff = (stream.cliff || 0) * 1000;

        tx.moveCall({
          target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::${process.env.NEXT_PUBLIC_MODULE}::create_stream`,
          typeArguments: [selectedToken?.coinType!],
          arguments: [
            coins[index],
            tx.pure.address(stream.recipient),
            tx.pure.u64(new Date().getTime() + 1000 * 60),
            tx.pure.u64(cliff),
            segmentsVector,
            tx.object("0x6")
          ]
        });
      });

      await sendTransaction(tx);

      router.push(homePath);
    } finally {
      setLoading(false);
    }
  };

  const isCliffType = useMemo(() => {
    return streamType?.id === StreamType.CliffLinear || streamType?.id === StreamType.CliffExponential;
  }, [streamType?.id]);

  const isExponentialType = useMemo(() => {
    return streamType?.id === StreamType.Exponential || streamType?.id === StreamType.CliffExponential;
  }, [streamType?.id]);

  const isStepsType = useMemo(() => {
    return streamType?.id === StreamType.Steps;
  }, [streamType?.id]);

  return (
    <RequiresAuth>
      <Layout>
        <NextSeo title="Create stream" />
        <BackButtonWrapper href={galleryPath} title="Create a stream">
          <p className="mt-2 mb-8 font-light text-sm">Start streaming your tokens in minutes.</p>

          <div className="flex flex-col space-y-4">
            <div className='flex items-center w-full space-x-4'>
              <div className="flex-1 bg-neutral-950 rounded-lg border border-neutral-900 h-12 flex items-center justify-between px-4 text-neutral-400 font-medium text-sm">
                <div className="flex items-center">
                  <LockClosedIcon className="w-4 h-4 mr-2" /> {streamType?.title} stream
                </div>
                <div>
                  <img src={`/gallery/${streamType?.id}.svg`} alt={streamType?.title} className="h-6" />
                </div>
              </div>

              {allowedCsvTypes.includes(streamType?.id as StreamType) && <ul className='hidden sm:flex flex-1 bg-neutral-950 rounded-lg border border-neutral-900 uppercase h-12 px-4 text-xs items-center justify-between'>
                <li onClick={() => switchCreationType('manual')} className={classNames('flex items-center cursor-pointer', creationType === 'manual' ? 'text-neutral-100' : 'text-neutral-400')}><PencilIcon className='w-4 mr-2' />  manual</li>
                <li className='h-[0.5px] bg-neutral-800 flex-auto mx-3 hidden sm:block'></li>
                <li onClick={() => switchCreationType('csv')} className={classNames('flex items-center cursor-pointer', creationType === 'csv' ? 'text-neutral-100' : 'text-neutral-400')}><DocumentChartBarIcon className='w-4 mr-2' /> csv</li>
              </ul>}
            </div>

            <FormProvider {...formMethods}>
              <form className="flex flex-col space-y-4" onSubmit={handleSubmit(createStream)}>
                <TokenSelect onSelect={(token) => setSelectedToken(token)} aiInput={aiInput} />

                <div className='h-[1px] bg-neutral-900 w-full'></div>

                {creationType === 'manual' ? <ManualCreateStream aiInput={aiInput} selectedToken={selectedToken} isCliffType={isCliffType} isStepsType={isStepsType} /> : <CsvCreateStream selectedToken={selectedToken?.name} />}

                {router?.query?.ai && <p className='text-xs mt-2 text-orange-400'>Data filled with AI. Please make sure all the data is correct before signing the transaction.</p>}

                <button
                  className="primary-action-button disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={loading}
                  type='submit'
                >
                  {loading ? "Loading..." : "Create Stream"}
                </button>
              </form>
            </FormProvider>
          </div>

          {/* TODO: Add a link to the docs */}
          <a href="#" className="underline flex items-center text-sm font-light justify-center mt-12">
            <AcademicCapIcon className="h-4 w-4 mr-2" /> Learn more about token streams
          </a>
        </BackButtonWrapper>
      </Layout>
    </RequiresAuth>
  );
};

export default Home;
