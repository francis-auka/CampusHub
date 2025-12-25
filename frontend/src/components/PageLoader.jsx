import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PageLoader = ({ isLoading }) => {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-dark-darker"
                >
                    <div className="text-center">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="mb-6"
                        >
                            <img
                                src="/campus-hub-logo.png"
                                alt="Campus Hub"
                                className="w-24 h-24 mx-auto"
                            />
                        </motion.div>
                        <motion.h2
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="text-xl font-semibold text-white"
                        >
                            Campus<span className="text-primary-400">Hub</span>
                        </motion.h2>
                        <motion.div
                            className="mt-4 flex gap-1 justify-center"
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, -10, 0],
                                    }}
                                    transition={{
                                        duration: 0.6,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: "easeInOut"
                                    }}
                                    className="w-2 h-2 bg-primary-500 rounded-full"
                                />
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Hook to use page loading
export const usePageLoading = (duration = 500) => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    return isLoading;
};

export default PageLoader;
