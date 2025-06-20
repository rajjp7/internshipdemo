import React, { useState } from 'react';
import { motion } from 'framer-motion';
import imageCompression from 'browser-image-compression';

const AddItem = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const newPreviews = newFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setAdditionalImages((prev) => [...prev, ...newFiles]);
    setAdditionalPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const updatedFiles = [...additionalImages];
    const updatedPreviews = [...additionalPreviews];
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setAdditionalImages(updatedFiles);
    setAdditionalPreviews(updatedPreviews);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Item name is required';
    if (!type.trim()) newErrors.type = 'Item type is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!coverImage) newErrors.coverImage = 'Cover image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.2,
      maxWidthOrHeight: 800,
      useWebWorker: true,
    };
    return await imageCompression(file, options);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const compressedCover = await compressImage(coverImage);
      const coverBase64 = await convertToBase64(compressedCover);

      const compressedAdditional = await Promise.all(
        additionalImages.map((img) => compressImage(img))
      );
      const additionalBase64 = await Promise.all(
        compressedAdditional.map((img) => convertToBase64(img))
      );

      const newItem = {
        name,
        type,
        description,
        coverImage: coverBase64,
        additionalImages: additionalBase64,
      };

      const existingItems = JSON.parse(localStorage.getItem('items') || '[]');
      existingItems.push(newItem);
      localStorage.setItem('items', JSON.stringify(existingItems));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      setName('');
      setType('');
      setDescription('');
      setCoverImage(null);
      setCoverPreview(null);
      setAdditionalImages([]);
      setAdditionalPreviews([]);
      setErrors({});
    } catch (error) {
      alert('❌ Failed to add item. Try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-200 flex items-center justify-center px-4 py-10 font-sans">
      <motion.div
        className="w-full max-w-3xl bg-[#1a1a1a] border border-[#2a2a2a] shadow-xl rounded-2xl p-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-100 tracking-tight">
          Add New Item
        </h2>

        {success && (
          <div className="mb-6 text-sm text-center text-green-400 bg-green-800 bg-opacity-10 p-3 rounded-lg border border-green-600">
            ✅ Item successfully added!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Item Name</label>
            <input
              type="text"
              placeholder="e.g., Nike Sneakers"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#121212] border border-[#333] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Item Type</label>
            <input
              type="text"
              placeholder="e.g., Shoes, T-shirt, Sports Gear"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-[#121212] border border-[#333] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Description</label>
            <textarea
              placeholder="Add a short description about the item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#121212] border border-[#333] text-gray-200 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Cover Image</label>
            <label className="flex items-center justify-center h-36 border-2 border-dashed border-[#444] rounded-lg cursor-pointer hover:border-blue-500 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
              />
              <span className="text-sm text-gray-400">
                {coverImage ? '📁 File Selected' : 'Click to upload a cover image'}
              </span>
            </label>
            {coverPreview && (
              <motion.img
                src={coverPreview}
                alt="Cover Preview"
                className="mt-4 w-40 h-40 object-cover rounded-lg border border-[#333] shadow-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
            {errors.coverImage && <p className="text-red-500 text-sm">{errors.coverImage}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-400">Additional Images</label>
            <label className="flex items-center justify-center h-32 border-2 border-dashed border-[#444] rounded-lg cursor-pointer hover:border-purple-500 transition">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesChange}
                className="hidden"
              />
              <span className="text-sm text-gray-400">
                {additionalImages.length ? '📁 Files Selected' : 'Click to upload additional images'}
              </span>
            </label>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {additionalPreviews.map((img, idx) => (
                <motion.div
                  key={idx}
                  className="relative group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                >
                  <img
                    src={img.preview}
                    alt={`Preview ${idx}`}
                    className="w-full h-24 object-cover rounded-md border border-[#333]"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-center pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className={`${
                loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-medium px-6 py-2 rounded-lg shadow-lg transition-all duration-200 cursor-pointer`}
            >
              {loading ? '⏳ Submitting...' : '➕ Add Item'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddItem;
