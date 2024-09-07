import React, { useState } from "react";
import axios from "axios";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { firebaseStorage } from "../config/firebase.config.js";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function ImageUploadComponent(props: {
  userId: string;
  updateNeedReload: () => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false)

  let userId = props.userId;
  const updateNeedReload = props.updateNeedReload;
  const validateFile = (file: any) => {
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/png"];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!validTypes.includes(file?.type)) {
        return "Only JPEG and PNG files are allowed";
      }
      if (file.size > maxSize) {
        return "File size should not exceed 2MB";
      }
      return "";
    }
    return;
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    const errorMessage = validateFile(file);
    if (file) {
      if (errorMessage) {
        setError(errorMessage);
        setSelectedFile(null);
        setPreview("");
      } else {
        setError("");
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file)); // Set image preview
      }
    }
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const errorMessage = validateFile(file);

    if (errorMessage) {
      setError(errorMessage);
      setSelectedFile(null);
      setPreview("");
    } else {
      setError("");
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Set image preview
    }
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview("");
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("No file selected.");
      return;
    }
    setIsLoading(true)
    const formData = new FormData();
    formData.append("picture", selectedFile);
    console.log({ selectedFile });
    try {
      // To Upload image to firebase storage----------
      const pictureData = selectedFile;
      const fileName = pictureData?.name;
      const storageRef = ref(
        firebaseStorage,
        `/monster-ai/${Date.now()}-` + fileName
      );
      const uploadBtyesVariable = await uploadBytes(storageRef, pictureData);
      const downloadUrl = await getDownloadURL(uploadBtyesVariable.ref);
      // -------
      //   console.log({downloadUrl})

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/images`,
        { userId, imagePath: downloadUrl }
      );

      if (response) {
        setIsLoading(false)
        alert("added file successfully");
        updateNeedReload();
        setSelectedFile(null);
        setPreview("");
        setError("");
      }
    } catch (err) {
        setIsLoading(false)
      alert("Error uploading file:");
    }
  };

  return (
    <div className="flex flex-col items-center p-4 space-y-4">
      <div
        className="w-full max-w-6xl flex flex-col justify-center  min-h-36 max-h-full p-4 border-4 border-dashed rounded-lg cursor-pointer border-gray-400 hover:border-blue-500  transition-all duration-200 ease-in-out"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {preview && (
          <div
            onClick={handleRemove}
            className="flex justify-center rounded-xl  border-2 border-gray-500 text-gray-500 p-1 hover:border-gray-800  cursor-pointer"
          >
            Remove
            <XCircleIcon className="h-6 w-6 text-gray-500 " />
          </div>
        )}
        <input
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
          disabled={selectedFile ? true : false}
          className="hidden w-full h-full"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className=" text-center flex justify-center flex-col items-center"
        >
          {!preview && (
            <p className="font-semibold cursor-pointer text-xl opacity-55 hover:opacity-100">
              Drag and drop an image, or click to select
            </p>
          )}

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2  w-full h-[500px] object-contain"
            />
          )}
        </label>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      {!isLoading?<button
        disabled={selectedFile ? false : true}
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200"
      >
        Upload
      </button>
      :<div className="bg-blue-500 px-4 py-2 text-white flex items-center gap-1  rounded-lg">
        <div className=" border-l-2 border-b-2  w-3 h-3 rounded-full animate-spin"></div>
        Uploading
        <p className="animate-pulse">...</p>
      </div>}
    </div>
  );
}

export default ImageUploadComponent;
