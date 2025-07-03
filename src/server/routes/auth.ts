import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { prisma } from '../../utils/database';
import { createError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';
import { JwtPayload } from '../../types';
import { signJWT, verifyJWT } from '../../utils/jwt';

const router = Router();

// Register new user
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username, firstName, lastName, password, role } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'User with this email or username already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        firstName,
        lastName,
        password: hashedPassword,
        role: role || 'ENTHUSIAST'
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true
      }
    });

    // Generate JWT token
    const token = signJWT({ userId: user.id });

    return res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    return next(createError('Registration failed', 500));
  }
});

// Login user
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        password: true
      }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    // Update last active
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActive: new Date() }
    });

    // Generate JWT token
    const token = signJWT({ userId: user.id });

    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    return next(createError('Login failed', 500));
  }
});

// Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const user = req.user as any;
      const token = signJWT({ userId: user.id });

      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    } catch (error) {
      res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }
  }
);

// LinkedIn OAuth
router.get('/linkedin',
  passport.authenticate('linkedin', { scope: ['r_emailaddress', 'r_liteprofile'] })
);

router.get('/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const user = req.user as any;
      const token = signJWT({ userId: user.id });

      res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
    } catch (error) {
      res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
    }
  }
);

// Verify token
router.get('/verify', async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyJWT(token);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true
      }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    return res.json({ user });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

export default router; 