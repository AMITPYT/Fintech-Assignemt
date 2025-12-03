import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Shield, Home, PiggyBank, Sparkles } from "lucide-react";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

export default function ResultsPage() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("latestResult");
    if (saved) setData(JSON.parse(saved));
  }, []);

  if (!data) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="w-16 h-16 text-indigo-600" />
      </motion.div>
    </div>
  );

  const healthScore = data.healthScore || 850;
  const scorePercentage = (healthScore / 1000) * 100;

  const pieData = [
    { name: "Equity", value: data.allocation.equity },
    { name: "Debt", value: data.allocation.debt },
    { name: "Gold", value: data.allocation.gold },
    { name: "Real Estate", value: data.allocation.realEstate },
  ];

  const barData = Object.entries(data.sipBreakdown).map(([k, v]) => ({
    asset: k.charAt(0).toUpperCase() + k.slice(1),
    amount: v,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-white/90 backdrop-blur-lg shadow-xl border-b border-gray-200 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-3 text-indigo-600 font-semibold hover:text-indigo-800 transition"
          >
            <ArrowLeft size={22} />
            Recalculate Profile
          </motion.button>
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            Your Smart Investment Plan
          </motion.h1>
          <Sparkles className="text-yellow-500" size={28} />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center border border-white/50"
        >
          <motion.h2
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-4xl font-bold text-gray-800 mb-8"
          >
            Your Financial Health Score
          </motion.h2>

          <div className="relative inline-block">
            <svg width="320" height="320" viewBox="0 0 320 320" className="-rotate-90">
              <circle cx="160" cy="160" r="140" stroke="#e5e7eb" strokeWidth="28" fill="none" />
              <motion.circle
                cx="160"
                cy="160"
                r="140"
                stroke="url(#gradient)"
                strokeWidth="28"
                fill="none"
                strokeDasharray="879"
                initial={{ strokeDashoffset: 879 }}
                animate={{ strokeDashoffset: 879 - (879 * scorePercentage) / 100 }}
                transition={{ duration: 2.5, ease: "easeOut" }}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.5, type: "spring", stiffness: 100 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <span className="text-8xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {healthScore}
              </span>
              <span className="text-2xl text-gray-600 font-medium">/ 1000</span>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-8 text-2xl font-bold text-green-600"
          >
            {healthScore >= 800 ? "Outstanding!" : healthScore >= 600 ? "Great Job!" : "Room to Grow"}
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/50"
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <TrendingUp className="text-green-600" />
              Recommended Asset Allocation
            </h3>
            <ResponsiveContainer width="100%" height={380}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={140}
                  paddingAngle={5}
                >
                  {pieData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i]}
                      strokeWidth={4}
                      stroke="#fff"
                      style={{
                        filter: `drop-shadow(0 4px 10px ${COLORS[i]}40)`,
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/50"
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-8">Monthly SIP Recommendation</h3>
            <ResponsiveContainer width="100%" height={380}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="4 4" stroke="#f0f0f0" />
                <XAxis dataKey="asset" />
                <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                {barData.map((entry, i) => (
                  <Bar
                    key={i}
                    dataKey="amount"
                    fill={COLORS[i]}
                    radius={[12, 12, 0, 0]}
                    barSize={500}
                  >
                    {barData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index]}
                        style={{
                          opacity: index === i ? 1 : 0.9,
                        }}
                      />
                    ))}
                  </Bar>
                ))}
              </BarChart>
            </ResponsiveContainer>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-8 p-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white text-center"
            >
              <p className="text-4xl font-extrabold">₹{data.recommendedSIP.toLocaleString()}</p>
              <p className="text-xl opacity-90">per month</p>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {[
            { title: "Emergency Fund", value: `${data.emergencyFundMonths || 6} months`, icon: Shield, color: "from-emerald-500 to-teal-600" },
            { title: "Insurance Needed", value: `₹${(data.monthlyIncome * 120).toLocaleString()}`, icon: TrendingUp, color: "from-blue-500 to-indigo-600" },
            { title: "15-Year Corpus", value: `₹${data.projectedCorpus.toLocaleString()}`, icon: PiggyBank, color: "from-purple-500 to-pink-600" },
          ].map((card, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.08, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className={`bg-gradient-to-br ${card.color} text-white p-10 rounded-3xl shadow-2xl transform transition-all duration-300`}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold">{card.title}</h3>
                <card.icon size={40} className="opacity-80" />
              </div>
              <p className="text-5xl font-extrabold">{card.value}</p>
              <p className="mt-3 opacity-90">{i === 0 ? "covered" : i === 1 ? "recommended" : "projected"}</p>
            </motion.div>
          ))}
        </motion.div> 
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="text-center py-12"
        >
          <p className="text-2xl text-gray-700 mb-6">
            Risk Profile: <span className="font-bold text-indigo-600">{data.riskTolerance}</span> • 
            Goal: <span className="font-bold text-purple-600"> {data.investmentGoal}</span>
          </p>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="px-12 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-full shadow-2xl hover:shadow-indigo-500/50 transition"
          >
            Update My Plan
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}