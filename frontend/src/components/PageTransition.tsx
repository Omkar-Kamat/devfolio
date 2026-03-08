'use client';

import { motion } from 'framer-motion';

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.03 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
            {children}
        </motion.div>
    );
};
