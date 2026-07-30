import { motion } from 'framer-motion';
import DataCenterCard from './DataCenterCard';
import datacenters from '../data/datacenters';

export default function DataCenterSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6 }}
        className="mb-10 text-center"
      >
        <h2 className="section-title">Types of Data Centers</h2>
        <p className="mx-auto max-w-2xl text-[#7e6143]">
          Explore the six major data center categories and how each one impacts energy, water, and sustainability.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {datacenters.map((center, index) => (
          <DataCenterCard key={center.name} center={center} index={index} />
        ))}
      </div>
    </section>
  );
}
