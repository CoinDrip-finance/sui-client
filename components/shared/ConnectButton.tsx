import { ConnectModal, useCurrentAccount, useCurrentWallet, ConnectButton as SuiConnectButton, useConnectWallet } from "@mysten/dapp-kit";
import { useState } from "react";
import ActionButton from "./ActionButton";

export default function ConnectButton() {
    const currentAccount = useCurrentAccount();
    const currentWallet = useCurrentWallet();
    const [open, setOpen] = useState(false);

    const disconnectWallet = () => {
        currentWallet?.currentWallet?.features?.['standard:disconnect']?.disconnect()
        setOpen(false);
    }

    const onOpenChange = (isOpen: boolean) => {
        if (currentAccount) {
            return;
        }

        setOpen(isOpen);
    }

    if (currentAccount) {
        return <SuiConnectButton />;
    }

    return (
        <ConnectModal
            trigger={
                <ActionButton
                    onClick={!currentAccount ? () => setOpen(true) : disconnectWallet}
                    label={currentAccount ? "Disconnect" : "Connect wallet"}
                    className="auth-button"
                />
            }
            open={open}
            onOpenChange={onOpenChange}
        />
    );
}
