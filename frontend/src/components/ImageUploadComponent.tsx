import React, { useState } from 'react';
import axios from 'axios';
import { XCircleIcon } from '@heroicons/react/24/outline';

function ImageUploadComponent() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');

  const validateFile = (file:any) => {
    if(file){
        const validTypes = ['image/jpeg', 'image/png'];
        const maxSize = 2 * 1024 * 1024; // 2MB
    
        if (!validTypes.includes(file?.type)) {
          return 'Only JPEG and PNG files are allowed';
        }
        if (file.size > maxSize) {
          return 'File size should not exceed 2MB';
        }
        return '';
    }
    return 
    
  };

  const handleFileChange = (e:any) => {
    const file = e.target.files[0];
    const errorMessage = validateFile(file);
   if(file)
   {
       if (errorMessage) {
         setError(errorMessage);
         setSelectedFile(null);
         setPreview('');
       } else {
         setError('');
         setSelectedFile(file);
         setPreview(URL.createObjectURL(file)); // Set image preview
       }
   }
  };

  const handleDrop = (e:any) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const errorMessage = validateFile(file);

    if (errorMessage) {
      setError(errorMessage);
      setSelectedFile(null);
      setPreview('');
    } else {
      setError('');
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Set image preview
    }
  };

  const handleDragOver = (e:any) => {
    e.preventDefault();
  };

  const handleRemove=()=>{
    setSelectedFile(null)
    setPreview("")
    setError("")
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('File uploaded successfully:', response.data);
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <div
        className="w-full max-w-6xl  min-h-56 p-4 border-2 border-dashed rounded-lg cursor-pointer border-gray-400 hover:border-blue-500 transition-all duration-200 ease-in-out"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {preview &&<div onClick={handleRemove} className='flex justify-center rounded-xl  border-2 border-gray-500 text-gray-500 p-1 hover:border-gray-800  cursor-pointer'>Remove<XCircleIcon className="h-6 w-6 text-gray-500 " /></div>}
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={ handleFileChange}
          disabled={selectedFile?true:false}
          className="hidden w-full h-full"
          id="file-input"
        />
        <label htmlFor="file-input" className=" text-center flex justify-center flex-col items-center">
          {!preview && <p className='font-semibold cursor-pointer'>Drag and drop an image, or click to select</p>}
          
          {preview && <img src={preview} alt="Preview" className="mt-2  w-1/2 h-full object-contain" />}
        </label>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
      >
        Upload Image
      </button>
    </div>
  );
}

export default ImageUploadComponent;
