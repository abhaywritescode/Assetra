import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, X, File as FileIcon, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

export default function UploadPage() {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState(null); // 'idle', 'uploading', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef(null);

    const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

    const validateFile = (file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return 'Invalid file type. Only JPG, PNG, and PDF are allowed.';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'File size exceeds 15MB limit.';
        }
        return null;
    };

    const handleFilesAdded = (newFiles) => {
        const fileArray = Array.from(newFiles);
        let errorFound = null;

        const validFiles = fileArray.filter(file => {
            // Check MIME and Size
            const error = validateFile(file);
            if (error) {
                errorFound = error;
                return false;
            }
            
            // STRICT DUPLICATE PREVENTION
            const isDuplicate = files.some(existingFile => 
                existingFile.name === file.name && 
                existingFile.size === file.size && 
                existingFile.lastModified === file.lastModified
            );
            
            if (isDuplicate) {
                // Silently ignore the duplicate to prevent clutter
                return false;
            }
            
            return true;
        }).map(file => Object.assign(file, {
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        }));

        if (errorFound) {
            setErrorMessage(errorFound);
            setUploadStatus('error');
        } else if (validFiles.length > 0) {
            setErrorMessage('');
            setUploadStatus('idle');
        }

        // Explicitly reset the input value so the same file can be selected again if it was removed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        setFiles(prev => [...prev, ...validFiles]);
    };

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFilesAdded(e.dataTransfer.files);
        }
    }, [files]);

    const removeFile = (indexToRemove) => {
        setFiles(files.filter((_, index) => index !== indexToRemove));
    };

    const handleUpload = () => {
        if (files.length === 0) return;
        
        // Grab files in memory and IMMEDIATELY clear UI state
        const filesToUpload = [...files];
        setFiles([]);
        setUploadStatus('uploading');
        setUploadProgress(0);

        const formData = new FormData();
        filesToUpload.forEach(file => {
            formData.append('receipts', file);
        });

        // Asynchronous background upload
        api.post('/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
            }
        }).then(() => {
            setUploadStatus('success');
            // Clean up memory
            filesToUpload.forEach(file => {
                if (file.preview) URL.revokeObjectURL(file.preview);
            });
            setTimeout(() => {
                setUploadStatus('idle');
                setUploadProgress(0);
            }, 4000);
        }).catch((error) => {
            console.error("Upload failed", error);
            setUploadStatus('error');
            setErrorMessage(error.response?.data?.error || 'An error occurred during upload.');
        });
    };

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto text-slate-50 w-full">
            <h1 className="text-3xl font-bold mb-2">Upload Receipts</h1>
            <p className="text-slate-400 mb-8">Securely upload your files for processing.</p>

            {/* Error Toast */}
            {uploadStatus === 'error' && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{errorMessage}</p>
                    <button onClick={() => setUploadStatus('idle')} className="ml-auto text-red-400 hover:text-red-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Success Toast */}
            {uploadStatus === 'success' && (
                <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-center gap-3 shadow-lg">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <p>Files uploaded and saved successfully!</p>
                </div>
            )}

            {/* Background Uploading Toast */}
            {uploadStatus === 'uploading' && (
                <div className="mb-6 bg-blue-500/10 border border-blue-500/30 text-blue-400 p-4 rounded-xl flex items-center justify-between gap-3 shadow-lg transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                        <p className="font-medium">Uploading in background... {uploadProgress}%</p>
                    </div>
                </div>
            )}

            <div 
                className={`w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all ${
                    isDragging 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-slate-700 bg-slate-900/50 hover:bg-slate-900/80 hover:border-slate-600'
                }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
            >
                <div className="bg-slate-800 p-4 rounded-full mb-4">
                    <UploadCloud className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Drag & Drop files here</h3>
                <p className="text-slate-400 text-center mb-6 max-w-sm">
                    Supports JPG, PNG, and PDF up to 15MB.
                </p>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFilesAdded(e.target.files)}
                    className="hidden"
                    accept="image/jpeg,image/png,application/pdf"
                    multiple
                    capture="environment"
                />
                
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:ring-4 focus:ring-blue-500/20 shadow-lg shadow-blue-500/20"
                >
                    Browse Files
                </button>
            </div>

            {/* Preview Section */}
            {files.length > 0 && (
                <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <h3 className="text-lg font-semibold mb-4">Selected Files ({files.length})</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {files.map((file, idx) => (
                            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4 relative group shadow-sm">
                                <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {file.preview ? (
                                        <img src={file.preview} alt="preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <FileIcon className="w-6 h-6 text-slate-400" />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate">{file.name}</p>
                                    <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                                <button 
                                    onClick={() => removeFile(idx)}
                                    className="p-1.5 bg-slate-800 rounded-lg text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400 focus:opacity-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button 
                            onClick={handleUpload}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20"
                        >
                            Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
