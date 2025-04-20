import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { SuiSignAndExecuteTransactionOutput } from "@mysten/wallet-standard";
import { useTransactionNotifications } from "./useTransactionNotifications";


export const useTransaction = () => {
  const { mutate } = useSignAndExecuteTransaction();
  const client = useSuiClient();
  const { removeNotification, pushTxNotification } = useTransactionNotifications();

  const executeTransaction = (transaction: Transaction) => {
    return new Promise<SuiSignAndExecuteTransactionOutput>((resolve, reject) => {
      mutate(
        {
          transaction: transaction as any,
          chain: `sui:${process.env.NEXT_PUBLIC_NETWORK}`
        },
        {
          onSuccess: (result) => {
            console.log('onSuccess', result);
            resolve(result);
          },
          onError: (error) => {
            console.log('onError', error);
            reject(error);
          },
        }
      )
    });
  };
  const sendTransaction = async (transaction: Transaction) => {
    const { digest } = await executeTransaction(transaction);
    pushTxNotification(digest, "new");

    const result = await client.waitForTransaction({
      digest,
      timeout: 30000,
      pollInterval: 1000,
      options: {
        showEffects: true,
      }
    });
    const { status } = result.effects ?? { status: { status: 'failure' } };

    pushTxNotification(digest, status.status);

    return { status, result };

  }

  return { sendTransaction };
};
