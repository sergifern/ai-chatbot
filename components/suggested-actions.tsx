'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ChatRequestOptions, CreateMessage, Message } from 'ai';
import { memo } from 'react';

interface SuggestedActionsProps {
  chatId: string;
  append: (
    message: Message | CreateMessage,
    chatRequestOptions?: ChatRequestOptions,
  ) => Promise<string | null | undefined>;
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const suggestedActions = [
    {
      title: 'Vi en llauna',
      label: 'de Vallformosa',
      action: 'Coneixes el celler Vallformosa? Te un producte de vi en llauna, quin nom te?',
    },
    {
      title: 'Llista de productes i preus',
      label: 'de Vallformosa',
      action: 'Lista de productes i preus mes recent de Vallfromosa',
    },
    {
      title: 'Campanya de Nadal',
      label: 'de Vallformosa',
      action: 'Te Vallfromosa alguna oferta especial para als seus productes?',
    },
    {
      title: 'Importació de vi',
      label: 'desde Pudong',
      action: '我想从 Vallformosa 出口 1200 瓶 Vallformosa Brut Nature Reserve 到上海浦东。请提供相关信息，例如价格、重量等。',
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 gap-2 w-full">
      {suggestedActions.map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className={index > 1 ? 'hidden sm:block' : 'block'}
        >
          <Button
            variant="ghost"
            onClick={async () => {

              append({
                role: 'user',
                content: suggestedAction.action,
              });
            }}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 gap-1 sm:flex-col w-full h-auto justify-start items-start"
          >
            <span className="font-medium">{suggestedAction.title}</span>
            <span className="text-muted-foreground">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
