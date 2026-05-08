import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion } from 'framer-motion';
import { ShieldAlert, Crosshair, Users, ShieldCheck, User, Activity } from 'lucide-react';

const classStyles = {
  'with_mask': { color: '#22c55e', label: 'MASK', borderClass: 'border-green-500' },
  'without_mask': { color: '#ef4444', label: 'NO MASK', borderClass: 'border-red-500' },
  'incorrect_mask': { color: '#f59e0b', label: 'INCORRECT', borderClass: 'border-orange-500' }
};

const LiveDetection = () => {
  const webcamRef = useRef(null);
  const containerRef = useRef(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [faces, setFaces] = useState([]);
  const [stats, setStats] = useState({ total: 0, mask: 0, noMask: 0, incorrect: 0, avgConfidence: 0 });

  useEffect(() => {
    let interval;
    let ws;

    if (isDetecting) {
      // Connect to WebSocket
      ws = new WebSocket('ws://localhost:8000/ws/detect/stream');
      
      ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);
            if (data.results) {
            setFaces(data.results);
            
            // Calculate aggregate stats
            let total = data.results.length;
            let mask = 0; let noMask = 0; let incorrect = 0;
            let confSum = 0;

            data.results.forEach(f => {
                if (f.class_name === 'with_mask') mask++;
                if (f.class_name === 'without_mask') noMask++;
                if (f.class_name === 'incorrect_mask') incorrect++;
                confSum += f.confidence;
            });

            setStats({
                total, mask, noMask, incorrect,
                avgConfidence: total > 0 ? (confSum / total).toFixed(1) : 0
            });
            }
        } catch(e) {}
      };

      interval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN && webcamRef.current) {
          const imageSrc = webcamRef.current.getScreenshot();
          if (imageSrc) {
            ws.send(imageSrc);
          }
        }
      }, 200); // 5 FPS to avoid overloading local CPU

    } else {
      setFaces([]);
      setStats({ total: 0, mask: 0, noMask: 0, incorrect: 0, avgConfidence: 0 });
      if (ws) ws.close();
      if(interval) clearInterval(interval);
    }
    
    return () => {
      if(interval) clearInterval(interval);
      if (ws) ws.close();
    };
  }, [isDetecting]);

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6 p-2">
      
      {/* Main Camera View */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 rounded-xl glass-panel dashboard-card border border-brand-500/30 overflow-hidden relative flex flex-col z-10"
      >
        <div className="bg-slate-900/80 border-b border-brand-500/20 p-3 flex justify-between items-center z-10">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              {isDetecting && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isDetecting ? 'bg-red-500' : 'bg-slate-500'}`}></span>
            </span>
            <h2 className="text-lg font-mono font-semibold text-brand-500">OPTICS_FEED_01</h2>
          </div>
          <button 
            onClick={() => setIsDetecting(!isDetecting)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wider transition-all ${
              isDetecting ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' 
              : 'bg-brand-500 text-white rounded-full glow-button hover:bg-brand-600'
            }`}
          >
            {isDetecting ? 'TERMINATE' : 'INITIALIZE'}
          </button>
        </div>

        {/* Video Container */}
        <div ref={containerRef} className="relative flex-1 bg-black/50 flex items-center justify-center overflow-hidden">
          {/* Cyberpunk Crosshair overlay */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20 z-0">
            <Crosshair className="w-64 h-64 text-brand-500 animate-spin-slow" style={{ animationDuration: '30s' }} />
          </div>

          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
            className="w-full h-full object-contain"
            mirrored={true}
            onUserMedia={() => console.log('Webcam Active')}
          />

          {/* Render Bounding Boxes */}
          {faces.map((face, index) => {
            const style = classStyles[face.class_name];
            
            // Calculate scale factors if the video container is resized dynamically vs the 640x480 source
            // Object.contain centers the video, so bounding boxes must be offset appropriately.
            let scaleX = 1;
            let scaleY = 1;
            let offsetX = 0;
            let offsetY = 0;
            
            if (containerRef.current && webcamRef.current && webcamRef.current.video) {
                const videoRatio = 640 / 480;
                const containerWidth = containerRef.current.clientWidth;
                const containerHeight = containerRef.current.clientHeight;
                const containerRatio = containerWidth / containerHeight;
                
                let renderedWidth = containerWidth;
                let renderedHeight = containerHeight;
                
                if (containerRatio > videoRatio) {
                   renderedWidth = containerHeight * videoRatio;
                   offsetX = (containerWidth - renderedWidth) / 2;
                } else {
                   renderedHeight = containerWidth / videoRatio;
                   offsetY = (containerHeight - renderedHeight) / 2;
                }
                
                scaleX = renderedWidth / 640;
                scaleY = renderedHeight / 480;
            }

            // If webcam mirrored=true, x-coords must be inverted!
            const mirroredX = 640 - (face.box.x + face.box.width);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                layoutId={`box-${index}`}
                className={`absolute border-2 ${style.borderClass} pointer-events-none flex flex-col z-10`}
                style={{
                  left: offsetX + (mirroredX * scaleX),
                  top: offsetY + (face.box.y * scaleY),
                  width: face.box.width * scaleX,
                  height: face.box.height * scaleY,
                  boxShadow: `0 0 10px ${style.color}40, inset 0 0 10px ${style.color}20`
                }}
              >
                {/* Corner Accents */}
                <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${style.borderClass}`}></div>
                <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${style.borderClass}`}></div>
                <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${style.borderClass}`}></div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${style.borderClass}`}></div>
                
                {/* Label */}
                <div 
                  className="absolute -top-7 left-[-2px] px-2 py-1 text-xs font-mono font-bold text-white shadow-lg whitespace-nowrap backdrop-blur-sm"
                  style={{ backgroundColor: `${style.color}cc` }}
                >
                  {style.label} [{face.confidence.toFixed(1)}%]
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      {/* Side Stats Panel */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="md:w-80 flex flex-col gap-4"
      >
        <div className="dashboard-card glass-panel rounded-xl p-5 border border-brand-500/20 z-10">
          <h3 className="text-brand-500 font-mono text-sm tracking-widest mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" /> THREAT_ANALYSIS
          </h3>
          
          <div className="space-y-4">
            <StatRow icon={<Users className="text-blue-400"/>} label="TOTAL DETECTED" value={stats.total} />
            <div className="h-px w-full bg-slate-700/50"></div>
            <StatRow icon={<ShieldCheck className="text-green-500"/>} label="MASK SECURED" value={stats.mask} valueColor="text-green-400" />
            <StatRow icon={<User className="text-red-500"/>} label="NO MASK" value={stats.noMask} valueColor="text-red-400" />
            <StatRow icon={<ShieldAlert className="text-orange-500"/>} label="INCORRECT FIT" value={stats.incorrect} valueColor="text-orange-400" />
            <div className="h-px w-full bg-slate-700/50"></div>
            <div className="flex justify-between items-center py-1">
              <span className="text-xs text-slate-400 font-mono tracking-wider">CONFIDENCE_AVG</span>
              <span className="font-bold text-lg text-brand-400">{stats.avgConfidence}%</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card glass-panel rounded-xl p-5 border border-brand-500/20 flex-1 z-10">
          <h3 className="text-slate-400 font-mono text-xs tracking-widest mb-2">SYSTEM_LOGS</h3>
          <div className="bg-black/50 rounded p-3 h-32 md:h-auto overflow-y-auto font-mono text-[10px] text-brand-500/70 space-y-1">
            <p>&gt; initializing neural array...</p>
            <p>&gt; loading weights cascade...</p>
            <p>&gt; target established</p>
            {isDetecting && (
              <>
                <p>&gt; feed online</p>
                <p className="text-green-500/70">&gt; scanning sector...</p>
              </>
            )}
          </div>
        </div>

      </motion.div>
    </div>
  );
};

const StatRow = ({ icon, label, value, valueColor = "text-white" }) => (
  <div className="flex items-center justify-between py-1">
    <div className="flex items-center gap-3">
      <div className="p-1.5 bg-slate-800 rounded-lg border border-slate-700">
        {React.cloneElement(icon, { size: 16 })}
      </div>
      <span className="text-xs text-slate-300 font-mono tracking-wider">{label}</span>
    </div>
    <span className={`font-bold text-xl ${valueColor}`}>{value}</span>
  </div>
);

export default LiveDetection;
