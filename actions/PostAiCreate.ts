import { NextApiRequest } from 'next';
import ApiResponse from './_base/ApiResponse';
import BaseAction from './_base/BaseAction';
import OpenAI from 'openai';
import { z } from 'zod';
import instructor from '@instructor-ai/instructor';
import axios from 'axios';

const client = instructor({
  client: new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY
  }),
  mode: 'TOOLS'
});

const TokenInfo = z.object({
  type: z.string(),
  symbol: z.string(),
  name: z.string(),
  verified: z.boolean().default(false)
});
type TokenInfoType = z.infer<typeof TokenInfo>;

// Define stream type enum with literal values
const StreamType = z.enum(['linear', 'cliff_linear', 'steps', 'exponential', 'cliff_exponential']).default('linear');

async function fetchTokenList(): Promise<TokenInfoType[]> {
  try {
    const response = await axios.get('http://localhost:3000/api/tokens'); // Replace with actual API endpoint
    const tokens = z.array(TokenInfo).parse(response.data);
    return tokens;
  } catch (error) {
    console.error('Error fetching token list:', error);
    return []; // Fallback to empty list on error
  }
}

const extractTokenName = (input: string): string => {
  const userTokenChunks = input.split('::');
  const lastChunk = userTokenChunks[userTokenChunks.length - 1];
  return lastChunk;
}

function matchToken(userToken: string, tokenList: TokenInfoType[]): string {
  const lowerUserToken = userToken.toLowerCase();

  const matchedToken = tokenList.sort((a, b) => (a.verified === b.verified ? 0 : a.verified ? -1 : 1)).find(
    (token) =>
      token.symbol.toLowerCase() === lowerUserToken ||
      token.name.toLowerCase() === lowerUserToken ||
      extractTokenName(token.name).toLowerCase() === lowerUserToken
  );
  return matchedToken ? matchedToken.type : userToken; // Return symbol if matched, otherwise use input as-is
}

async function extractStreamParams(userInput: string): Promise<TokenStreamRequestType> {
  // Fetch token list once (could be cached in a real application)
  const tokenList = await fetchTokenList();

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an assistant that extracts token streaming parameters from user input for a Sui blockchain protocol.
      Extract the following:
      - wallet_address: Either:
        * A valid Sui wallet address (0x followed by 64 hex characters, e.g., 0x6515ea81ab3edc6c9a62d177e4b4f6191653a57c2ddf9a161c8dbcc7db409f33)
        * An alphanumeric alias (e.g., "alice123", "bob", "user99")
        Place either the address or alias in the wallet_address field as provided
      - duration: Duration in seconds (positive integer)
      - amount: Token amount (positive number)
      - token: Token symbol or name (e.g., SUI, USDC, Suipercycle)
      - cliff: Optional cliff period in seconds (positive integer) before streaming begins
      - stream_type: Optional stream type with these options and aliases:
        * 'linear' (default) - aliases: 'straight', 'constant', 'even'
        * 'cliff_linear' - aliases: 'cliffed linear', 'delayed linear'
        * 'steps' - aliases: 'stepped', 'staircase', 'incremental'
        * 'exponential' - aliases: 'exp', 'geometric', 'accel'
        * 'cliff_exponential' - aliases: 'cliffed exponential', 'delayed exp', 'exp with delay'
      - step_count: Required only for 'steps' stream_type, number of steps (integer, 1-50)

      Rules:
      - If stream_type isn't specified, default to 'linear'
      - If cliff is specified but stream_type isn't, use 'cliff_linear' unless 'exponential' is implied
      - Only include cliff if explicitly mentioned
      - For 'steps' stream_type, step_count must be specified (1-50); otherwise, do not include step_count
      - Recognize aliases for stream_type when mentioned
      - Use the exact wallet_address or alias as provided in the input
      - Match the token to a known symbol or name from the provided token list if possible
      - Make reasonable assumptions for unclear inputs; if step_count is missing for 'steps', default to 10`
      },
      {
        role: 'user',
        content: userInput
      }
    ],
    response_model: {
      schema: TokenStreamRequest,
      name: 'TokenStreamRequest'
    }
  });

  // Post-process to match token with API list
  response.token = matchToken(response.token, tokenList);
  delete response._meta;
  return response;
}

// Define the structured output schema using Zod
const TokenStreamRequest = z.object({
  wallet_address: z.union([
    z.string()
      .regex(/^0x[a-fA-F0-9]{64}$/)
      .describe('A valid Sui wallet address (0x followed by 64 hex characters)'),
    z.string()
      .regex(/^[a-zA-Z0-9]+$/)
      .describe('An alphanumeric alias for a wallet address')
  ]).describe('Either a Sui wallet address (0x followed by 64 hex chars) or an alphanumeric alias'),
  duration: z.number()
    .int()
    .positive()
    .describe('Duration in seconds for the token stream'),
  amount: z.number()
    .positive()
    .describe('Amount of tokens to stream'),
  token: z.string()
    .describe('Token symbol or identifier (e.g., SUI, USDC, Suipercycle)'),
  cliff: z.number()
    .int()
    .positive()
    .optional()
    .describe('Optional cliff period in seconds before streaming begins'),
  stream_type: StreamType
    .describe('Type of token stream: linear (default), linear with cliff, steps, exponential, or exponential with cliff'),
  step_count: z.number()
    .int()
    .min(1)
    .max(50)
    .optional()
    .describe('Number of steps for "steps" stream type, required only when stream_type is "steps", max 50')
});

type TokenStreamRequestType = z.infer<typeof TokenStreamRequest>;

export default class PostAiCreateAction extends BaseAction {
  async handle(req: NextApiRequest): Promise<ApiResponse<any>> {
    const { input } = req.body;

    const response = await extractStreamParams(input);

    return new ApiResponse({
      body: response,
    }).cache(60, 6);
  }
}
