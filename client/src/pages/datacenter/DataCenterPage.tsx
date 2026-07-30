import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Droplets, Cpu, MapPin, Globe, Server, Sparkles } from 'lucide-react';
import datacenters from '../../data/datacenters';

const pageConfig = {
  'enterprise-data-center': {
    hero: 'Private enterprise operations, tailored for business continuity and app performance.',
    highlights: [
      'Centralized application hosting and private cloud management.',
      'Optimized for corporate SLAs, compliance, and security controls.',
      'Balanced energy and cooling for mixed workload stability.',
    ],
    details: [
      {
        title: 'Workload Governance',
        description: 'Control application placement, peak usage, and cost through intelligent scheduling that maps workloads to the best-performing resources.',
        icon: Cpu,
      },
      {
        title: 'Private Infrastructure',
        description: 'Maintain granular visibility into internal services while reducing waste from idle compute and overprovisioned servers.',
        icon: ShieldCheck,
      },
      {
        title: 'Enterprise Cooling',
        description: 'Optimize chilled-water and air-handling systems for stable temperature management across sensitive hardware zones.',
        icon: Droplets,
      },
    ],
  },
  'hyperscale-data-center': {
    hero: 'Massive scale operations that demand extreme efficiency, renewable coordination, and cost-aware compute.',
    highlights: [
      'AI-based capacity planning for hundreds of thousands of servers.',
      'Dynamic cooling load balancing across hyperscale racks.',
      'Renewable-sourced scheduling and carbon-aware load shifting.',
    ],
    details: [
      {
        title: 'Scale Optimization',
        description: 'Automatically prioritize workloads across zones, minimizing the cost of peak energy and cooling demand.',
        icon: Server,
      },
      {
        title: 'Resource Orchestration',
        description: 'Coordinate dense compute clusters with storage and networking to preserve throughput at global scale.',
        icon: Globe,
      },
      {
        title: 'Cooling Efficiency',
        description: 'Manage chilled water, evaporative cooling, and airflow to cut power usage effectiveness (PUE).',
        icon: Droplets,
      },
    ],
  },
  'colocation-data-center': {
    hero: 'Shared infrastructure built for multi-tenant efficiency, billing transparency, and tenant-aware sustainability.',
    highlights: [
      'Tenant-specific energy and water accountability.',
      'Optimized rack and power density for co-location customers.',
      'Usage analytics to improve invoice accuracy and sustainability reporting.',
    ],
    details: [
      {
        title: 'Tenant Visibility',
        description: 'Track usage per customer and allocate costs with precision, while reducing shared infrastructure waste.',
        icon: MapPin,
      },
      {
        title: 'Power Density Management',
        description: 'Balance hot-aisle containment, UPS load, and rack-level cooling within multi-tenant environments.',
        icon: ShieldCheck,
      },
      {
        title: 'Carrier & Cloud Integration',
        description: 'Integrate colocation services with public cloud and hybrid deployments for optimized placement and cost.',
        icon: Globe,
      },
    ],
  },
  'edge-data-center': {
    hero: 'Distributed infrastructure close to users, designed for low latency, fast compute, and local resilience.',
    highlights: [
      'Micro data centers deployed near end users and edge sites.',
      'Low-latency compute for IoT, manufacturing, and remote services.',
      'Local power and cooling optimization with minimal footprint.',
    ],
    details: [
      {
        title: 'Latency-Sensitive Workloads',
        description: 'Place mission-critical edge services where response time matters most.',
        icon: ArrowRight,
      },
      {
        title: 'Compact Efficiency',
        description: 'Keep small facilities efficient with AI-managed thermal and energy consumption.',
        icon: Cpu,
      },
      {
        title: 'Regional Resilience',
        description: 'Ensure local availability and rapid recovery through distributed edge orchestration.',
        icon: Globe,
      },
    ],
  },
  'modular-data-center': {
    hero: 'Rapidly deployable infrastructure for flexible demand, temporary capacity, and green build-outs.',
    highlights: [
      'Portable containerized systems with fast site deployment.',
      'Modular cooling and power systems tuned for on-demand workloads.',
      'Ideal for seasonal, mobile, or expansion use cases.',
    ],
    details: [
      {
        title: 'Rapid Deployment',
        description: 'Provision compute capacity quickly while keeping costs low and energy waste minimized.',
        icon: Sparkles,
      },
      {
        title: 'Flexible Footprint',
        description: 'Scale modules in or out based on real-time demand and environmental constraints.',
        icon: Server,
      },
      {
        title: 'Efficient Cooling',
        description: 'Match cooling systems to each module’s power profile for better efficiency and lower water use.',
        icon: Droplets,
      },
    ],
  },
  'government-data-center': {
    hero: 'Secure government environments that balance public service continuity with compliance and sustainability.',
    highlights: [
      'Built for citizen services, regulatory reporting, and mission-critical workloads.',
      'Secure, compliant operations with strong identity and access controls.',
      'Efficient energy use while preserving high availability.',
    ],
    details: [
      {
        title: 'Regulatory Compliance',
        description: 'Protect sensitive programs and citizen data while meeting strict security and environmental mandates.',
        icon: ShieldCheck,
      },
      {
        title: 'Mission Continuity',
        description: 'Maintain reliable service delivery for public sector workloads and national infrastructure.',
        icon: MapPin,
      },
      {
        title: 'Sustainable Operations',
        description: 'Optimize energy and water use in secure facilities without sacrificing performance.',
        icon: Droplets,
      },
    ],
  },
};

