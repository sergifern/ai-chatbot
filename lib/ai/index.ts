import { openai } from '@ai-sdk/openai';
import { anthropic } from "@ai-sdk/anthropic"

import { experimental_wrapLanguageModel as wrapLanguageModel } from 'ai';

import { customMiddleware } from './custom-middleware';

export const customModel = (apiIdentifier: string) => {
  return wrapLanguageModel({
    model: apiIdentifier.startsWith('claude') ? anthropic(apiIdentifier) : openai(apiIdentifier),
    middleware: customMiddleware,
  });
};
