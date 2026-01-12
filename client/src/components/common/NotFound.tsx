
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { delay: 0.2, staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Card */}
      <motion.div className="max-w-sm w-full bg-white shadow-md rounded-lg overflow-hidden" variants={itemVariants}>
        
        {/* Header with Dark Blue Gradient */}
        <div className="bg-gradient-to-br from-blue-800 to-blue-900 p-4 text-white text-center">
          <motion.h1 className="text-5xl md:text-6xl font-bold mb-1" variants={itemVariants}>404</motion.h1>
          <motion.div className="h-1 w-12 bg-white rounded mb-4 mx-auto" variants={itemVariants}/>
          <motion.h2 className="text-xl md:text-2xl font-semibold" variants={itemVariants}>Page Not Found</motion.h2>
        </div>

        {/* Content */}
        <motion.div className="p-4 text-center" variants={itemVariants}>
          <p className="text-gray-600 mb-6 text-sm md:text-base">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* Go Back Button */}
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded text-gray-800 hover:bg-gray-100 transition text-sm"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>

            {/* Return Home Button */}
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900 transition text-sm"
            >
              <Home size={16} />
              Return Home
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div className="mt-6 text-xs text-gray-500" variants={itemVariants}>
        &copy; {new Date().getFullYear()} | All rights reserved
      </motion.div>
    </motion.div>
  );
};

export default NotFound;
