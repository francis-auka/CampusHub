import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const LazyImage = ({
    src,
    alt,
    className = '',
    placeholderClassName = '',
    aspectRatio = '16/9',
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '50px',
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={imgRef}
            className={`relative overflow-hidden ${className}`}
            style={{ aspectRatio }}
        >
            {/* Placeholder with logo */}
            <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: isLoaded ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                className={`absolute inset-0 flex items-center justify-center bg-dark-lighter/40 backdrop-blur-sm ${placeholderClassName}`}
            >
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-16 h-16 relative"
                >
                    <img
                        src="/campus-hub-logo.png"
                        alt="Loading..."
                        className="w-full h-full object-contain opacity-30"
                    />
                </motion.div>
            </motion.div>

            {/* Actual image */}
            {isInView && (
                <motion.img
                    src={src}
                    alt={alt}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isLoaded ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    onLoad={() => setIsLoaded(true)}
                    className={`absolute inset-0 w-full h-full object-cover ${className}`}
                    {...props}
                />
            )}
        </div>
    );
};

export default LazyImage;
