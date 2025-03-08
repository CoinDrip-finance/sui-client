import { useAuth } from '@elrond-giants/erd-react-hooks';
import { AcademicCapIcon, InformationCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { joiResolver } from '@hookform/resolvers/joi';
import BigNumber from 'bignumber.js';
import Joi from 'joi';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { NextPage } from "next";
import { StreamItemType } from '../components/gallery/StreamTypeItem';
import AmountInput from '../components/new_stream/AmountInput';
import DurationInput from '../components/new_stream/DurationInput';
import NumberInput from '../components/new_stream/NumberInput';
import RecipientInput from '../components/new_stream/RecipientInput';
import TokenSelect, { TokenWithMetadata } from '../components/new_stream/TokenSelect';
import RequiresAuth from '../components/RequiresAuth';
import BackButtonWrapper from '../components/shared/BackWrapper';
import Layout from '../components/shared/Layout';
import { ICreateStream, StreamType } from '../types';
import { Segments } from '../utils/models/Segments';
import { galleryPath } from '../utils/routes';
import { streamTypes } from './gallery';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import { Transaction } from "@mysten/sui/transactions";
import { CoinStruct, PaginatedCoins } from '@mysten/sui/dist/cjs/client';
import { useTransaction } from '../hooks/useTransaction';

const mergeAndSplitCoins = (tx: Transaction, coins: CoinStruct[], amount: string) => {
  const [coin] = coins.splice(0, 1);
  if (coins.length) {
    tx.mergeCoins(coin.coinObjectId, coins.map(item => item.coinObjectId));
  }
  const [splitCoin] = tx.splitCoins(coin.coinObjectId, [amount]);

  return splitCoin;
}

const Home: NextPage = () => {
  const account = useCurrentAccount();
  const router = useRouter();

  const schema = Joi.object<ICreateStream>({
    recipient: Joi.string()
      .pattern(/^0x[a-fA-F0-9]{64}$/)
      .custom((data, helper) => {
        // @ts-ignore
        if (data === account?.address) return helper.message("You can't stream towards yourself");

        return data;
      })
      .required(),
    payment_token: Joi.string()
      .pattern(/^0x[a-f0-9]+::.+::.+$/)
      .required(),
    amount: Joi.number().positive().required(),
    duration: Joi.number().positive().required(),
    cliff: Joi.number().positive().max(Joi.ref("duration")),
    steps_count: Joi.number().positive().integer(),
  });
  const formMethods = useForm<ICreateStream>({
    resolver: joiResolver(schema),
  });
  const {
    handleSubmit,
  } = formMethods;

  const [streamType, setStreamType] = useState<StreamItemType>();
  const [selectedToken, setSelectedToken] = useState<TokenWithMetadata>();
  const [loading, setLoading] = useState(false);
  const { sendTransaction } = useTransaction();

  const { data: accountCoins } = useSuiClientQuery(
    'getCoins',
    {
      owner: account?.address!,
      coinType: selectedToken?.coinType,
    },
  );

  useEffect(() => {
    if (!router?.query?.type) return;

    setStreamType(streamTypes.find((e) => e.id === router.query.type));
  }, [router?.query?.type]);

  const createStream = async (formData: ICreateStream) => {
    if (!account?.address) return;

    try {
      setLoading(true);
      const amountBigNumber = new BigNumber(formData.amount).shiftedBy(selectedToken?.decimals || 9);
      let segments;
      if (isStepsType && formData?.steps_count) {
        segments = Segments.fromNewStream(formData, amountBigNumber);
      } else {
        segments = new Segments({
          duration: formData.duration,
          amount: amountBigNumber.toString(),
          exponent: isExponentialType ? 3 : 1,
        });
      }

      const tx = new Transaction();
      tx.setSender(account.address);
      tx.setGasBudget(50_000_000);

      let coin;
      if (selectedToken?.coinType === process.env.NEXT_PUBLIC_SUI_COIN) {
        coin = tx.splitCoins(tx.gas, [amountBigNumber.toString()]);
      } else {
        coin = mergeAndSplitCoins(tx, accountCoins?.data || [], amountBigNumber.toString());
      }
      const segmentsVector = segments.toVector(tx);

      tx.moveCall({
        target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::${process.env.NEXT_PUBLIC_MODULE}::create_stream`,
        typeArguments: [selectedToken?.coinType!],
        arguments: [
          coin,
          tx.pure.address(formData.recipient),
          tx.pure.u64(new Date().getTime() + 1000 * 60),
          tx.pure.u64(formData.cliff || 0),
          segmentsVector,
          tx.object("0x6")
        ]
      });

      await sendTransaction(tx);
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
            <div className="bg-neutral-950 rounded-lg border border-neutral-900 h-12 flex items-center justify-between px-4 text-neutral-400 font-medium text-sm">
              <div className="flex items-center">
                <LockClosedIcon className="w-4 h-4 mr-2" /> {streamType?.title} stream
              </div>
              <div>
                <img src={`/gallery/${streamType?.id}.svg`} alt={streamType?.title} className="h-6" />
              </div>
            </div>

            <FormProvider {...formMethods}>
              <form className="flex flex-col space-y-4" onSubmit={handleSubmit(createStream)}>
                <TokenSelect onSelect={(token) => setSelectedToken(token)} />

                <AmountInput token={selectedToken} />

                <RecipientInput />

                <DurationInput label="Duration" formId="duration" />

                {isCliffType && <DurationInput label="Cliff" formId="cliff" />}

                {isStepsType && <NumberInput label="Steps Count" formId="steps_count" />}

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
