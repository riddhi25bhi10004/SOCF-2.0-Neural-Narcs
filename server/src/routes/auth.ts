import express, { Request, Response } from 'express';
import {
  findOrCreateGoogleUser,
  findOrCreateUserByEmail,
  generateToken,
} from '../services/authService.js';

const router = express.Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email: rawEmail, password } = req.body;
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required',
      });
    }

    const user = findOrCreateUserByEmail(email, email.split('@')[0], password);
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

router.post('/google', async (req: Request, res: Response) => {
  try {
    const { email: rawEmail, name } = req.body;
    const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';

    if (!email) {
      return res.status(400).json({
        error: 'Email is required',
      });
    }

    const user = findOrCreateGoogleUser(email, name);
    const token = generateToken(user.id);

    return res.json({
      token,
      user,
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(500).json({
      error: 'Unable to sign in with Google right now',
    });
  }
});

router.post('/logout', async (req: Request, res: Response) => {
  return res.json({ message: 'Logged out successfully' });
});

export default router;