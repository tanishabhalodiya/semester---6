import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell } from 'recharts';
import { Database, BrainCircuit, Activity, Network, ListTree } from 'lucide-react';

const EPOCH_DATA = [
  { epoch: 1, loss: 0.95, accuracy: 0.65 },
  { epoch: 2, loss: 0.65, accuracy: 0.78 },
  { epoch: 3, loss: 0.45, accuracy: 0.85 },
  { epoch: 4, loss: 0.35, accuracy: 0.89 },
  { epoch: 5, loss: 0.28, accuracy: 0.92 },
  { epoch: 6, loss: 0.22, accuracy: 0.94 },
  { epoch: 7, loss: 0.18, accuracy: 0.95 },
  { epoch: 8, loss: 0.15, accuracy: 0.96 },
  { epoch: 9, loss: 0.12, accuracy: 0.97 },
  { epoch: 10, loss: 0.10, accuracy: 0.98 },
  { epoch: 11, loss: 0.08, accuracy: 0.98 },
  { epoch: 12, loss: 0.07, accuracy: 0.99 },
  { epoch: 13, loss: 0.06, accuracy: 0.99 },
  { epoch: 14, loss: 0.05, accuracy: 0.99 },
  { epoch: 15, loss: 0.04, accuracy: 0.99 },
];

const DATASET_SPLIT = [
  { name: 'Training Set', value: 3400, color: '#d85bff' },
  { name: 'Validation Set', value: 853, color: '#3b82f6' },
  { name: 'Test Set', value: 853, color: '#10b981' }
];

const TrainingInfo = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 py-8 px-4 relative z-10">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/10 mb-6">
          <BrainCircuit className="w-4 h-4 text-brand-500" />
          <span className="text-xs font-mono text-brand-500 tracking-wider">NEURAL_ARCHITECTURE_v1.0</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          Model Diagnostics & Architecture
        </h1>
        <p className="text-slate-400">
          A deep dive into the Convolutional Neural Network securing the MASK-NET ecosystem. Trained on thousands of dynamic parameter sets.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Network Architecture */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="dashboard-card glass-panel rounded-2xl p-6 border border-brand-500/20">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Network className="w-5 h-5 text-brand-500" />
              PyTorch Architecture
            </h3>
            
            <div className="space-y-4">
               <LayerNode name="Conv2D (RGB Input)" details="in_channels: 3, out: 32, ker: 3x3" />
               <Connector />
               <LayerNode name="MaxPool2D + ReLU" details="pool_size: 2x2" />
               <Connector />
               <LayerNode name="Conv2D (Feature Ext.)" details="in: 32, out: 64, ker: 3x3" />
               <Connector />
               <LayerNode name="MaxPool2D + Dropout" details="Dropout(p=0.25)" />
               <Connector />
               <LayerNode name="Flatten Core" details="Linear Transformation" />
               <Connector />
               <LayerNode name="Fully Connected (Dense)" details="out: 128, Activation: ReLU" highlight />
               <Connector />
               <LayerNode name="Output Classifier" details="out: 3 classes (Mask, No Mask, Incorrect)" final />
            </div>
          </div>
        </motion.div>

        {/* Right Column: Training Graphs */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Accuracy Chart */}
          <div className="dashboard-card glass-panel rounded-2xl p-6 border border-brand-500/20">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-500" />
                  Training Accuracy
                </h3>
                <span className="text-green-500 font-mono text-sm bg-green-500/10 px-2 py-1 rounded">peak: 99.4%</span>
             </div>
             
             <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={EPOCH_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                   <defs>
                     <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                   <XAxis dataKey="epoch" stroke="#525252" tick={{ fill: '#a3a3a3', fontSize: 12 }} />
                   <YAxis stroke="#525252" tick={{ fill: '#a3a3a3', fontSize: 12 }} domain={[0.5, 1]} />
                   <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', border: '1px solid #22c55e', borderRadius: '8px' }}
                      itemStyle={{ color: '#22c55e' }}
                   />
                   <Area type="monotone" dataKey="accuracy" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Loss Chart */}
          <div className="dashboard-card glass-panel rounded-2xl p-6 border border-brand-500/20">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-500" />
                  Loss Degradation
                </h3>
                <span className="text-red-500 font-mono text-sm bg-red-500/10 px-2 py-1 rounded">min: 0.041</span>
             </div>
             
             <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={EPOCH_DATA} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                   <XAxis dataKey="epoch" stroke="#525252" tick={{ fill: '#a3a3a3', fontSize: 12 }} />
                   <YAxis stroke="#525252" tick={{ fill: '#a3a3a3', fontSize: 12 }} domain={[0, 1]} />
                   <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', border: '1px solid #ef4444', borderRadius: '8px' }}
                      itemStyle={{ color: '#ef4444' }}
                   />
                   <Line type="monotone" dataKey="loss" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* Dataset Component */}
          <div className="dashboard-card glass-panel rounded-2xl p-6 border border-brand-500/20">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-500" />
                  Pascal VOC Dataset Configuration
                </h3>
                <span className="text-blue-500 font-mono text-sm bg-blue-500/10 px-2 py-1 rounded">5,106 Images</span>
             </div>
             
             <div className="flex flex-col md:flex-row items-center gap-8">
               <div className="h-[200px] w-[200px]">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={DATASET_SPLIT}
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                       stroke="rgba(0,0,0,0)"
                     >
                       {DATASET_SPLIT.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                     </Pie>
                     <RechartsTooltip 
                        contentStyle={{ backgroundColor: 'rgba(10, 10, 10, 0.9)', border: '1px solid #3b82f6', borderRadius: '8px', color: '#fff' }}
                     />
                   </PieChart>
                 </ResponsiveContainer>
               </div>

               <div className="flex-1 space-y-4 w-full">
                 {DATASET_SPLIT.map((data, i) => (
                    <div key={i} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex justify-between items-center">
                       <span className="flex items-center gap-2 text-slate-300">
                         <span className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color, boxShadow: `0 0 8px ${data.color}` }}></span>
                         {data.name}
                       </span>
                       <span className="font-bold text-white">{data.value.toLocaleString()} items</span>
                    </div>
                 ))}
               </div>
             </div>
          </div>

        </motion.div>
      </div>

    </div>
  );
};

// UI Helpers for Architecture Diagram
const LayerNode = ({ name, details, highlight, final }) => (
  <div className={`p-4 rounded-xl border relative transition-colors ${
    final ? 'bg-brand-500/10 border-brand-500' 
    : highlight ? 'bg-slate-800/80 border-slate-600' 
    : 'bg-black/50 border-slate-800'
  }`}>
    <h4 className={`font-bold text-sm ${final ? 'text-brand-400' : 'text-slate-200'}`}>{name}</h4>
    <p className="text-xs text-slate-500 font-mono mt-1">{details}</p>
  </div>
);

const Connector = () => (
  <div className="flex justify-center my-1">
    <div className="w-px h-6 bg-slate-700"></div>
  </div>
);

export default TrainingInfo;
