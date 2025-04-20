'use client';
// @ts-ignore
import { useChatRuntime } from '@assistant-ui/react-ai-sdk';
// @ts-ignore
import { AssistantRuntimeProvider } from '@assistant-ui/react';
import { makeMarkdownText } from "@assistant-ui/react-ui";
import { PropsWithChildren } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { AssistantModal } from '@assistant-ui/react-ui';

const MarkdownText = makeMarkdownText();

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
                assistantAvatar={{
                    src: '/favicon.png',
                    alt: 'CoinFever Assistant'
                }}
                welcome={
                    {
                        message: `Hi! I'm here to help you get information on your account or any additional information you need. You can ask me anything!`,
                        suggestions: [
                            {
                                text: 'Active streams',
                                prompt: 'What are my active streams?'
                            },
                            {
                                text: 'Claimable funds',
                                prompt: 'What are my claimable funds?'
                            },
                        ]
                    }
                }
            />
        </AssistantRuntimeProvider>
    );
}
