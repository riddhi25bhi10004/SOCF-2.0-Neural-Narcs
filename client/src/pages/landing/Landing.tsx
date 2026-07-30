import { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Server, Zap, Droplets, Leaf, ChevronDown, Activity, ShieldCheck, Cpu, Gauge } from 'lucide-react';
import * as THREE from 'three';
import ErrorBoundary from '../../components/ErrorBoundary';

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    let rafId: number;
    function update(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) rafId = requestAnimationFrame(update);
    }
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
}

function Particles({ count = 900 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);
  const { mouse } = useThree();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [
      new THREE.Color('#d99a2b'),
      new THREE.Color('#f1c96f'),
      new THREE.Color('#c97a1d'),
      new THREE.Color('#8b5e1f'),
      new THREE.Color('#f4d79a'),
    ];
    for (let i = 0; i < count; i++) {
      const radius = 7 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const angle = t * 0.04 + i * 0.01;
      const radius = 7 + Math.sin(t * 0.03 + i * 0.01) * 3.5;
      const theta = angle + (mouse.x * Math.PI) / 4;
      const phiInput = Math.max(-1, Math.min(1, Math.sin(angle * 0.45 + mouse.y * 0.5)));
      const phi = Math.acos(phiInput);
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
    mesh.current.rotation.y = t * 0.02;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.95} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function FloatingOrb() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.x = state.clock.getElapsedTime() * 0.16;
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.2;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.18} floatIntensity={0.4}>
      <mesh ref={mesh}>
        <torusKnotGeometry args={[1.15, 0.35, 140, 24]} />
        <meshPhysicalMaterial
          color="#d99a2b"
          metalness={0.85}
          roughness={0.12}
          transparent
          opacity={0.72}
          wireframe
          emissive="#3c2410"
          emissiveIntensity={0.42}
        />
      </mesh>
    </Float>
  );
}

function DataRings() {
  const count = 6;
  const refs = useRef<(THREE.Mesh)[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    refs.current.forEach((ref, i) => {
      if (!ref) return;
      const speed = 0.08 + i * 0.04;
      const offset = i * 0.45;
      ref.rotation.x = t * speed + offset;
      ref.rotation.z = t * speed * 0.7 + offset;
    });
  });

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) refs.current[i] = el; }}
          position={[0, 0, 0]}
          rotation={[Math.PI / 3, 0, Math.PI / 4]}
        >
          <ringGeometry args={[1.7 + i * 0.5, 1.75 + i * 0.5, 72]} />
          <meshBasicMaterial
            color={`hsl(${28 + i * 8}, 85%, ${58 + i * 3}%)`}
            transparent
            opacity={0.2 - i * 0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}

