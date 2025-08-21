const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const sessionId = req.cookies?.sessionId; // sessionId is stored in cookies

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify JWT
        const decoded = jwt.verify(token, JWT_SECRET);

        // Fetch user from DB
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Check if sessionId matches current DB session
        if (!sessionId || user.sessionId !== sessionId) {
            return res.status(401).json({ message: 'Invalid or expired session' });
        }

        // Attach user info to request
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Auth error:", error);
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authenticate;
