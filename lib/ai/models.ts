// Define your models here.

export interface Model {
  id: string;
  label: string;
  apiIdentifier: string;
  description: string;
}

export const models: Array<Model> = [
  {
    id: 'gpt-4o',
    label: 'GPT 4o',
    apiIdentifier: 'gpt-4o',
    description: 'For complex, multi-step tasks',
  },
  {
    id: 'claude-3-5-sonnet-latest',
    label: 'Claude 3.5 Sonnet',
    apiIdentifier: 'claude-3-5-sonnet-latest',
    description: 'For complex, multi-step tasks',
  },
  {
    id: 'ctx',
    label: 'GPT 4o + Context Protocol',
    apiIdentifier: 'gpt-4o',
    description: 'Using verified information',
  },
] as const;

export const DEFAULT_MODEL_NAME: string = 'gpt-4o';
