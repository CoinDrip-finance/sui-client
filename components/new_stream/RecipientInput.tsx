import { ArrowTopRightOnSquareIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import isMobile from 'is-mobile';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { classNames, getShortAddress } from '../../utils/presentation';
import ScanAddressModal from './ScanAddressModal';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { CreateStreamAiInput } from '../../pages/new';

const formatName = (name?: string) => {
  if (!name) return '';
  if (name.endsWith('.sui')) return name;
  return name + '.sui';
}

export default function RecipientInput({ fieldIndex, aiInput }: { fieldIndex: number; aiInput?: CreateStreamAiInput }) {
  const { setValue, register } = useFormContext();
  const [recipientInputValue, setRecipientInputValue] = useState<string>();
  const [recipientAddress, setRecipientAddress] = useState<string>();
  const [recipientHeroTag, setRecipientHeroTag] = useState<string>();
  const [scanQrOpen, setScanQrOpen] = useState(false);
  const inputRef = useRef(null);

  const { data: addressFromName } = useSuiClientQuery(
    'resolveNameServiceAddress',
    {
      name: formatName(recipientInputValue)
    },
  );

  const { data: nameFromAddress } = useSuiClientQuery(
    'resolveNameServiceNames',
    {
      address: recipientInputValue || ''
    },
  );

  useEffect(() => {
    if (aiInput?.wallet_address) {
      setRecipientInputValue(aiInput.wallet_address);
      // @ts-ignore
      inputRef.current.value = aiInput.wallet_address;
    }
  }, [aiInput])

  const isAddress = useMemo(() => {
    return recipientInputValue?.startsWith("0x");
  }, [recipientInputValue]);

  useEffect(() => {
    if (!recipientInputValue) {
      setRecipientHeroTag("");
      setRecipientAddress("");
      return;
    }
    (async () => {
      if (recipientInputValue?.startsWith("0x")) {
        setRecipientAddress(recipientInputValue);
        if (nameFromAddress) setRecipientHeroTag(nameFromAddress.data[0]);
        else setRecipientHeroTag("");
      } else {
        if (addressFromName) {
          setRecipientAddress(addressFromName);
          setRecipientHeroTag(recipientInputValue);
        } else {
          setRecipientHeroTag("");
          setRecipientAddress("");
        }
      }
    })();
  }, [recipientInputValue, nameFromAddress, addressFromName]);

  const displayAdditionalInfo = useMemo(() => {
    return (isAddress && recipientHeroTag) || (!isAddress && recipientAddress && recipientHeroTag);
  }, [isAddress, recipientAddress, recipientHeroTag]);

  useEffect(() => {
    if (!recipientAddress) return;
    setValue(`streams.${fieldIndex}.recipient`, recipientAddress);
  }, [recipientAddress]);

  return (
    <div>
      <div className="block font-light text-sm mb-2">Recipient name/address</div>
      <div className="relative w-full">
        <input
          type="text"
          ref={inputRef}
          className={classNames(
            "bg-neutral-950 rounded-lg border border-neutral-900 focus:border-neutral-900 h-12 font-medium text-sm focus:outline-none pl-4 w-full",
            displayAdditionalInfo ? "pr-36" : isMobile() ? "pr-12" : "pr-4"
          )}
          onBlur={({ target: { value } }) => setRecipientInputValue(value)}
        />

        {displayAdditionalInfo && (
          <a
            href={`${process.env.NEXT_PUBLIC_EXPLORER}/account/${recipientAddress}`}
            target="_blank"
            className={classNames(
              "h-8 absolute rounded-lg text-sm px-2 mt-2 bg-neutral-800 font-light text-neutral-400 inline-flex items-center",
              isMobile() ? "right-12" : "right-2"
            )}
            rel="noreferrer"
          >
            {isAddress
              ? `@${recipientHeroTag?.replace(".sui", "")}`
              : getShortAddress(recipientAddress as string, 6)}{" "}
            <ArrowTopRightOnSquareIcon className="ml-2 w-3 h-3" />
          </a>
        )}

        {isMobile() && (
          <div className="h-8 absolute right-2 rounded-lg px-1 top-2 bg-neutral-800">
            <QrCodeIcon className="h-6 mt-1 text-neutral-400 " onClick={() => setScanQrOpen(true)} />
          </div>
        )}
      </div>

      <ScanAddressModal
        open={scanQrOpen}
        onClose={(address) => {
          if (address) {
            setRecipientInputValue(address);
            // @ts-ignore
            inputRef.current.value = address;
          }

          setScanQrOpen(false);
        }}
      />
    </div>
  );
}
