'use client';

import { useChatRuntime } from '@assistant-ui/react-ai-sdk';

import { PropsWithChildren } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { AssistantModal } from '@assistant-ui/react-ui';
import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { MarkdownText } from '@assistant-ui/react-markdown';

export default function ChatProvider({ children }: PropsWithChildren) {
    const account = useCurrentAccount();

    const runtime = useChatRuntime({
        api: '/api/chat',
        body: {
            wallet: account?.address
        }
    });

    return (
        <AssistantRuntimeProvider runtime={runtime}>
            {children}
            <AssistantModal
                assistantMessage={{ components: { Text: MarkdownText } }}
            />
        </AssistantRuntimeProvider>
    );
}
