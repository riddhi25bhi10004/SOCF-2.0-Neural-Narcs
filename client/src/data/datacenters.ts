export interface DataCenterData {
  name: string;
  description: string;
  electricity: string;
  water: string;
  impact: number;
  image: string;
  alt: string;
}

const datacenters: DataCenterData[] = [
  {
    name: 'Enterprise Data Center',
    description: 'Privately owned infrastructure used by individual organizations to manage internal applications, business operations, and enterprise workloads.',
    electricity: 'Medium',
    water: 'Medium',
    impact: 3,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80&fm=webp',
    alt: 'Modern enterprise server room with racks and ambient lighting',
  },
  {
    name: 'Hyperscale Data Center',
    description: 'Massive cloud infrastructure supporting millions of users. These facilities consume enormous amounts of electricity and water for cooling, making them the most environmentally impactful type of data center.',
    electricity: 'Very High',
    water: 'Very High',
    impact: 5,
    image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1f?auto=format&fit=crop&w=1200&q=80&fm=webp',
    alt: 'Large hyperscale data center with endless server rows and dramatic lighting',
  },
  {
    name: 'Colocation Data Center',
    description: 'Shared facilities where multiple organizations rent secure server space and infrastructure, resulting in high energy consumption due to multiple tenants.',
    electricity: 'High',
    water: 'Medium',
    impact: 4,
    image: 'https://images.unsplash.com/photo-1555633510-2b4e6a6b1fde?auto=format&fit=crop&w=1200&q=80&fm=webp',
    alt: 'Shared colocation server racks in a secure facility',
  },
  {
    name: 'Edge Data Center',
    description: 'Small distributed facilities located closer to users for low-latency computing. Their compact size results in significantly lower energy and water consumption.',
    electricity: 'Low',
    water: 'Low',
    impact: 2,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80&fm=webp',
    alt: 'Compact edge computing facility near urban infrastructure',
  },
  {
    name: 'Modular Data Center',
    description: 'Portable, prefabricated data centers designed for rapid deployment, scalability, and improved energy efficiency.',
    electricity: 'Low',
    water: 'Low',
    impact: 2,
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80&fm=webp',
    alt: 'Containerized modular data center with modern cooling and transport-ready design',
  },
  {
    name: 'Government Data Center',
    description: 'Secure facilities dedicated to government services, citizen data, and national infrastructure with moderate-to-high environmental impact.',
    electricity: 'High',
    water: 'Medium',
    impact: 3,
    image: 'https://images.unsplash.com/photo-1518921350818-0f7c5d4f74a1?auto=format&fit=crop&w=1200&q=80&fm=webp',
    alt: 'Secure government data center with industrial server racks and security lighting',
  },
];

export default datacenters;
