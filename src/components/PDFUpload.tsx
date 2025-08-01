"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { AlertCircle, Upload } from "lucide-react";
import clsx from "clsx";
import { divide } from "lodash";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
  maxSize?: number;
}

export const PDFUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  isLoading,
  maxSize,
}) => {
  const [uploadError, setUploadError] = useState<null | string>(null);
  const onDrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setUploadError(null);

      if (rejectedFiles.length > 0) {
        setUploadError("Please upload a valid PDF file under 10MB");
        return;
      }

      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
    [onFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: false,
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
          isDragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} disabled={isLoading} />
        <div className="flex flex-col items-center space-y-4">
          <Upload
            className={`w-12 h-12 ${
              isDragActive ? "text-blue-500" : "text-gray-400"
            }`}
          />
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? "Drop your PDF here" : "Upload a PDF document"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drap and drop or click to browse (Max 10MB)
            </p>
          </div>
          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-600">Processing...</span>
            </div>
          )}
        </div>
      </div>
      {uploadError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center  space-x-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-sm text-red-700">{uploadError}</span>
        </div>
      )}
    </div>
  );
};
