import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, Eye, Upload, BarChart3, ShieldAlert, User } from 'lucide-react';

const features = [
  {
    icon: <Eye className="w-7 h-7 text-brand-500" />,
    title: 'Real-Time Webcam Detection',
    desc: 'Stream your webcam through the PyTorch model. Bounding boxes rendered live at 10fps with color-coded classes.',
    badge: 'Live',
    badgeColor: 'bg-brand-500/20 text-brand-400 border-brand-500/30'
  },
  {
    icon: <Upload className="w-7 h-7 text-blue-400" />,
    title: 'Image & Video Upload',
    desc: 'Upload any JPG, PNG, or MP4 file. Our engine processes every frame and returns detection counts & previews.',
    badge: 'Async',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-green-400" />,
    title: '3-Class Mask Classification',
    desc: 'Beyond binary detection — correctly identifies "With Mask", "Without Mask", and "Incorrectly Worn Mask".',
    badge: '99.4% Acc',
    badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30'
  },
  {
    icon: <BarChart3 className="w-7 h-7 text-orange-400" />,
    title: 'Analytics Dashboard',
    desc: 'Aggregated stats from all sessions. View class distribution, historical compliance metrics and trend analysis.',
    badge: 'Recharts',
    badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
  }
];

const stats = [
  { icon: <ShieldCheck className="w-6 h-6 text-green-400" />, value: '99.4%', label: 'Peak Accuracy' },
  { icon: <User className="w-6 h-6 text-red-400" />, value: '3', label: 'Mask Classes' },
  { icon: <Eye className="w-6 h-6 text-brand-500" />, value: '10 FPS', label: 'Live Detection' },
  { icon: <ShieldAlert className="w-6 h-6 text-orange-400" />, value: '5,106', label: 'Training Images' },
];

const Home = () => {
  return (
    <div className="flex flex-col items-center pb-40 min-h-[calc(100vh-80px)] overflow-x-hidden relative">
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-5xl px-4 pt-20 flex flex-col items-center"
      >
        {/* Badge */}
        <div className="mb-8 px-4 py-1.5 rounded-full border border-slate-700 bg-slate-800/50 backdrop-blur-md flex items-center gap-2">
            <span className="bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">New</span>
            <span className="text-sm text-slate-300">v1.0 AI Engine is available to deploy</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tight text-white leading-[1.1]">
          Intelligent <br />
          <span className="text-brand-500">Face Mask</span> Detection
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-12 font-light tracking-wide max-w-2xl mx-auto">
          Advanced computer vision ensuring public health compliance. Deep neural networks identifying mask adherence in real-time using PyTorch.
        </p>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 items-center"
        >
          <Link to="/live">
            <button className="px-8 py-4 font-bold text-white bg-brand-500 rounded-full glow-button text-lg tracking-wide hover:bg-brand-600">
              🎥 Start Live Detection
            </button>
          </Link>
          <Link to="/upload">
            <button className="px-8 py-4 font-bold text-slate-300 bg-slate-800/60 border border-slate-700 rounded-full text-lg tracking-wide hover:border-brand-500 hover:text-brand-500 transition-all">
              📁 Upload Image / Video
            </button>
          </Link>
        </motion.div>

      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="mt-20 w-full max-w-5xl px-4 relative z-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="dashboard-card rounded-2xl p-5 text-center border border-slate-800">
              <div className="flex justify-center mb-3">{s.icon}</div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-slate-500 mt-1 font-mono tracking-widest uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="mt-16 w-full max-w-6xl px-4 relative z-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">System Capabilities</h2>
          <p className="text-slate-500">Everything you need to monitor mask compliance at scale.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, borderColor: 'rgba(216,91,255,0.4)' }}
              transition={{ duration: 0.2 }}
              className="dashboard-card glass-panel rounded-2xl p-7 border border-slate-800"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-slate-900">{feat.icon}</div>
                <span className={`text-xs font-mono px-2 py-1 rounded-full border ${feat.badgeColor}`}>{feat.badge}</span>
              </div>
              <h3 className="font-bold text-xl text-white mb-2">{feat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Decorative Mockup */}
      <motion.div 
         initial={{ opacity: 0, y: 80 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 1, delay: 0.8 }}
         className="mt-20 w-full max-w-6xl px-4 relative z-10"
      >
          <div className="w-full h-80 md:h-[420px] dashboard-card p-6 border border-brand-500/20 relative overflow-hidden rounded-2xl">
             <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-brand-500/20 via-transparent to-transparent pointer-events-none"></div>
             <div className="flex h-full w-full opacity-60">
                <div className="w-1/4 h-full border-r border-slate-700/50 pr-4 flex-col gap-4 hidden md:flex">
                   <div className="h-8 w-3/4 bg-slate-800 rounded"></div>
                   <div className="h-4 w-1/2 bg-slate-800 rounded mt-8"></div>
                   <div className="h-4 w-2/3 bg-slate-800 rounded"></div>
                   <div className="h-4 w-1/2 bg-slate-800 rounded"></div>
                   <div className="h-4 w-2/3 bg-brand-500/20 rounded mt-4"></div>
                </div>
                <div className="flex-1 pl-0 md:pl-6 flex flex-col gap-6">
                   <div className="flex justify-between">
                     <div className="h-6 w-1/3 bg-slate-800 rounded"></div>
                     <div className="h-6 w-24 bg-brand-500/30 rounded"></div>
                   </div>
                   <div className="flex gap-4">
                      <div className="flex-1 h-24 bg-slate-800/80 rounded-xl border border-green-500/10 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-green-500/30"></div>
                      </div>
                      <div className="flex-1 h-24 bg-slate-800/80 rounded-xl border border-red-500/10 hidden sm:flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-500/30"></div>
                      </div>
                      <div className="flex-1 h-24 bg-slate-800/80 rounded-xl border border-orange-500/10 hidden lg:flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-orange-500/30"></div>
                      </div>
                   </div>
                   <div className="flex-1 w-full bg-slate-800/50 rounded-xl border border-slate-800 relative overflow-hidden">
                        <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-brand-500/30 to-transparent"></div>
                   </div>
                </div>
             </div>
          </div>
      </motion.div>

    </div>
  );
};

export default Home;
