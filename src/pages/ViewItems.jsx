import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from 'emailjs-com';

const ViewItems = () => {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('items') || '[]');
    setItems(saved);
  }, []);

  const sendEmail = (item) => {
    emailjs
      .send(
        'your_service_id',
        'your_template_id',
        {
          item_name: item.name,
          item_type: item.type,
          item_description: item.description,
          from_name: 'Portfolio Visitor',
          email: 'your_email_id'
        },
        'your_user_id'
      )
      .then(() => {
        alert('📩 Email sent successfully!');
      })
      .catch((error) => {
        alert('❌ Failed to send email.');
        console.error('Email error:', error);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#141e30] via-[#243b55] to-[#141e30] text-white px-6 py-10 font-sans">
      <motion.h2
        className="text-3xl font-bold text-center mb-10 text-gray-100"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        View Items
      </motion.h2>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            onClick={() => setSelected(item)}
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl cursor-pointer shadow-lg overflow-hidden hover:shadow-blue-500/30 transition-all"
            whileHover={{ scale: 1.03 }}
          >
            <img
              src={item.coverImage}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-200">{item.name}</h3>
              <p className="text-xs text-gray-400 mt-1">{item.type}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1a1a1a] rounded-xl max-w-2xl w-full p-6 shadow-xl relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <button
                className="absolute top-2 right-4 text-gray-400 hover:text-red-500 text-xl cursor-pointer"
                onClick={() => setSelected(null)}
              >
                ✕
              </button>
              <h3 className="text-2xl font-bold mb-2">{selected.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{selected.description}</p>

              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {[selected.coverImage, ...selected.additionalImages].map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`item-${idx}`}
                    className="h-32 rounded-md border border-gray-600 object-cover"
                  />
                ))}
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => sendEmail(selected)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium cursor-pointer"
                >
                  ✉ Enquire
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewItems;
