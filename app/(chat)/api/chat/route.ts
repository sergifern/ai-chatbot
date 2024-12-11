import {
  type Message,
  StreamData,
  convertToCoreMessages,
  streamObject,
  streamText,
  tool,
} from 'ai';
import { z } from 'zod';

import { auth } from '@/app/(auth)/auth';
import { customModel } from '@/lib/ai';
import { models } from '@/lib/ai/models';
import { systemPrompt, regularPrompt } from '@/lib/ai/prompts';
import {
  deleteChatById,
  getChatById,
  getDocumentById,
  saveChat,
  saveDocument,
  saveMessages,
  saveSuggestions,
} from '@/lib/db/queries';
import type { Suggestion } from '@/lib/db/schema';
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';

import { generateTitleFromUserMessage } from '../../actions';

export const maxDuration = 60;

type AllowedTools =
  | 'createDocument'
  | 'updateDocument'
  | 'requestSuggestions'
  | 'getWeather';

const blocksTools: AllowedTools[] = [
  'createDocument',
  'updateDocument',
  'requestSuggestions',
];

const weatherTools: AllowedTools[] = ['getWeather'];

const allTools: AllowedTools[] = [...blocksTools, ...weatherTools];

export async function POST(request: Request) {
  const {
    id,
    messages,
    modelId,
  }: { id: string; messages: Array<Message>; modelId: string } =
    await request.json();

  const session = await auth();

  /*if (!session || !session.user || !session.user.id) {
    return new Response('Unauthorized', { status: 401 });
  }*/

  const model = models.find((model) => model.id === modelId);

  if (!model) {
    return new Response('Model not found', { status: 404 });
  }

  const coreMessages = convertToCoreMessages(messages);
  const userMessage = getMostRecentUserMessage(coreMessages);

  if (!userMessage) {
    return new Response('No user message found', { status: 400 });
  }

  /*const chat = await getChatById({ id });

  if (!chat) {
    const title = await generateTitleFromUserMessage({ message: userMessage });
    await saveChat({ id, userId: session.user.id, title });
  }*/

  const userMessageId = generateUUID();

  /*await saveMessages({
    messages: [
      { ...userMessage, id: userMessageId, createdAt: new Date(), chatId: id },
    ],
  });*/

  const streamingData = new StreamData();

  streamingData.append({
    type: 'user-message-id',
    content: userMessageId,
  });

  const tools = {
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
  };

  console.log(model.id);
  const result = streamText({
    model: customModel(model.apiIdentifier),
    system: model.id == "ctx" ? systemPrompt : regularPrompt,
    messages: coreMessages,
    maxSteps: 5,
    tools: model.id == "ctx" ? tools : {},
    onFinish: async ({ response }) => {
      streamingData.close();
    },
    experimental_telemetry: {
      isEnabled: true,
      functionId: 'stream-text',
    },
  });

  return result.toDataStreamResponse({
    data: streamingData,
  });
}

export const findRelevantContent = async (userQuery: string) => {
  console.log(userQuery);
  const response = await fetch(
    `http://localhost:8080/v1/internal/search?query=${encodeURIComponent(userQuery)}&topK=3`,
  );
  return response.json();
};

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  /*const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }*/

  try {
    const chat = await getChatById({ id });

    /*if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }*/

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
