import { motion } from 'framer-motion';

const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
            {/* Gradient Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            />
            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    rotate: [0, -90, 0],
                    x: [0, -100, 0],
                    y: [0, 50, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 2
                }}
                className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 0],
                    x: [0, 50, 0],
                    y: [0, 100, 0],
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear",
                    delay: 5
                }}
                className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            />

            {/* Floating Geometric Shapes */}
            <div className="absolute inset-0 opacity-[0.03]">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>
        </div>
    );
};

export default AnimatedBackground;
