import React, { useState, useRef } from "react";
import { X, Upload, File, AlertCircle, CheckCircle } from "lucide-react";
import { communicationsAPI } from "../../../../services/api";
import toast from "react-hot-toast";

const UploadFileModal = ({ list, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validExtensions = [".csv", ".xlsx", ".xls"];
      const fileExtension = selectedFile.name
        .toLowerCase()
        .substring(selectedFile.name.lastIndexOf("."));
      
      if (!validExtensions.includes(fileExtension)) {
        toast.error("Please select a CSV or Excel file (.csv, .xlsx, .xls)");
        return;
      }
      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      const validExtensions = [".csv", ".xlsx", ".xls"];
      const fileExtension = droppedFile.name
        .toLowerCase()
        .substring(droppedFile.name.lastIndexOf("."));
      
      if (!validExtensions.includes(fileExtension)) {
        toast.error("Please select a CSV or Excel file (.csv, .xlsx, .xls)");
        return;
      }
      setFile(droppedFile);
      setUploadResult(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setUploading(true);
    try {
      const response = await communicationsAPI.uploadEntries(list.id, file);
      if (response.data.status === "success") {
        setUploadResult(response.data.data);
        toast.success(response.data.message);
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(response.data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(error.response?.data?.detail || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl border border-purple-800/30 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-purple-800/30 sticky top-0 bg-slate-800">
          <h2 className="text-xl font-bold text-white">Upload {list.list_type === "email" ? "Email" : "Phone"} List</h2>
          <button
            onClick={onClose}
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* File Upload Area */}
          {!uploadResult && (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-purple-600/50 rounded-xl p-12 text-center hover:border-purple-400/70 transition-all cursor-pointer bg-purple-900/10"
            >
              <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">
                {file ? file.name : "Click or drag file here to upload"}
              </p>
              <p className="text-purple-300 text-sm">
                Supports CSV and Excel files (.csv, .xlsx, .xls)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div className="space-y-4">
              <div className="bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <h3 className="text-white font-medium">Upload Complete</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-purple-300">Total Rows:</span>
                    <span className="text-white ml-2">{uploadResult.total_rows}</span>
                  </div>
                  <div>
                    <span className="text-green-400">Added:</span>
                    <span className="text-white ml-2">{uploadResult.added}</span>
                  </div>
                  <div>
                    <span className="text-yellow-400">Skipped:</span>
                    <span className="text-white ml-2">{uploadResult.skipped}</span>
                  </div>
                </div>
              </div>

              {/* Errors */}
              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div className="bg-red-900/20 border border-red-800/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <h3 className="text-red-400 font-medium">Errors ({uploadResult.errors.length})</h3>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {uploadResult.errors.slice(0, 10).map((error, idx) => (
                      <div key={idx} className="text-red-300 text-sm">
                        Row {error.row}: {error.error}
                      </div>
                    ))}
                    {uploadResult.errors.length > 10 && (
                      <div className="text-red-400 text-sm">
                        ... and {uploadResult.errors.length - 10} more errors
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-purple-800/30">
            {uploadResult ? (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
              >
                Close
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-purple-300 hover:text-purple-200 transition-colors"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!file || uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFileModal;

