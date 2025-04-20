import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { generateText, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { tool } from 'ai';
import { z } from 'zod';
import { CLAIMS_TABLE, STREAMS_TABLE, supabase } from '../../../utils/supabase';
import { Transaction } from '@mysten/sui/transactions';

// @ts-ignore
const rpcUrl = getFullnodeUrl(process.env.NEXT_PUBLIC_NETWORK!);
const client = new SuiClient({ url: rpcUrl });

const suiTokenPattern = /^[a-fA-F0-9]{64}::[a-zA-Z_][a-zA-Z0-9_]*::[a-zA-Z_][a-zA-Z0-9_]*$/;
const streamIdPattern = /^0x[a-fA-F0-9]{64}$/;

function decodeU64ReturnValue(returnValue: [number[], string]): number {
    const [byteArray, type] = returnValue;

    if (type !== 'u64') {
        throw new Error(`Unsupported type: ${type}`);
    }

    // Convert number[] to Uint8Array
    const bytes = new Uint8Array(byteArray);

    // Decode little-endian u64
    let value = BigInt(0);
    for (let i = 0; i < bytes.length; i++) {
        value += BigInt(bytes[i]) << BigInt(8 * i);
    }

    return Number(value);
}

// Tool: getIncomingStreams
const getIncomingStreams = tool({
    description: 'Get streams that are going to a specific wallet address',
    parameters: z.object({
        address: z.string().describe('Wallet address receiving the stream'),
    }),
    execute: async ({ address }) => {
        const result = await client.getOwnedObjects({
            owner: address,
            filter: {
                StructType: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::${process.env.NEXT_PUBLIC_MODULE}::${process.env.NEXT_PUBLIC_STREAM_STRUCT}`,
            },
            options: {
                showContent: true,
            },
        })
        return result.data || [];
    },
});

// Tool: getOutgoingStreams
const getOutgoingStreams = tool({
    description: 'Get streams that were created by a specific wallet',
    parameters: z.object({
        address: z.string().describe('Wallet address that created the stream'),
    }),
    execute: async ({ address }) => {
        const { data } = await supabase.from(STREAMS_TABLE).select('*').eq('sender', address);
        return data || [];
    },
});

// Tool: getClaims
const getClaims = tool({
    description: 'Get stream claims made by a wallet address',
    parameters: z.object({
        address: z.string().describe('Wallet address that claimed tokens'),
    }),
    execute: async ({ address }) => {
        const { data } = await supabase.from(CLAIMS_TABLE).select('*').eq('claimed_by', address);
        return data || [];
    },
});

const getAllStreams = tool({
    description: 'Get all streams created by any user',
    parameters: z.object({}),
    execute: async () => {
        const { data } = await supabase.from(STREAMS_TABLE).select('*');
        return data || [];
    },
});

const getTokenMetadata = tool({
    description: 'Get the metadata of a specific token like name or decimals',
    parameters: z.object({
        coinType: z.string().regex(suiTokenPattern).describe('The token type to get metadata for'),
    }),
    execute: async ({ coinType }) => {
        const result = await client.getCoinMetadata({ coinType })
        return result || {};
    },
});

const getRecipientBalance = tool({
    description: 'Get the recipient balance (claimable amount) of a stream',
    parameters: z.object({
        streamId: z.string().regex(streamIdPattern).describe('The stream ID to get the recipient balance for'),
        coinType: z.string().regex(suiTokenPattern).describe('The token type used in the stream'),
    }),
    execute: async ({ streamId, coinType }) => {
        const tx = new Transaction();

        tx.moveCall({
            target: `${process.env.NEXT_PUBLIC_PACKAGE_ID}::${process.env.NEXT_PUBLIC_MODULE}::recipient_balance`,
            typeArguments: [coinType],
            arguments: [tx.object(streamId), tx.object("0x6")],
        });

        const result = await client.devInspectTransactionBlock({
            transactionBlock: tx,
            sender: '0x6515ea81ab3edc6c9a62d177e4b4f6191653a57c2ddf9a161c8dbcc7db409f33',
        });

        // @ts-ignore
        const amountToClaim = decodeU64ReturnValue(result.results[0].returnValues[0]);

        return amountToClaim || {};
    },
});

export async function POST(req: Request) {
    const { messages, wallet } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return new Response(JSON.stringify({ error: 'Missing or invalid prompt array' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (wallet && typeof wallet === 'string') {
        messages.push({
            role: 'user',
            content: `I'm authenticated with wallet address: ${wallet}`,
        });
    }

    const result = await streamText({
        model: openai('gpt-4.1-mini'),
        temperature: 0.2,
        system: `
        General Overview:
        - You're a personal assistant for Coindrip users. Coindrip is a token streaming protocol on Sui (similar to Sablier from EVM). Remember you're working for Coindrip so don't mention any competition and always have the best interest for Coindrip in mind. If the user is interested in using Coindrip or looks like Coindrip can help him but he's not asking for a very clear information, always suggest them to use the Coindrip app and tell them how it can help them.
        - Coindrip is useful for:
            - Token vesting schedules
            - Payroll and recurring payments
            - Subscriptions
            - Grants and airdrops
            - Streaming tokens to multiple recipients over time
        - Each stream is visible on-chain, and tokens are unlocked every second or depending on the streaming function that used to create the stream. Recipients can claim their available balance at any time, providing instant access to unlocked funds. Stream recipients are also issued an NFT that gives them control over the stream, enhancing composability with other DeFi protocols.
        - Users can view and manage all incoming and outgoing streams, check their statuses, and interact with the protocol via the Coindrip interface or directly on-chain.

        General Information:    
        - The current date in milliseconds elapsed since midnight, January 1, 1970 Universal Coordinated Time (UTC) is ${Date.now()}.

        General Instructions:
        - Use the tools provided when needed to answer questions about incoming/outgoing streams and claims if the wallet address is provided. If no wallet, it means the user is not authenticated and you can only use the tools that don't require the wallet address. In that case, don't mention the wallet address in your answer or ask for it. Just ask the user to authenticate to get more information.
        - If a user requests information on the claimable amount from a stream, you can use the available tool to get the recipient balance. The recipient balance is the amount of tokens that can be claimed by the recipient of a stream. This amount is calculated based on the stream's start time, end time, and the current time. The recipient balance is updated in real-time as the stream progresses.
        - If a user requests information on the future claimable amount from a stream, you can compute that based on the start date, current date and the segments of the stream. The segments are the different parts of the stream that can be claimed at different times. You can use the start date and the segments information to calculate the future claimable amount. If you're not sure about the result, you can let the user know that you're not sure about the result and suggest them to check the Coindrip app for more information.

        Amounts and Token Balances Instructions:
        - All token and coin amounts are stored in the database and onchain as big integers, representing the smallest indivisible units of the token.
        - To convert these values into human-readable format:
            - Use the token's 'decimals' property from the metadata (e.g., 9 for SUI, 6 for USDC).
            - Divide the raw bigint by 10^decimals.
            - Display the result as a decimal number with commas for thousands, and up to 6 decimal places (unless the number is very small).
        - Examples:
            - If the value is "1000000000" and the token has 9 decimals → display as "1".
            - If the value is "123456789000000" and the token has 6 decimals → display as "123,456.789".
            - If the value is "1000000000000000000" with 18 decimals → display as "1".
        - Always include the token symbol (e.g., "1.23 SUI", "123,456.78 USDC"). Display only the processed value, not the raw bigint to the user.
        - If you're unsure about the decimals, try to find it using the token metadata tool.
        - If you're doing any math operations with token amounts, make sure to do it with the human readable result, following the above rules to avoid any inconsistencies.

        Other important notes for displaying information to the user:
            - If you have token types like 0000000000000000000000000000000000000000000000000000000000000002::sui::SUI use a tool to get the name of the token or only show the last part (eg SUI) if you don't have the name available using the tools.
            - If you have any dates or timestamps in seconds or milliseconds make sure to format them in a good readable way and never display the raw data to the user. 
            - If you have stream IDs, you can display them as links to the explorer with the stream ID as a parameter. For example, if the stream ID is "0x1234567890abcdef", you can display it as [0x1234567890abcdef](${process.env.NEXT_PUBLIC_EXPLORER}/object/0x1234567890abcdef).
            - Try to be concise and give the user the information he's looking for without being too verbose and in an aggregated format.
            - Provide examples when necessary to clarify your answer.
            - Try to only display human readable information and not raw data. If you have to display raw data, make sure to format it in a good readable way.
            - If you have a values both in a specific format and as raw data, it's not necessary to display the raw data. Just display the human readable value in the best format possible.`,
        messages,
        tools: {
            getIncomingStreams,
            getOutgoingStreams,
            getClaims,
            getAllStreams,
            getTokenMetadata,
            getRecipientBalance
        },
        maxSteps: 10,
    });

    return result.toDataStreamResponse();
}
