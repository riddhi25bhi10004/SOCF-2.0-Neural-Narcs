import { useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cpu, Zap, Droplets, ShieldCheck, ArrowRight, Globe } from 'lucide-react';
import datacenters from '../../data/datacenters';

function DataCenterDashboard() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const center = useMemo(
    () => datacenters.find((item) => item.slug === slug),
    [slug]
  );

  if (!center) {
    return (
      <div className="min-h-screen bg-eco-surface px-4 py-20 text-center text-eco-text">
        <p className="text-xl font-semibold">Dashboard not found.</p>
        <p className="mt-3 text-eco-muted">Please select a valid data center type from the homepage.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-eco-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-eco-primary/20">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f0] text-eco-dark">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-eco-border bg-white/95 p-8 shadow-[0_24px_80px_rgba(146,92,25,0.14)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-eco-primary">{center.name}</p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight text-eco-dark">{center.name} Dashboard</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-eco-muted">A tailored overview for {center.name.toLowerCase()}, highlighting sustainability, operational metrics, and workload efficiency.</p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full bg-eco-primary/10 px-4 py-2 text-sm font-semibold text-eco-primary">
              <ShieldCheck className="h-4 w-4" />
              Protected Operational View
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[1.75rem] border border-eco-border bg-[#fff7e8] p-6">
              <div className="flex items-center gap-3 text-eco-primary"><Zap className="h-5 w-5" /><span className="font-semibold">Power Efficiency</span></div>
              <p className="mt-4 text-xl font-semibold text-eco-dark">{center.electricity}</p>
              <p className="mt-2 text-sm text-eco-muted">Energy profile based on workload type and cooling strategy.</p>
            </div>
            <div className="rounded-[1.75rem] border border-eco-border bg-[#fff7e8] p-6">
              <div className="flex items-center gap-3 text-eco-primary"><Droplets className="h-5 w-5" /><span className="font-semibold">Water Stress</span></div>
              <p className="mt-4 text-xl font-semibold text-eco-dark">{center.water}</p>
              <p className="mt-2 text-sm text-eco-muted">Projected water impact for cooling and facility operations.</p>
            </div>
            <div className="rounded-[1.75rem] border border-eco-border bg-[#fff7e8] p-6">
              <div className="flex items-center gap-3 text-eco-primary"><Cpu className="h-5 w-5" /><span className="font-semibold">Compute Load</span></div>
              <p className="mt-4 text-xl font-semibold text-eco-dark">{center.impact * 20}%</p>
              <p className="mt-2 text-sm text-eco-muted">Relative compute density versus other center types.</p>
            </div>
            <div className="rounded-[1.75rem] border border-eco-border bg-[#fff7e8] p-6">
              <div className="flex items-center gap-3 text-eco-primary"><Globe className="h-5 w-5" /><span className="font-semibold">Reach</span></div>
              <p className="mt-4 text-xl font-semibold text-eco-dark">{center.slug.includes('edge') ? 'Local' : 'Regional'}</p>
              <p className="mt-2 text-sm text-eco-muted">Deployment scope for this center type.</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[2rem] border border-eco-border bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-eco-primary">Focus</p>
              <h2 className="mt-3 text-xl font-semibold text-eco-dark">Core Operations</h2>
              <p className="mt-3 text-sm leading-6 text-eco-muted">Manage workflow priorities and operational goals specific to {center.name.toLowerCase()} behavior.</p>
            </div>
            <div className="rounded-[2rem] border border-eco-border bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-eco-primary">Sustainability</p>
              <h2 className="mt-3 text-xl font-semibold text-eco-dark">Impact Plan</h2>
              <p className="mt-3 text-sm leading-6 text-eco-muted">Review energy, water, and carbon alignment for the type of service you operate.</p>
            </div>
            <div className="rounded-[2rem] border border-eco-border bg-white p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-eco-primary">Visibility</p>
              <h2 className="mt-3 text-xl font-semibold text-eco-dark">Telemetry</h2>
              <p className="mt-3 text-sm leading-6 text-eco-muted">See the key metrics and operational alerts that matter for this data center category.</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-eco-border bg-[#fff7e8] p-6">
              <div className="flex items-center gap-2 text-eco-primary"><ArrowRight className="h-4 w-4" /><span className="font-semibold">Recommended Next Steps</span></div>
              <ul className="mt-4 space-y-3 text-sm text-eco-muted">
                <li className="rounded-2xl bg-white p-4">Review energy forecasts and shift non-critical workloads.</li>
                <li className="rounded-2xl bg-white p-4">Update cooling setpoints for current outside temperature.</li>
                <li className="rounded-2xl bg-white p-4">Audit tenant or workload impact and apply sustainability controls.</li>
              </ul>
            </div>
            <div className="rounded-[2rem] border border-eco-border bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 text-eco-primary"><ShieldCheck className="h-5 w-5" /><span className="font-semibold">Secure Launch</span></div>
              <p className="mt-3 text-sm leading-6 text-eco-muted">Access protected dashboards and operational workflows only once authenticated in the main app.</p>
              <button
                type="button"
                onClick={() => navigate('/scheduler')}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-eco-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-eco-accent"
              >
                Go to AI Scheduler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataCenterDashboard;
