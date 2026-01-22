import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

// Convert file to base64
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default function ImageUpload({ images, setImages, maxImages = 4 }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    await processFiles(files);
  };

  const processFiles = async (files) => {
    if (images.length + files.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    try {
      const newImages = await Promise.all(
        files.map(async (file) => {
          const base64 = await convertToBase64(file);
          return {
            file,
            preview: URL.createObjectURL(file),
            base64,
          };
        })
      );
      setImages([...images, ...newImages]);
    } catch (error) {
      console.error('Error processing images:', error);
      alert('Failed to process images');
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    await processFiles(files);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
          ${isDragging 
            ? 'border-green-600 bg-green-50' 
            : 'border-gray-400 hover:border-green-600 hover:bg-green-50'
          }
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple
          accept="image/*"
          className="hidden"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-green-600 text-black rounded-full flex items-center justify-center">
            <Upload size={24} />
          </div>
          <div>
            <p className="font-medium text-black">Click to upload or drag and drop</p>
            <p className="text-sm text-slate-700">SVG, PNG, JPG or GIF (max {maxImages} images)</p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
              <img
                src={img.preview}
                alt={`Preview ${idx + 1}`}
                className="w-full h-auto object-contain max-h-64"
              />
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
