// const express = require('express');
// const dotenv = require('dotenv');
// const cookieParser = require('cookie-parser');
// const cors = require('cors');
// const { PrismaClient } = require('@prisma/client');

// // Load environment variables
// dotenv.config();

// // Import routes
// const chakolaRoutes = require('./routes/chakolaRoutes/chakolaRoutes');
// const personRoutes = require('./routes/personRoutes/personRoutes');
// const familyRoutes = require('./routes/familyRoutes/familyRoutes');
// const villageRoutes = require('./routes/villageRoutes/villageRoute');
// const authRoute = require('./routes/authRoute/authRoute');
// const usersRoute = require('./routes/usersRoute/usersRoute');

// // App setup
// const app = express();
// const corsOptions = { origin: '*' };

// // Middleware
// app.use(cors(corsOptions));
// app.use(cookieParser());
// app.use(express.json());

// // Routes
// app.use('/chokhla', chakolaRoutes);
// app.use('/village', villageRoutes);
// app.use('/family', familyRoutes);
// app.use('/person', personRoutes);
// app.use('/api/auth', authRoute);
// app.use('/user', usersRoute);

// // Root route
// app.get('/', (req, res) => {
//     res.send('API is running...');
// });

// // 404 Not Found handler
// app.use((req, res, next) => {
//     res.status(404).json({
//         status: 'error',
//         message: 'Route not found',
//     });
// });

// // Global Error Handler
// app.use((err, req, res, next) => {
//     console.error('❌ Error:', err.stack);
//     res.status(err.status || 500).json({
//         status: 'error',
//         message: err.message || 'Internal Server Error',
//     });
// });

// let prisma;

// if (process.env.NODE_ENV === 'production') {
//     prisma = new PrismaClient();
// } else {
//     if (!global.prisma) {
//         global.prisma = new PrismaClient();
//     }
//     prisma = global.prisma;
// }

// module.exports = { app, prisma };
