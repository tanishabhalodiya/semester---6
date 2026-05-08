import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload as UploadIcon, FileUp, CheckCircle2, Film, Image, RefreshCw } from 'lucide-react';
import axios from 'axios';

const UploadDetection = () => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const isVideo = file && file.type.startsWith('video/');

  const handleDragOver = (e) => { e.preventDefault(); };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setResult(null);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const processFile = async () => {
    if (!file) return;
    setIsProcessing(true);

    const formData = new FormData();
    formData.append('file', file);

    // Choose endpoint based on file type
    const endpoint = isVideo
      ? 'http://localhost:8000/api/detect/video'
      : 'http://localhost:8000/api/detect/image';

    try {
      const response = await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = response.data;
      // For images: data.results[] contains face detections
      // For videos: data.total_counts with mask/no_mask/incorrect_mask
      let mask = 0, noMask = 0, incorrect = 0, total = 0;

      if (isVideo) {
        mask = data.total_counts?.with_mask || 0;
        noMask = data.total_counts?.without_mask || 0;
        incorrect = data.total_counts?.incorrect_mask || 0;
        total = mask + noMask + incorrect;
      } else {
        const detections = data.results || [];
        detections.forEach(f => {
          if (f.class_name === 'with_mask') mask++;
          else if (f.class_name === 'without_mask') noMask++;
          else if (f.class_name === 'incorrect_mask') incorrect++;
        });
        total = detections.length;
      }

      setResult({
        total,
        mask,
        noMask,
        incorrect,
        previewUrl: URL.createObjectURL(file),
        fileType: isVideo ? 'video' : 'image',
        fileName: file.name,
        fileSize: (file.size / 1024 / 1024).toFixed(2),
      });
    } catch (error) {
      console.error('Detection error:', error);
      // Fallback to a demo result if backend is not running
      setResult({
        total: 3,
        mask: 2,
        noMask: 0,
        incorrect: 1,
        previewUrl: URL.createObjectURL(file),
        fileType: isVideo ? 'video' : 'image',
        fileName: file.name,
        fileSize: (file.size / 1024 / 1024).toFixed(2),
        isDemo: true,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScan = () => { setResult(null); setFile(null); };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel dashboard-card rounded-2xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black tracking-tight text-white mb-2">
            Media Detection
          </h2>
          <p className="text-slate-400">Upload an <span className="text-blue-400">image</span> or <span className="text-brand-500">video</span> — our AI engine will analyze every face</p>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              {/* Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`w-full max-w-2xl h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer relative overflow-hidden group
                  ${file
                    ? isVideo
                      ? 'border-brand-500 bg-brand-500/5'
                      : 'border-blue-400 bg-blue-500/5'
                    : 'border-slate-600 hover:border-brand-500 hover:bg-slate-800/50'
                  }`}
              >
                {/* Processing overlay */}
                {isProcessing && (
                  <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                    <div className="w-20 h-20 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-brand-500 font-mono animate-pulse tracking-widest text-sm">
                      {isVideo ? 'PROCESSING VIDEO FRAMES...' : 'ANALYZING FACIAL GEOMETRY...'}
                    </p>
                    <p className="text-slate-500 text-xs font-mono">This may take a moment for videos</p>
                  </div>
                )}

                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />

                <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer z-0 px-6 text-center">
                  {file ? (
                    <>
                      {isVideo
                        ? <Film className="w-16 h-16 text-brand-500 mb-4 group-hover:scale-110 transition-transform" />
                        : <Image className="w-16 h-16 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                      }
                      <p className="text-lg font-bold text-white truncate max-w-xs">{file.name}</p>
                      <p className="text-sm text-slate-400 mt-2">
                        {(file.size / 1024 / 1024).toFixed(2)} MB · <span className={isVideo ? 'text-brand-500' : 'text-blue-400'}>{isVideo ? 'Video' : 'Image'}</span> · Click to replace
                      </p>
                    </>
                  ) : (
                    <>
                      <UploadIcon className="w-16 h-16 text-slate-500 mb-4 group-hover:text-brand-500 group-hover:scale-110 transition-all duration-300" />
                      <p className="text-lg font-medium text-white mb-1"><span className="text-brand-500">Click to upload</span> or drag and drop</p>
                      <p className="text-sm text-slate-500">PNG, JPG, MP4, MOV — Images and Videos Supported</p>
                    </>
                  )}
                </label>
              </div>

              {/* Type indicators */}
              <div className="flex gap-4 mt-4 text-xs font-mono text-slate-500">
                <span className="flex items-center gap-1"><Image className="w-3 h-3 text-blue-400" /> Images → instant detection</span>
                <span className="flex items-center gap-1"><Film className="w-3 h-3 text-brand-500" /> Videos → frame-by-frame analysis</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!file || isProcessing}
                onClick={processFile}
                className={`mt-8 px-10 py-3.5 rounded-full font-bold tracking-wider transition-all text-base
                  ${file && !isProcessing
                    ? 'bg-brand-500 text-white glow-button hover:bg-brand-600'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
              >
                {isVideo ? '🎬 Analyze Video' : '🔍 Analyze Image'}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6"
            >
              {result.isDemo && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 text-center text-sm text-orange-400 font-mono">
                  ⚠ Backend offline — showing demo results. Start `uvicorn app:app --reload` to enable real detection.
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Preview Panel */}
                <div className="flex-1 rounded-2xl overflow-hidden border border-brand-500/30 shadow-[0_0_30px_rgba(216,91,255,0.15)] bg-black min-h-[280px] relative flex items-center justify-center">
                  {result.fileType === 'video' ? (
                    <video
                      src={result.previewUrl}
                      controls
                      className="w-full h-full object-contain max-h-[400px]"
                    />
                  ) : (
                    <img
                      src={result.previewUrl}
                      alt="Analyzed"
                      className="w-full h-full object-contain max-h-[400px] opacity-90"
                    />
                  )}
                  {/* Type badge */}
                  <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border
                    ${result.fileType === 'video'
                      ? 'bg-brand-500/20 text-brand-400 border-brand-500/40'
                      : 'bg-blue-500/20 text-blue-400 border-blue-500/40'}`}>
                    {result.fileType === 'video' ? <Film className="w-3 h-3" /> : <Image className="w-3 h-3" />}
                    {result.fileType === 'video' ? 'VIDEO' : 'IMAGE'}
                  </div>
                </div>

                {/* Results Panel */}
                <div className="lg:w-72 flex flex-col gap-4">
                  <div className="dashboard-card rounded-2xl p-6 border border-brand-500/20">
                    <div className="flex items-center gap-3 mb-6">
                      <CheckCircle2 className="text-green-500 w-7 h-7 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-white">SCAN COMPLETE</h3>
                        <p className="text-xs text-brand-500 font-mono">
                          {result.fileType === 'video' ? 'CUMULATIVE FRAME COUNTS' : 'FACES DETECTED'}: {result.total}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Mask count */}
                      <div className="flex justify-between items-center px-4 py-3 bg-black/30 rounded-xl border border-green-500/30">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_6px_#22c55e]"></span>
                          <span className="text-sm text-slate-300">With Mask</span>
                        </div>
                        <span className="font-black text-green-400 text-lg">{result.mask}</span>
                      </div>
                      {/* No Mask count */}
                      <div className="flex justify-between items-center px-4 py-3 bg-black/30 rounded-xl border border-red-500/30">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_6px_#ef4444]"></span>
                          <span className="text-sm text-slate-300">No Mask</span>
                        </div>
                        <span className="font-black text-red-400 text-lg">{result.noMask}</span>
                      </div>
                      {/* Incorrect count */}
                      <div className="flex justify-between items-center px-4 py-3 bg-black/30 rounded-xl border border-orange-500/30">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 bg-orange-500 rounded-full shadow-[0_0_6px_#f59e0b]"></span>
                          <span className="text-sm text-slate-300">Incorrect Mask</span>
                        </div>
                        <span className="font-black text-orange-400 text-lg">{result.incorrect}</span>
                      </div>
                    </div>

                    {/* File info */}
                    <div className="mt-4 pt-4 border-t border-slate-800">
                      <p className="text-xs text-slate-600 font-mono truncate">{result.fileName}</p>
                      <p className="text-xs text-slate-600 font-mono">{result.fileSize} MB · {result.fileType}</p>
                    </div>
                  </div>

                  <button
                    onClick={resetScan}
                    className="flex items-center justify-center gap-2 w-full py-3 text-sm text-slate-400 hover:text-brand-500 border border-slate-700 hover:border-brand-500 rounded-xl transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" /> Scan Another File
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default UploadDetection;
