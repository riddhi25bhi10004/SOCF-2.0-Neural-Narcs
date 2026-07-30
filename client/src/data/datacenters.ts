export interface DataCenterData {
  slug: string;
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
    slug: 'enterprise-data-center',
    name: 'Enterprise Data Center',
    description: 'Privately owned infrastructure used by individual organizations to manage internal applications, business operations, and enterprise workloads.',
    electricity: 'Medium',
    water: 'Medium',
    impact: 3,
    image: 'https://th.bing.com/th/id/OIP.hS4Hr0FJ6uqpDuIVIgFEhwHaER?w=329&h=188&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
    alt: 'Modern enterprise server room with racks and ambient lighting',
  },
  {
    slug: 'hyperscale-data-center',
    name: 'Hyperscale Data Center',
    description: 'Massive cloud infrastructure supporting millions of users. These facilities consume enormous amounts of electricity and water for cooling, making them the most environmentally impactful type of data center.',
    electricity: 'Very High',
    water: 'Very High',
    impact: 5,
    image: 'https://www.lianjer.com/wp-content/uploads/2025/10/Blue-lit-hyperscale-data-center-with-high-density-server-racks-and-overhead-cable-trays.webp',
    alt: 'Large hyperscale data center with endless server rows and dramatic lighting',
  },
  {
    slug: 'colocation-data-center',
    name: 'Colocation Data Center',
    description: 'Shared facilities where multiple organizations rent secure server space and infrastructure, resulting in high energy consumption due to multiple tenants.',
    electricity: 'High',
    water: 'Medium',
    impact: 4,
    image: 'https://www.azuraconsultancy.com/wp-content/uploads/2025/07/colocation-data-centers.webp',
    alt: 'Shared colocation server racks in a secure facility',
  },
  {
    slug: 'edge-data-center',
    name: 'Edge Data Center',
    description: 'Small distributed facilities located closer to users for low-latency computing. Their compact size results in significantly lower energy and water consumption.',
    electricity: 'Low',
    water: 'Low',
    impact: 2,
    image: 'https://www.lntsmartworld.com/assets/img/edge-data-center.jpg',
    alt: 'Compact edge computing facility near urban infrastructure',
  },
  {
    slug: 'modular-data-center',
    name: 'Modular Data Center',
    description: 'Portable, prefabricated data centers designed for rapid deployment, scalability, and improved energy efficiency.',
    electricity: 'Low',
    water: 'Low',
    impact: 2,
    image: 'https://compu-dynamics.com/wp-content/uploads/2025/05/compu-dynamics-modular-data-center-solutions.jpg',
    alt: 'Containerized modular data center with modern cooling and transport-ready design',
  },
  {
    slug: 'government-data-center',
    name: 'Government Data Center',
    description: 'Secure facilities dedicated to government services, citizen data, and national infrastructure with moderate-to-high environmental impact.',
    electricity: 'High',
    water: 'Medium',
    impact: 3,
    image: 'https://tse1.mm.bing.net/th/id/OIP.5n6zhrpvY95dV2wSZB3r9wHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    alt: 'Secure government data center with industrial server racks and security lighting',
  },
];

export default datacenters;
