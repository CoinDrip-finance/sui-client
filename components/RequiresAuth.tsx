import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCurrentAccount, useCurrentWallet, useAutoConnectWallet } from "@mysten/dapp-kit";
import { homePath } from "../utils/routes";

export default function RequiresAuth({ children }: { children: any }) {
    const account = useCurrentAccount();
    const router = useRouter();
    const { currentWallet, connectionStatus } = useCurrentWallet();
    const autoConnectionStatus = useAutoConnectWallet();

    useEffect(() => {
        if (!account) {
            if (autoConnectionStatus === 'idle' || connectionStatus === 'connecting') {
                return;
            }
            router.push(homePath);
        }
    }, [router, account, currentWallet, connectionStatus, autoConnectionStatus]);

    return (
        <div>
            {account ? children : "Loading..."}
        </div>
    );
};
