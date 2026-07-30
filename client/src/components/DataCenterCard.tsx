import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DataCenterData } from '../data/datacenters';

interface DataCenterCardProps {
  center: DataCenterData;
  index: number;
}

export default function DataCenterCard({ center, index }: DataCenterCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="h-full"
    >
      <div className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-amber-200/80 bg-[#fffdfa]/95 shadow-[0_30px_80px_rgba(146,92,25,0.12)] backdrop-blur-xl transition duration-500 hover:shadow-[0_30px_90px_rgba(146,92,25,0.18)]">
        <div className="relative overflow-hidden">
          <img
            src={center.image}
            alt={center.alt}
            loading="lazy"
            className="h-56 w-full object-cover transition duration-700 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between gap-5 p-6">
          <div className="space-y-4">
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-[#a96b16]">
              {center.name}
            </div>
            <p className="text-sm leading-6 text-[#7e6143]">{center.description}</p>
          </div>

          <div className="grid gap-3">
            <div className="rounded-3xl bg-[#fff7e8] p-4 text-sm text-[#5a3c21]">
              <div className="text-xs uppercase tracking-[0.24em] text-[#a96b16]">Electricity</div>
              <p className="mt-2 font-semibold text-[#2f220f]">{center.electricity}</p>
            </div>
            <div className="rounded-3xl bg-[#fff7e8] p-4 text-sm text-[#5a3c21]">
              <div className="text-xs uppercase tracking-[0.24em] text-[#a96b16]">Water</div>
              <p className="mt-2 font-semibold text-[#2f220f]">{center.water}</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 rounded-3xl bg-[#fff7e8] p-4 text-sm text-[#7e6143]">
            <span className="font-semibold text-[#2f220f]">Environmental Impact</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Star
                  key={starIndex}
                  className={
                    starIndex < center.impact
                      ? 'h-4 w-4 text-[#c97a1d]'
                      : 'h-4 w-4 text-[#d9c09a]'
                  }
                />
              ))}
            </div>
          </div>

          <div className="grid gap-3 pt-2">
            <Link
              to={`/datacenter/${center.slug}`}
              className="inline-flex items-center justify-center rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-300/30 transition hover:bg-amber-500"
            >
              Get Started
            </Link>
            <Link
              to={`/dashboard/${center.slug}`}
              className="inline-flex items-center justify-center rounded-2xl border border-amber-200 bg-white px-4 py-3 text-sm font-semibold text-[#3f2e20] transition hover:border-amber-400 hover:bg-[#fff3dc]"
            >
              Launch Dashboard
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
