import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileType } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isProcessing }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    disabled: isProcessing,
    multiple: false
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <motion.div
        {...getRootProps()}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative overflow-hidden p-12 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-400 bg-blue-500/10' : 'border-gray-600 hover:border-blue-400 hover:bg-gray-800/50'}
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          backdrop-blur-sm`}
      >
        <input {...getInputProps()} />
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          {isDragActive ? (
            <Upload className="w-16 h-16 mx-auto mb-4 text-blue-400" />
          ) : (
            <FileType className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          )}
        </motion.div>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xl font-medium text-blue-300 mb-2">
            {isDragActive ? 'Drop the CSV file here' : 'Upload Network Traffic Data'}
          </p>
          <p className="text-sm text-gray-400">
            Drag & drop a CSV file here, or click to select
          </p>
        </motion.div>
        
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isDragActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};