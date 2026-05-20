import { verifyToken } from '@clerk/backend';

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = header.slice(7);

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    req.auth = {
      userId: payload.sub,
      sessionId: payload.sid,
    };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export async function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next();
  }

  const token = header.slice(7);
  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    req.auth = { userId: payload.sub, sessionId: payload.sid };
  } catch {
    // ignore invalid token for optional routes
  }
  next();
}
