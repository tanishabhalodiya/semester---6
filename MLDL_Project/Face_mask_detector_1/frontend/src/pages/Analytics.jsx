import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, Users, ShieldCheck, User, ShieldAlert } from 'lucide-react';

const MOCK_STATS = {
  totalScans: '1.4M',
  totalFaces: '3.2M',
  maskCount: 2150000,
  noMaskCount: 850000,
  incorrectCount: 200000,
};

const CHART_DATA = [
  { name: 'Compliant (Mask)', value: MOCK_STATS.maskCount, color: '#22c55e' },
  { name: 'Non-Compliant (No Mask)', value: MOCK_STATS.noMaskCount, color: '#ef4444' },
  { name: 'Warning (Incorrect)', value: MOCK_STATS.incorrectCount, color: '#f59e0b' },
];

const TOTAL_CHART = CHART_DATA.reduce((acc, d) => acc + d.value, 0);

const Analytics = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8 relative z-10"
      >
        <div className="p-3 dashboard-card text-brand-500 rounded-xl border border-brand-500/50">
          <BarChart3 className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Global Metrics</h1>
          <p className="text-brand-500 font-mono text-sm tracking-widest mt-1">SYSTEM_ANALYTICS_DASHBOARD</p>
        </div>
      </motion.div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        <StatCard title="TOTAL PROFILES" value={MOCK_STATS.totalFaces} icon={<Users />} color="text-brand-500" border="border-brand-500/30" />
        <StatCard title="SECURED" value="67%" icon={<ShieldCheck />} color="text-green-500" border="border-green-500/30" />
        <StatCard title="AT RISK" value="27%" icon={<User />} color="text-red-500" border="border-red-500/30" />
        <StatCard title="PARTIAL" value="6%" icon={<ShieldAlert />} color="text-orange-500" border="border-orange-500/30" />
      </div>

      {/* Main Chart Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="dashboard-card glass-panel rounded-2xl p-6 md:p-10 border border-brand-500/20 mt-8 relative z-10"
      >
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
          
          <div className="w-full md:w-1/2 h-[400px]">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={CHART_DATA}
                   cx="50%"
                   cy="50%"
                   innerRadius={100}
                   outerRadius={140}
                   paddingAngle={5}
                   dataKey="value"
                   stroke="rgba(0,0,0,0)"
                 >
                   {CHART_DATA.map((entry, index) => (
                     <Cell 
                       key={`cell-${index}`} 
                       fill={entry.color} 
                       className="hover:opacity-80 transition-opacity outline-none" 
                       style={{ filter: `drop-shadow(0 0 8px ${entry.color}80)` }}
                     />
                   ))}
                 </Pie>
                 <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(0, 245, 255, 0.2)', borderRadius: '8px', color: '#fff' }}
                   itemStyle={{ color: '#fff' }}
                 />
                 <Legend verticalAlign="bottom" height={36} iconType="circle" />
               </PieChart>
             </ResponsiveContainer>
          </div>

          <div className="w-full md:w-1/2 space-y-6">
            <h3 className="text-xl font-bold text-white mb-2 pb-2 border-b border-slate-700">Distribution Analysis</h3>
            
            {CHART_DATA.map((data, i) => (
              <div key={i} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300 font-medium flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color, boxShadow: `0 0 10px ${data.color}` }}></span>
                    {data.name}
                  </span>
                  <span className="font-bold text-white text-lg">{data.value.toLocaleString()}</span>
                </div>
                 {/* Progress Bar */}
                 <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                   <div 
                     className="h-2 rounded-full" 
                     style={{ 
                       width: `${Math.min((data.value / TOTAL_CHART) * 100, 100)}%`,
                       backgroundColor: data.color,
                       boxShadow: `0 0 10px ${data.color}`
                     }}
                   ></div>
                 </div>
              </div>
            ))}
          </div>

        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, border }) => (
  <motion.div 
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className={`dashboard-card rounded-xl p-6 border ${border} flex items-center justify-between`}
  >
    <div>
      <p className="text-slate-400 font-mono text-xs tracking-widest mb-1">{title}</p>
      <h3 className={`text-3xl font-extrabold ${color} drop-shadow-md`}>{value}</h3>
    </div>
    <div className={`p-4 rounded-full bg-slate-800/80 ${color} border ${border}`}>
      {React.cloneElement(icon, { size: 28 })}
    </div>
  </motion.div>
);

export default Analytics;