function DataCenterPage() {
  const { slug } = useParams<{ slug: string }>();
  const center = useMemo(
    () => datacenters.find((item) => item.slug === slug),
    [slug]
  );

  if (!center) {
    return (
      <div className="min-h-screen bg-eco-surface px-4 py-20 text-center text-eco-text">
        <p className="text-xl font-semibold">Data center type not found.</p>
        <p className="mt-3 text-eco-muted">Please choose one of the available data center categories from the homepage.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-eco-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-eco-primary/20">
          Back to Home
        </Link>
      </div>
    );
  }

  const config = pageConfig[center.slug as keyof typeof pageConfig];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,235,179,0.2),transparent_25%),linear-gradient(180deg,#fffaf2_0%,#fffdfa_100%)] text-eco-dark">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-[2rem] border border-eco-border bg-white/95 p-10 shadow-[0_30px_90px_rgba(201,122,29,0.12)]"
          >
            <div className="inline-flex items-center gap-3 rounded-full bg-eco-primary/10 px-4 py-2 text-sm font-semibold text-eco-primary">
              <ShieldCheck className="h-5 w-5" />
              {center.name}
            </div>
            <h1 className="mt-8 text-4xl font-semibold tracking-tight text-eco-dark sm:text-5xl">
              {center.name}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-eco-muted">{config.hero}</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.75rem] bg-[#fff7e8] p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-[#a96b16]">Energy</p>
                <p className="mt-3 text-3xl font-semibold text-eco-dark">{center.electricity}</p>
                <p className="mt-2 text-sm text-eco-muted">Predictable strategy for power management.</p>
              </div>
              <div className="rounded-[1.75rem] bg-[#fff7e8] p-6 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-[#a96b16]">Water</p>
                <p className="mt-3 text-3xl font-semibold text-eco-dark">{center.water}</p>
                <p className="mt-2 text-sm text-eco-muted">Targeted water usage for facility reliability.</p>
              </div>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {config.highlights.map((highlight) => (
                <div key={highlight} className="rounded-[1.75rem] border border-eco-border bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-eco-dark">{highlight}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {config.details.map((detail) => {
                const Icon = detail.icon;
                return (
                  <div key={detail.title} className="rounded-[2rem] bg-[#fff7e8] p-6 shadow-sm">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8d6b0] text-eco-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-base font-semibold text-eco-dark">{detail.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-eco-muted">{detail.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Link
                to={`/dashboard/${center.slug}`}
                className="inline-flex items-center justify-center rounded-full bg-eco-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-eco-primary/20 transition hover:bg-eco-accent"
              >
                Launch Dashboard
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-full border border-eco-border bg-white px-6 py-3 text-sm font-semibold text-eco-dark transition hover:border-eco-primary"
              >
                Return to homepage
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-[2rem] border border-eco-border bg-eco-card/95 p-8 shadow-[0_30px_70px_rgba(201,122,29,0.1)]"
          >
            <img
              src={center.image}
              alt={center.alt}
              className="h-full w-full rounded-[1.75rem] object-cover"
            />
            <div className="mt-8 space-y-6">
              <div className="rounded-[1.75rem] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 text-eco-primary">
                  <Globe className="h-5 w-5" />
                  <span className="text-sm font-semibold">Operational focus</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-eco-muted">This page is tailored to the specific needs of {center.name.toLowerCase()}. Explore targeted resources, energy goals, and technology patterns for this workload category.</p>
              </div>
              <div className="rounded-[1.75rem] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 text-eco-primary">
                  <Cpu className="h-5 w-5" />
                  <span className="text-sm font-semibold">Why this data center matters</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-eco-muted">Each center type has unique sustainability trade-offs—this page helps you translate business goals into operational efficiency.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default DataCenterPage;
