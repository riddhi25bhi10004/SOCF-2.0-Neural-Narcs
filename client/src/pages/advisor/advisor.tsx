import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';
import { fetchRecommendations, applyRecommendation } from '../../services/api';
import type { Recommendation } from '../../types';
import MetricCard from '../../components/ui/MetricCard';
import RecommendationCard from '../../components/ui/RecommendationCard';

function Advisor() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchRecommendations();
        setRecommendations(data);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleApply = async (id: string) => {
    try {
      await applyRecommendation(id);
      setRecommendations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, applied: true, appliedAt: Date.now() } : r))
      );
    } catch {
    }
  };

  const totalEnergySaved = recommendations.reduce((sum, r) => sum + r.impact.energy, 0);
  const totalWaterSaved = recommendations.reduce((sum, r) => sum + r.impact.water, 0);
  const totalCarbonSaved = recommendations.reduce((sum, r) => sum + r.impact.carbon, 0);
  const avgConfidence = recommendations.length
    ? recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length
    : 0;

  if (loading && recommendations.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass p-5 animate-pulse">
            <div className="h-4 bg-eco-border/50 rounded w-3/4 mb-3" />
            <div className="h-3 bg-eco-border/50 rounded w-full mb-2" />
            <div className="h-3 bg-eco-border/50 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-eco-primary" />
        <h1 className="text-2xl font-bold text-eco-dark">AI Advisor</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Energy Saved" value={totalEnergySaved.toFixed(0)} unit="%" icon={<Sparkles className="w-4 h-4" />} color="eco-primary" trend="up" trendValue="From recommendations" />
        <MetricCard label="Water Efficiency" value={totalWaterSaved.toFixed(0)} unit="%" icon={<Sparkles className="w-4 h-4" />} color="blue-400" trend="up" trendValue="From recommendations" />
        <MetricCard label="Carbon Reduction" value={totalCarbonSaved.toFixed(0)} unit="%" icon={<Sparkles className="w-4 h-4" />} color="eco-accent" trend="up" trendValue="From recommendations" />
        <MetricCard label="Avg Confidence" value={Math.round(avgConfidence)} unit="%" icon={<Brain className="w-4 h-4" />} color="eco-warning" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-eco-dark">Recommendations</h2>
        <span className="text-xs text-eco-muted">{recommendations.length} active</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec, i) => (
          <motion.div key={rec.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <RecommendationCard recommendation={rec} onApply={handleApply} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Advisor;