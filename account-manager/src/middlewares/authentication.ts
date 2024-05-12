import { Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';
import { STATUS } from '../constants/status';
import { AuthenticatedRequest } from 'src/types';

export const authMiddleware = async (req: AuthenticatedRequest | any, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(STATUS.AUTHORIZATION_ERROR).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    const { data: user, error } = await supabase.auth.getUser(token);

    if (error) {
      console.error('Error authenticating user:', error);
      return res.status(STATUS.AUTHORIZATION_ERROR).json({ error: 'Unauthorized' });
    }

    if (!user) {
      return res.status(STATUS.AUTHORIZATION_ERROR).json({ error: 'Unauthorized' });
    }

    req.user = user as any;
    next();
  } catch (error) {
    console.error('Error in authentication middleware:', error);
    res.status(STATUS.NETWORK_ERROR).json({ error: 'Internal Server Error' });
  }
};