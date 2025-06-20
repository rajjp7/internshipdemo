import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col items-center justify-center px-6 py-16 font-sans relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-blue-700 rounded-full opacity-20 blur-3xl top-[-100px] left-[-100px] z-0"></div>
      <div className="absolute w-[400px] h-[400px] bg-purple-700 rounded-full opacity-20 blur-3xl bottom-[-80px] right-[-80px] z-0"></div>

      <motion.div
        className="z-10 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-5xl font-bold text-blue-400 mb-4">Welcome to GearVault</h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8">
          Effortlessly manage your inventory. Add new items, explore your collection, and send quick enquiries—all in one elegant app.
        </p>

        <div className="flex justify-center gap-6">
          <Link to="/add" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all">
            ➕ Add Item
          </Link>
          <Link to="/view" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all">
            👁️ View Items
          </Link>
        </div>
      </motion.div>

      <footer className="absolute bottom-4 text-xs text-gray-500 z-10">
        © 2025 GearVault by AMRR TechSols
      </footer>
      <div className="fixed bottom-4 right-4 bg-gradient-to-r from-[#1f2937] via-[#111827] to-[#1f2937] border border-gray-700 px-4 py-2 rounded-full text-xs text-gray-300 font-semibold shadow-lg hover:shadow-blue-500/30 transition-all duration-300 ease-in-out cursor-pointer backdrop-blur-md hover:text-white hover:scale-105 z-50">
  <span className="animate-pulse mr-1">🚀</span> Raj Patil
</div>


    </div>
  );
};

export default Home;
