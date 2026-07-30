import { users, User } from '../data/users';

export const findUserByCredentials = (
  email: string,
  password: string
): Omit<User, 'password'> | null => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = users.find(
    (u: User) => u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  if (!user) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const findOrCreateUserByEmail = (
  email: string,
  name?: string,
  password?: string
): Omit<User, 'password'> => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = users.find((u: User) => u.email.toLowerCase() === normalizedEmail);

  if (existingUser) {
    const { password: _password, ...userWithoutPassword } = existingUser;
    return userWithoutPassword;
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    email: normalizedEmail,
    password: password || '',
    name: name || normalizedEmail.split('@')[0],
    role: 'user',
  };

  users.push(newUser);
  const { password: _password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const findOrCreateGoogleUser = (
  email: string,
  name?: string
): Omit<User, 'password'> => {
  const existingUser = users.find((u: User) => u.email === email);

  if (existingUser) {
    const { password: _password, ...userWithoutPassword } = existingUser;
    return userWithoutPassword;
  }

  const googleUser: User = {
    id: `google-${Date.now()}`,
    email,
    password: '',
    name: name || email.split('@')[0],
    role: 'user',
  };

  users.push(googleUser);
  const { password: _password, ...userWithoutPassword } = googleUser;
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