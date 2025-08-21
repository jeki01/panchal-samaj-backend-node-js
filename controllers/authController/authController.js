const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { hashPassword, comparePassword } = require('../../utils/hash');
const {
    findUserByEmail,
    createUser,
    updateUserRefreshToken,
    clearUserRefreshToken,
    listOfUsers,
    toggleUserActiveStatus
} = require('../../services/authService');
const MailService = require('../../services/emailService');
const mailService = new MailService(process.env.GMAIL_USER, process.env.GMAIL_PASS);

const JWT_SECRET = process.env.JWT_SECRET || "yoursecretkey";

const register = async (req, res) => {
    const { email, password, fullName, choklaId, globalRole, mobileNumber } = req.body;
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
            globalRole,
            mobileNumber
        });
        await mailService.sendMail({
            to: email,
            subject: 'Welcome to the Panchal Samaj Portal!',
            text: `Hello ${fullName},\n\nYour account has been successfully created.\n\nYou can log in at: https://panchalsamaj14.shreetripurasundari.com/login\n\nEmail: ${email}\nPassword: ${password}\n\nPlease keep this information secure.`,
            html: `
                <p>Hello <strong>${fullName}</strong>,</p>
                <p>Your account has been successfully created.</p>
                <p><strong>Login URL:</strong> <a href="https://panchalsamaj14.shreetripurasundari.com/login" target="_blank">Login</a></p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>
                <p>Please keep this information secure.</p>
            `
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
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        if (!user.isActive) {
            return res.status(403).json({ message: 'Account is deactivated. Please contact the administrator.' });
        }
        const isMatch = await comparePassword(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        const token = jwt.sign(
            { userId: user.id, role: user.globalRole, villageId: user.villageId },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        if (!token) {
            return res.status(500).json({ message: 'Failed to generate token' });
        }
        await updateUserRefreshToken(user.id, token, { lastLogin: new Date() });
        res.json({
            token,
            userId: user.id,
            role: user.globalRole,
            email: user.email,
            choklaId: user.choklaId,
            villageId: user.villageId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const expiry = new Date(Date.now() + 10 * 60 * 1000); // valid 10 min

        await prisma.user.update({
            where: { id: user.id },
            data: { resetOtp: otp, otpExpiry: expiry, otpVerified: false }
        });

        await mailService.sendMail({
            to: email,
            subject: "Reset your password - Panchal Samaj Portal",
            text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
        });

        res.json({ message: "OTP sent to email" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.otpVerified) {
            return res.status(400).json({ message: "OTP not verified" });
        }

        const hashed = await hashPassword(newPassword);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash: hashed,
                resetOtp: null,
                otpExpiry: null,
                otpVerified: false
            }
        });

        res.json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.resetOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { otpVerified: true }
        });

        res.json({ message: "OTP verified successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const logout = async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        await clearUserRefreshToken(userId, { lastLogout: new Date() });
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const listOfallUsers = async (req, res) => {
    try {
        const list = await listOfUsers();
        res.send(list);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const toggleUserStatus = async (req, res) => {
    const { userId } = req.params;

    try {
        const updatedUser = await toggleUserActiveStatus(userId);
        const statusText = updatedUser.isActive ? 'activated' : 'deactivated';

        const emailHtml = `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #007BFF; padding: 16px 20px; color: #ffffff; text-align: center;">
            <h2 style="margin: 0;">Panchal Samaj Portal</h2>
          </div>
          <div style="padding: 20px;">
            <p style="font-size: 16px;">Hello <strong>${updatedUser.fullName}</strong>,</p>
            
            <p style="font-size: 15px; color: #333333;">
              Your account has been <strong style="color: ${updatedUser.isActive ? '#28a745' : '#dc3545'};">
              ${statusText.toUpperCase()}</strong>.
            </p>

            ${updatedUser.isActive
                ? `
              <p style="font-size: 15px; margin-top: 20px;">You can now log in to the portal using the following link:</p>
              <p style="font-size: 15px;"><a href="https://panchalsamaj14.shreetripurasundari.com/login" style="color: #007BFF;">Login to Portal</a></p>           
              <p style="font-size: 13px; color: #888888; margin-top: 10px;">Please keep your login information secure.</p>
              `
                : `
              <p style="font-size: 15px; margin-top: 20px;">
                Your access to the portal has been temporarily disabled. If you believe this is a mistake, please contact the administrator.
              </p>
              `
            }
          </div>
          <div style="background-color: #f1f1f1; padding: 12px 20px; text-align: center; font-size: 13px; color: #666;">
            © ${new Date().getFullYear()} Panchal Samaj Portal. All rights reserved.
          </div>
        </div>
      </div>
    `;

        await mailService.sendMail({
            to: updatedUser.email,
            subject: `Your Panchal Samaj account has been ${statusText}`,
            html: emailHtml,
        });

        res.status(200).json({
            message: `User has been successfully ${statusText}.`,
            userId: updatedUser.id,
            isActive: updatedUser.isActive,
        });
    } catch (error) {
        console.error('Toggle user status error:', error);
        res.status(500).json({ error: 'Something went wrong while toggling user status.' });
    }
};

module.exports = {
    register,
    login,
    logout,
    listOfallUsers,
    toggleUserStatus,
    verifyOtp,
    forgotPassword,
    resetPassword
};


