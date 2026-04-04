import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'codequest-dev-secret-change-in-production'

/**
 * requireAuth middleware
 *
 * Checks the Authorization header for a valid JWT.
 * If valid: attaches the decoded user payload to req.user and calls next()
 * If invalid/missing: responds with 401 Unauthorized
 *
 * Usage: router.get('/protected', requireAuth, handler)
 */
export function requireAuth(req, res, next) {
  // The Authorization header format is: "Bearer <token>"
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const token = authHeader.split(' ')[1]

  try {
    // jwt.verify throws if the token is expired or tampered with
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded // { id, username, email } — available in all downstream handlers
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

/**
 * Helper to sign a new JWT.
 * Tokens expire in 7 days — after that the user must log in again.
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}
