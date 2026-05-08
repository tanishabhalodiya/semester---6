import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LiveDetection from './pages/LiveDetection';
import UploadDetection from './pages/UploadDetection';
import Analytics from './pages/Analytics';
import TrainingInfo from './pages/TrainingInfo';

// --- Background Neural Node Animation ---
const BackgroundNodes = () => {
  // Generate random stable coordinates and timings only once
  const nodes = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 20,
      delay: Math.random() * 5
    }));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {nodes.map(node => (
        <motion.div
          key={node.id}
          className="absolute rounded-full bg-brand-500 opacity-20"
          style={{
            width: `${node.size}px`,
            height: `${node.size}px`,
            left: `${node.x}%`,
            top: `${node.y}%`,
            boxShadow: `0 0 ${node.size * 2}px rgba(216,91,255,0.8)`
          }}
          animate={{
            y: ['0%', '-30%', '0%'],
            x: ['0%', '15%', '0%'],
            opacity: [0.1, 0.4, 0.1]
          }}
          transition={{
            duration: node.duration,
            repeat: Infinity,
            ease: "linear",
            delay: node.delay
          }}
        />
      ))}
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden selection:bg-brand-500 selection:text-white bg-grid-pattern relative">
        {/* Ambient background glow from the Proxima theme */}
        <div className="bg-ambient-glow"></div>
        <BackgroundNodes />
        
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/live" element={<LiveDetection />} />
              <Route path="/upload" element={<UploadDetection />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/training" element={<TrainingInfo />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
