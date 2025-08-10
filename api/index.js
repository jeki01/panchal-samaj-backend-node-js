const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Import routes
const chakolaRoutes = require('../routes/chakolaRoutes/chakolaRoutes');
const personRoutes = require('../routes/personRoutes/personRoutes');
const familyRoutes = require('../routes/familyRoutes/familyRoutes');
const villageRoutes = require('../routes/villageRoutes/villageRoute');
const authRoute = require('../routes/authRoute/authRoute');
const usersRoute = require('../routes/usersRoute/usersRoute');

const {
    sendMessage,
    initializeWhatsApp,
    isClientReady
} = require('../services/whatsappService');

// App setup
const app = express();
const corsOptions = { origin: '*' };

// Initialize WhatsApp
initializeWhatsApp();

// Middleware
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/chokhla', chakolaRoutes);
app.use('/village', villageRoutes);
app.use('/family', familyRoutes);
app.use('/person', personRoutes);
app.use('/api/auth', authRoute);
app.use('/user', usersRoute);

// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// WhatsApp send-message route
app.post('/send-message', async (req, res) => {
    console.log('Client Ready:', isClientReady());

    if (!isClientReady()) {
        return res.status(503).json({
            success: false,
            error: 'WhatsApp client not ready. Please scan the QR code and wait for readiness.',
        });
    }

    const { number, message } = req.body;

    if (!number || !message) {
        return res.status(400).json({
            success: false,
            error: 'Number and message are required',
        });
    }

    const result = await sendMessage(number, message);

    if (result.success) {
        res.json({ success: true, data: result.result });
    } else {
        res.status(500).json({
            success: false,
            error: result.error.message,
        });
    }
});

// Error handlers
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
    });
});

// Start server
// app.listen(5000, () => {
//     console.log("✅ Server listening on port 5000");
// });


module.exports = app;