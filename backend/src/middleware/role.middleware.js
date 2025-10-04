import jwt from 'jsonwebtoken';

export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            // Get token from headers
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: 'Authorization token missing' });
            }

            const token = authHeader.split(' ')[1];

            // Verify token and decode payload
            const secret = process.env.JWT_SECRET;
            const decoded = jwt.verify(token, secret);

            // decoded should have user info, including role
            const userRole = decoded.role;

            // Check if user's role is in allowedRoles
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ message: 'Access forbidden: insufficient role' });
            }

            // Attach user info to request for further use if needed
            req.user = decoded;

            next();
        } catch (error) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    };
};
