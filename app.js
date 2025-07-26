
const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const chakolaRoutes = require('./routes/chakolaRoutes/chakolaRoutes');
const personRoutes = require('./routes/personRoutes/personRoutes');
const familyRoutes = require('./routes/familyRoutes/familyRoutes');
const villageRoutes = require('./routes/villageRoutes/villageRoute');
const authRoute = require('./routes/authRoute/authRoute');
const usersRoute = require('./routes/usersRoute/usersRoute');
const cors = require('cors')
const corsOptions = {
    origin: 'http://localhost:3000',
}
dotenv.config();
const app = express();
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

app.get('/', (req, res) => {
    res.send('API is running...');
});

module.exports = app;
