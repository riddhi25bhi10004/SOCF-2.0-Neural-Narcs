// client/src/components/water/AIRecommendationCard.tsx
import { motion } from 'framer-motion';
import { Lightbulb, Zap, ChevronRight, TrendingUp } from 'lucide-react';

interface Recommendation {
  title: string;
  saving: number;
  priority: 'High' | 'Medium' | 'Low';
  reason: string;
}

interface AIRecommendationCardProps {
  recommendations: Recommendation[];
}

export default function AIRecommendationCard({ recommendations }: AIRecommendationCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-500 bg-red-500/10';
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'Low': return 'text-green-500 bg-green-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <motion.div
      className="glass p-6 border border-yellow-500/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-yellow-500/10 rounded-lg">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
        </div>
        <h3 className="section-title text-base">Recommendations</h3>
        <div className="ml-auto flex items-center gap-1 text-xs text-eco-muted">
          <TrendingUp className="w-3 h-3 text-green-500" />
          <span className="text-green-500">Live</span>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            className="glass p-4 border border-eco-border/30 hover:border-yellow-500/30 transition-all cursor-pointer group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-eco-surface rounded-lg group-hover:bg-yellow-500/10 transition-all">
                <Zap className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-eco-dark">{rec.title}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(rec.priority)}`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-eco-muted mt-1">{rec.reason}</p>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <span className="text-eco-primary font-medium">
                    Expected Saving: {rec.saving} L/hour
                  </span>
                  <motion.span
                    className="text-eco-muted group-hover:text-eco-primary transition-colors flex items-center gap-1"
                    whileHover={{ x: 5 }}
                  >
                    View Details
                    <ChevronRight className="w-3 h-3" />
                  </motion.span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}