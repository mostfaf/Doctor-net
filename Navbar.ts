import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  return (
    <motion.nav
      className="bg-blue-900 p-4 shadow-lg"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white">
          دكتور نت
        </Link>
        <div className="space-x-4">
          <Link to="/" className="text-white hover:text-blue-300 transition">
            الحجز
          </Link>
          <Link to="/admin" className="text-white hover:text-blue-300 transition">
            الإدارة
          </Link>
          <Link to="/analytics" className="text-white hover:text-blue-300 transition">
            التحليلات
          </Link>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;