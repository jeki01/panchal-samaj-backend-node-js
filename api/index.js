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
const backupRoute = require('../routes/backupRoute/backupRoute');
// App setup
const app = express();
const corsOptions = { origin: '*' };

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
app.use('/', backupRoute);


// Root route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// 404 Not Found handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
    });
});

app.listen(5000, console.log("listin on the ", 5000))

// ...existing code...
// module.exports = app;
