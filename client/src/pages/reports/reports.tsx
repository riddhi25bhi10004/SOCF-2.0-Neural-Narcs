import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Zap, Droplets, Cloud, CheckCircle } from 'lucide-react';
import { generateReport } from '../../services/api';

interface ReportAction {
  name: string;
  impact: string;
  status: 'completed' | 'in-progress' | 'pending';
}

interface Report {
  title: string;
  generatedAt: string;
  totalEnergySavings: number;
  totalWaterSavings: number;
  totalCarbonReduction: number;
  topActions: ReportAction[];
}

function Reports() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateReport();
      setReport(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    completed: 'bg-eco-success/10 text-eco-success',
    'in-progress': 'bg-eco-warning/10 text-eco-warning',
    pending: 'bg-eco-muted/10 text-eco-muted',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-eco-primary" />
        <h1 className="text-2xl font-bold text-eco-dark">Reports</h1>
      </div>

      {!report ? (
        <div className="glass p-8 flex flex-col items-center justify-center py-20">
          <FileText className="w-12 h-12 text-eco-muted mb-4" />
          <h2 className="text-lg font-semibold text-eco-dark mb-2">Generate Optimization Report</h2>
          <p className="text-sm text-eco-muted mb-6 text-center max-w-md">
            Create a comprehensive report of your energy optimization actions, savings, and environmental impact.
          </p>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-2.5 bg-eco-primary text-white rounded-lg text-sm font-medium hover:bg-eco-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      ) : (
        <>
          <div className="glass p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-eco-dark">{report.title}</h2>
              <span className="text-xs text-eco-muted">{new Date(report.generatedAt).toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-eco-surface/50 border border-eco-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-eco-primary" />
                  <span className="text-xs text-eco-muted uppercase tracking-wider">Energy Savings</span>
                </div>
                <div className="text-2xl font-bold font-mono text-eco-dark">{report.totalEnergySavings.toLocaleString()} kWh</div>
              </div>
              <div className="p-4 rounded-xl bg-eco-surface/50 border border-eco-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-eco-muted uppercase tracking-wider">Water Savings</span>
                </div>
                <div className="text-2xl font-bold font-mono text-eco-dark">{report.totalWaterSavings.toLocaleString()} L</div>
              </div>
              <div className="p-4 rounded-xl bg-eco-surface/50 border border-eco-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <Cloud className="w-4 h-4 text-eco-accent" />
                  <span className="text-xs text-eco-muted uppercase tracking-wider">Carbon Reduced</span>
                </div>
                <div className="text-2xl font-bold font-mono text-eco-dark">{report.totalCarbonReduction.toLocaleString()} kg</div>
              </div>
            </div>
          </div>

          <div className="glass p-6">
            <h3 className="section-title text-base mb-4">Top Actions</h3>
            <div className="flex flex-col gap-3">
              {report.topActions.map((action, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-eco-surface/50 border border-eco-border/30"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-eco-primary" />
                    <div>
                      <div className="text-sm font-medium text-eco-dark">{action.name}</div>
                      <div className="text-xs text-eco-muted mt-0.5">{action.impact}</div>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[action.status]}`}>
                    {action.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-6 py-2.5 bg-eco-primary/10 text-eco-primary rounded-lg text-sm font-medium hover:bg-eco-primary/20 transition-colors disabled:opacity-50"
            >
              {loading ? 'Regenerating...' : 'Regenerate Report'}
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default Reports;
