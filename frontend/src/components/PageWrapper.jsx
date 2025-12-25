import { motion } from 'framer-motion';
import PageLoader, { usePageLoading } from './PageLoader';

const PageWrapper = ({ children, className = '' }) => {
    const isLoading = usePageLoading(500);

    return (
        <>
            <PageLoader isLoading={isLoading} />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={`min-h-screen ${className}`}
            >
                {children}
            </motion.div>
        </>
    );
};

export default PageWrapper;