function Scene() {
  return (
    <>
      <fog attach="fog" args={['#fff7e8', 6, 18]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#d99a2b" />
      <directionalLight position={[-5, -5, -5]} intensity={0.35} color="#f1c96f" />
      <pointLight position={[0, 0, 0]} intensity={0.8} color="#c97a1d" />
      <Particles count={900} />
      <FloatingOrb />
      <DataRings />
    </>
  );
}

const statItems = [
  { icon: <Zap className="w-5 h-5" />, value: 2400000, suffix: 'kW', label: 'Energy Optimized', color: 'text-[#c97a1d]', bgColor: 'bg-[#f8e5be]' },
  { icon: <Droplets className="w-5 h-5" />, value: 847, suffix: '%', label: 'Water Saved', color: 'text-[#6d8b3d]', bgColor: 'bg-[#eef5dc]' },
  { icon: <Leaf className="w-5 h-5" />, value: 1240, suffix: 't', label: 'CO2 Reduced', color: 'text-[#b86b1f]', bgColor: 'bg-[#fde8cf]' },
  { icon: <Sparkles className="w-5 h-5" />, value: 94, suffix: '%', label: 'Efficiency Gain', color: 'text-[#8a4b0d]', bgColor: 'bg-[#f7e8c7]' },
];

const challenges = [
  { title: 'Energy Waste', desc: 'Data centers waste up to 30% of consumed energy through inefficient cooling and unoptimized workloads.', icon: <Zap className="w-7 h-7 text-[#c97a1d]" />, img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80' },
  { title: 'Water Overuse', desc: 'Traditional cooling consumes millions of liters annually with no real-time optimization.', icon: <Droplets className="w-7 h-7 text-[#6d8b3d]" />, img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80' },
  { title: 'Carbon Impact', desc: 'Unoptimized grid draw increases carbon footprint and risks non-compliance with ESG mandates.', icon: <Leaf className="w-7 h-7 text-[#b86b1f]" />, img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80' },
];

const benefits = [
  { icon: <Server className="w-6 h-6" />, title: 'Intelligent Optimization', desc: 'AI-driven workload scheduling reduces energy waste while preserving performance SLAs.' },
  { icon: <Activity className="w-6 h-6" />, title: 'Real-Time Monitoring', desc: 'Live telemetry across power, water, cooling, and carbon metrics with sub-second clarity.' },
  { icon: <Cpu className="w-6 h-6" />, title: 'Predictive Planning', desc: 'Forecast demand and shift workloads intelligently around renewable availability and load peaks.' },
  { icon: <ShieldCheck className="w-6 h-6" />, title: 'Sustainability Reporting', desc: 'Automated ESG-ready reporting and actionable recommendations that teams can act on immediately.' },
];

function ScrollReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,_#fffaf2_0%,_#fff7e8_100%)] text-[#3f2e20]">
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-amber-200/80 bg-[#fffdf8]/90 backdrop-blur-xl shadow-[0_10px_40px_rgba(146,92,25,0.12)]' : 'bg-transparent'}`}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#c97a1d] to-[#e8bb4f]">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-[#2f220f]">EcoPulse AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm font-medium text-[#7e6143] transition-colors hover:text-[#c97a1d]">Dashboard</Link>
            <Link to="/advisor" className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="relative isolate min-h-screen overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(201,122,29,0.16),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(232,187,79,0.18),_transparent_40%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,247,232,0.4),rgba(255,250,242,0.88))]" />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(146,92,25,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(146,92,25,0.1) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
          <ErrorBoundary fallback={<div className="h-full w-full bg-[#fff7e8]" />}>
            <Suspense fallback={<div className="h-full w-full bg-[#fff7e8]" />}>
              <Canvas
                camera={{ position: [0, 0, 8], fov: 55 }}
                dpr={[1, 1.6]}
                gl={{ antialias: true, alpha: true, failIfMajorPerformanceCaveat: false, powerPreference: 'high-performance' }}
                style={{ background: 'transparent' }}
              >
                <Scene />
              </Canvas>
            </Suspense>
          </ErrorBoundary>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(255,247,232,0.7)_70%,_rgba(255,250,242,0.95)_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-24 lg:flex-row lg:items-center lg:gap-10 lg:px-8 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl rounded-[26px] border border-amber-200/80 bg-[#fffdf8]/90 p-8 shadow-[0_30px_90px_rgba(146,92,25,0.16)] backdrop-blur-2xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e8bb4f]/30 bg-[#fff3d8] px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-[#a96b16]">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Sustainability Platform
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-[#2f220f] sm:text-5xl lg:text-6xl">
              The intelligent command center for <span className="text-gradient">sustainable infrastructure</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-[#6e5335]">
              EcoPulse turns power, water, cooling, and carbon data into one clear operating system that helps teams cut waste, reduce risk, and think faster.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/dashboard" className="btn-primary inline-flex items-center justify-center gap-2 text-base">
                Launch Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/advisor" className="btn-secondary inline-flex items-center justify-center gap-2 text-base">
                View Recommendations
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {statItems.map((stat, i) => (
                <div key={i} className="rounded-2xl border border-amber-200/80 bg-[#fffdfa]/90 p-4">
                  <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${stat.bgColor} ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-semibold text-[#2f220f]">
                    <AnimatedCounter target={stat.value} />
                    <span className="ml-1 text-xs text-slate-400">{stat.suffix}</span>
                  </div>
                  <div className="mt-1 text-sm text-[#7e6143]">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-8 w-full max-w-md rounded-[26px] border border-amber-200/80 bg-[#fffdfa]/90 p-6 shadow-[0_25px_70px_rgba(146,92,25,0.14)] backdrop-blur-xl lg:mt-0"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#7e6143]">Live system pulse</p>
                <h2 className="text-xl font-semibold text-[#2f220f]">Energy intelligence</h2>
              </div>
              <div className="rounded-full border border-[#6d8b3d]/30 bg-[#eef5dc] px-3 py-1 text-sm text-[#6d8b3d]">Online</div>
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200/80 bg-[#fff7e8] p-4">
              <div className="flex items-center justify-between text-sm text-[#7e6143]">
                <span>Carbon intensity</span>
                <span className="font-semibold text-[#2f220f]">21.4 kg/h</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-[#f2e2bb]">
                <div className="h-2 w-[78%] rounded-full bg-gradient-to-r from-[#c97a1d] to-[#e8bb4f]" />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-amber-200/80 bg-[#fffdfa]/90 p-3">
                  <div className="flex items-center gap-2 text-sm text-[#7e6143]"><Gauge className="h-4 w-4 text-[#c97a1d]" /> PUE</div>
                  <p className="mt-2 text-xl font-semibold text-[#2f220f]">1.28</p>
                </div>
                <div className="rounded-xl border border-amber-200/80 bg-[#fffdfa]/90 p-3">
                  <div className="flex items-center gap-2 text-sm text-[#7e6143]"><Droplets className="h-4 w-4 text-[#6d8b3d]" /> Cooling</div>
                  <p className="mt-2 text-xl font-semibold text-[#2f220f]">92%</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="h-6 w-6 animate-bounce text-[#9a6b2f]" />
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <ScrollReveal>
          <div className="mb-8 text-center">
            <h2 className="section-title">The challenge</h2>
            <p className="mx-auto max-w-2xl text-[#7e6143]">Modern infrastructure generates more data than teams can interpret manually, which makes waste and inefficiency easy to miss.</p>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="grid gap-6 md:grid-cols-3">
            {challenges.map((item, i) => (
              <div key={i} className="group overflow-hidden rounded-[24px] border border-amber-200/80 bg-[#fffdfa]/90 shadow-[0_20px_70px_rgba(146,92,25,0.12)] backdrop-blur-xl">
                <div className="h-48 overflow-hidden">
                  <img src={item.img} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="flex flex-col gap-3 p-6">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <h3 className="text-lg font-semibold text-[#2f220f]">{item.title}</h3>
                  </div>
                  <p className="text-sm text-[#7e6143]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className="bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_45%)] py-20">
        <div className="mx-auto max-w-6xl px-4">
          <ScrollReveal>
            <div className="mb-10 text-center">
              <h2 className="section-title">Why EcoPulse</h2>
              <p className="mx-auto max-w-2xl text-[#7e6143]">A calm, intelligent interface that turns raw telemetry into action without overwhelming operators.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="grid gap-6 md:grid-cols-2">
              {benefits.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-start gap-4 rounded-[24px] border border-amber-200/80 bg-[#fffdfa]/90 p-6 shadow-[0_20px_60px_rgba(146,92,25,0.1)] backdrop-blur-xl"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f8e5be] to-[#fff3d8] text-[#c97a1d]">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-[#2f220f]">{item.title}</h3>
                    <p className="text-sm text-[#7e6143]">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <ScrollReveal>
          <div className="rounded-[32px] border border-amber-200/80 bg-[#fffdfa]/95 p-8 text-center shadow-[0_20px_80px_rgba(146,92,25,0.16)] backdrop-blur-xl sm:p-12">
            <h2 className="text-3xl font-semibold text-[#2f220f]">Ready to transform your infrastructure?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-[#7e6143]">Join teams that want a clearer view of their operations and a measurable path to lower cost and lower emissions.</p>
            <Link to="/dashboard" className="btn-primary mt-8 inline-flex items-center gap-2 text-base">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <footer className="border-t border-amber-200/80 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-br from-[#c97a1d] to-[#e8bb4f]">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-medium text-[#5a3c21]">EcoPulse AI</span>
          </div>
          <p className="text-xs text-[#8b6f4f]">&copy; 2026 EcoPulse AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;