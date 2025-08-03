const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../../utils/hash');
const {
    findUserByEmail,
    createUser,
    updateUserRefreshToken,
    clearUserRefreshToken,
    listOfUsers
} = require('../../services/authService');

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

// Register
const register = async (req, res) => {
    const { email, password, fullName, choklaId, globalRole } = req.body;
    if (!email || !password || !fullName || !choklaId || !globalRole) {
        return res.status(400).json({
            error: 'Missing required fields. Please provide email, password, fullName, choklaId, and globalRole.'
        });
    }

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: 'Email already exists' });
        const hashedPassword = await hashPassword(password);
        const newUser = await createUser({
            email,
            passwordHash: hashedPassword,
            fullName,
            choklaId,
            globalRole
        });

        res.status(201).json({ message: 'User registered successfully', userId: newUser.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {

    const { email, password } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await comparePassword(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id, role: user.globalRole, villageId: user.villageId }, JWT_SECRET, { expiresIn: '1h' });

        await updateUserRefreshToken(user.id, token);
        res.json({ token, userId: user.id, role: user.globalRole, email: user.email, choklaId: user.choklaId, villageId: user.villageId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Logout
const logout = async (req, res) => {
    const userId = req.user.userId;

    try {
        await clearUserRefreshToken(userId);
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const listOfallUsers = async (req, res) => {
    const list = await listOfUsers()
    res.send(list)
};

module.exports = {
    register,
    login,
    logout,
    listOfallUsers
};
