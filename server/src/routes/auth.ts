import express, { Request, Response } from 'express';
import { findUserByCredentials, generateToken } from '../services/authService';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    const user = findUserByCredentials(email, password);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    const token = generateToken(user.id);

    return res.json({
      token,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
});

router.post('/logout', async (req: Request, res: Response) => {
  return res.json({ message: 'Logged out successfully' });
});

export default router;