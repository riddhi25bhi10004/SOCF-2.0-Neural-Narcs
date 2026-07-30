import { motion } from 'framer-motion';
import { Zap, Droplets, Cloud, Shield, Check } from 'lucide-react';
import type { Recommendation } from '../../types';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onApply: (id: string) => void;
}

function RecommendationCard({ recommendation, onApply }: RecommendationCardProps) {
  const priorityColors = {
    high: 'bg-eco-danger/10 text-eco-danger border-eco-danger/30',
    medium: 'bg-eco-warning/10 text-eco-warning border-eco-warning/30',
    low: 'bg-eco-accent/10 text-eco-accent border-eco-accent/30',
  };

  const impactIcons = {
    energy: <Zap className="w-3.5 h-3.5 text-eco-primary" />,
    water: <Droplets className="w-3.5 h-3.5 text-blue-400" />,
    carbon: <Cloud className="w-3.5 h-3.5 text-eco-accent" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="glass p-5 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-eco-dark">{recommendation.title}</h3>
        {recommendation.applied ? (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-eco-success/10 text-eco-success text-xs font-medium">
            <Check className="w-3 h-3" />
            Applied
          </span>
        ) : (
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColors[recommendation.priority]}`}>
            {recommendation.priority}
          </span>
        )}
      </div>
      <p className="text-xs text-eco-muted leading-relaxed">{recommendation.description}</p>
      <div className="flex items-center gap-3 text-xs">
        {Object.entries(recommendation.impact).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1 text-eco-muted">
            {impactIcons[key as keyof typeof impactIcons]}
            <span>Save {val}%</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-1 border-t border-eco-border/30">
        <div className="flex items-center gap-2">
          <span className="text-xs text-eco-muted">Confidence</span>
          <div className="w-16 h-1.5 rounded-full bg-eco-border/50 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-eco-primary"
              initial={{ width: 0 }}
              animate={{ width: `${recommendation.confidence}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <span className="text-xs text-eco-muted">{Math.round(recommendation.confidence)}%</span>
        </div>
        {!recommendation.applied ? (
          <button
            onClick={() => onApply(recommendation.id)}
            className="px-3 py-1.5 bg-eco-primary/10 text-eco-primary text-xs font-medium rounded-lg hover:bg-eco-primary/20 transition-colors"
          >
            Apply
          </button>
        ) : null}
      </div>
      {recommendation.tradeoff && (
        <div className="text-xs text-eco-warning flex items-start gap-1">
          <Shield className="w-3 h-3 mt-0.5 shrink-0" />
          <span>{recommendation.tradeoff}</span>
        </div>
      )}
    </motion.div>
  );
}

export default RecommendationCard;