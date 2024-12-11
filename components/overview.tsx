import { motion } from 'framer-motion';
import Link from 'next/link';

import { MessageIcon, VercelIcon } from './icons';

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <h1 className="flex flex-row justify-center gap-4 items-center font-bold">
          Welcome to WineBot! 🍇
        </h1>
        <p>
          Explore wines with ease using our interactive chatbot powered by Context RAG integration. 
          Get real-time updates on products, marketing campaigns, and more. How can I assist you today?
        </p>
         
        <p className='hidden'>
          You can learn more about Context by visiting the{' '}
          <Link
            className="font-medium underline underline-offset-4"
            href="https://docs.ctx.xyz"
            target="_blank"
          >
            docs
          </Link>
          .
        </p>
      </div>
    </motion.div>
  );
};
