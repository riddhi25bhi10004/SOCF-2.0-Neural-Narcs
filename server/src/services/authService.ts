import { users, User } from '../data/user';

export const findUserByCredentials = (
  email: string,
  password: string
): Omit<User, 'password'> | null => {
  const user = users.find(
    (u: User) => u.email === email && u.password === password
  );

  if (!user) {
    return null;
  }

  // Remove password before returning
  const { password: _password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const generateToken = (userId: string): string => {
  // Using Buffer for token generation
  const data = `${userId}:${Date.now()}:${Math.random()}`;
  const buffer = Buffer.from(data, 'utf-8');
  return buffer.toString('base64');
};

export const validateToken = (token: string): { userId: string } | null => {
  try {
    const buffer = Buffer.from(token, 'base64');
    const decoded = buffer.toString('utf-8');
    const [userId] = decoded.split(':');
    const userExists = users.some((u: User) => u.id === userId);

    if (!userExists) {
      return null;
    }

    return { userId };
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
};