export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}

export const users: User[] = [
  {
    id: '1',
    email: 'admin@ecopulse.ai',
    password: 'password123',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'demo@ecopulse.ai',
    password: 'demo123',
    name: 'Demo User',
    role: 'user',
  },
];