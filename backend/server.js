const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || "healthsymphony-secret-key-placeholder";

app.use(cors());
app.use(express.json());

// Root routes
app.get('/', (req, res) => {
    res.json({ message: 'HealthSymphony API is running ✅', status: 'active' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize PostgreSQL database
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Render
});

// Setup Tables
const initDatabase = async () => {
    try {
        // User Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT,
                email TEXT UNIQUE,
                phone TEXT,
                password TEXT,
                isPremium BOOLEAN DEFAULT false
            )
        `);
        
        // Subscription Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS subscriptions (
                id TEXT PRIMARY KEY,
                userId TEXT,
                planType TEXT,
                startDate BIGINT,
                expiryDate BIGINT,
                status TEXT
            )
        `);
        
        // Payment Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS payments (
                paymentId TEXT PRIMARY KEY,
                userId TEXT,
                amount REAL,
                paymentMethod TEXT,
                gateway TEXT,
                status TEXT
            )
        `);

        // Session Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS sessions (
                id TEXT PRIMARY KEY,
                userId TEXT,
                title TEXT,
                timestamp BIGINT
            )
        `);

        // Message Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS messages (
                id TEXT PRIMARY KEY,
                sessionId TEXT,
                sender TEXT,
                text TEXT,
                timestamp BIGINT,
                buttons TEXT
            )
        `);

        // Hospital Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS hospitals (
                id SERIAL PRIMARY KEY,
                name TEXT,
                type TEXT,
                specialty TEXT,
                address TEXT,
                district TEXT,
                latitude REAL,
                longitude REAL,
                phone TEXT
            )
        `);

        console.log('Database tables initialized successfully');
        
        // Seed hospital data if empty
        const result = await pool.query('SELECT COUNT(*) as count FROM hospitals');
        if (result.rows[0].count === 0) {
            const seedData = [
                ['Tamil Nadu Government Multi Super Speciality Hospital', 'hospital', 'General', 'Omandurar Government Estate, Chennai', 'chennai', 13.073225, 80.279268, '044-25673500'],
                ['Rajiv Gandhi Government General Hospital', 'hospital', 'General', 'EVR Periyar Salai, Park Town, Chennai', 'chennai', 13.0811, 80.2775, '044-25305000'],
                ['Apollo Hospitals', 'hospital', 'Cardiology', '21, Greams Lane, Off Greams Road, Chennai', 'chennai', 13.0617, 80.2520, '044-28290200'],
                ['Annal Gandhi Memorial Government Hospital', 'hospital', 'General', 'Puthur, Trichy', 'trichy', 10.8276, 78.6835, '0431-2771465'],
                ['Apollo Speciality Hospitals', 'hospital', 'Orthopedics', 'Chennai Bypass Road, Trichy', 'trichy', 10.8037, 78.6966, '0431-3344555'],
                ['Kauvery Hospital', 'hospital', 'General', 'Tennur, Trichy', 'trichy', 10.8174, 78.6841, '0431-4022555'],
                ['Government Mohan Kumaramangalam Medical College Hospital', 'hospital', 'Pediatrics', 'Fort Main Road, Salem', 'salem', 11.6441, 78.1402, '0427-2383200'],
                ['Shanmuga Hospital', 'hospital', 'General', '24, Sarada College Rd, Salem', 'salem', 11.6669, 78.1504, '0427-2324444'],
                ['Coimbatore Medical College Hospital', 'hospital', 'General', 'Trichy Rd, Coimbatore', 'coimbatore', 10.9996, 76.9733, '0422-2301393'],
                ['Ganga Hospital', 'hospital', 'Orthopedics', 'Mettupalayam Rd, Coimbatore', 'coimbatore', 11.0205, 76.9455, '0422-2485000'],
            ];

            for (const hospital of seedData) {
                await pool.query(
                    'INSERT INTO hospitals (name, type, specialty, address, district, latitude, longitude, phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
                    hospital
                );
            }
            console.log('Hospital seed data inserted');
        }
    } catch (err) {
        console.error('Database initialization error:', err);
    }
};

initDatabase();

// =====================
// Authentication Routes
// =====================

app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        
        // Validation
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: 'All fields required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = Date.now().toString();
        
        await pool.query(
            'INSERT INTO users (id, name, email, phone, password) VALUES ($1, $2, $3, $4, $5)',
            [userId, name, email, phone, hashedPassword]
        );
        
        res.json({ success: true, userId, message: 'Account created successfully' });
    } catch (error) {
        if (error.message.includes('duplicate key')) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password required' });
        }
        
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ 
            success: true, 
            token, 
            userId: user.id, 
            name: user.name,
            email: user.email,
            isPremium: user.isPremium
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// =====================
// Hospital Routes
// =====================

app.get('/api/hospitals', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM hospitals ORDER BY name ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/hospitals/:district', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM hospitals WHERE LOWER(district) = LOWER($1) ORDER BY name ASC',
            [req.params.district]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// =====================
// Chat Session Routes
// =====================

app.post('/api/sessions', async (req, res) => {
    try {
        const { userId, title } = req.body;
        
        if (!userId || !title) {
            return res.status(400).json({ success: false, message: 'userId and title required' });
        }
        
        const sessionId = Date.now().toString();
        
        await pool.query(
            'INSERT INTO sessions (id, userId, title, timestamp) VALUES ($1, $2, $3, $4)',
            [sessionId, userId, title, Date.now()]
        );
        
        res.json({ success: true, sessionId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/sessions/:userId', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM sessions WHERE userId = $1 ORDER BY timestamp DESC',
            [req.params.userId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// =====================
// Chat Message Routes
// =====================

app.post('/api/messages', async (req, res) => {
    try {
        const { sessionId, sender, text, buttons } = req.body;
        
        if (!sessionId || !sender || !text) {
            return res.status(400).json({ success: false, message: 'sessionId, sender, and text required' });
        }
        
        const messageId = Date.now().toString();
        
        await pool.query(
            'INSERT INTO messages (id, sessionId, sender, text, timestamp, buttons) VALUES ($1, $2, $3, $4, $5, $6)',
            [messageId, sessionId, sender, text, Date.now(), JSON.stringify(buttons || [])]
        );
        
        res.json({ success: true, messageId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/messages/:sessionId', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM messages WHERE sessionId = $1 ORDER BY timestamp ASC',
            [req.params.sessionId]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// =====================
// Premium/Subscription Routes
// =====================

app.post('/api/premium/upgrade', async (req, res) => {
    try {
        const { userId, planType } = req.body;
        
        if (!userId || !planType) {
            return res.status(400).json({ success: false, message: 'userId and planType required' });
        }
        
        const subscriptionId = Date.now().toString();
        const startDate = Date.now();
        const expiryDate = new Date(startDate + 365 * 24 * 60 * 60 * 1000).getTime(); // 1 year
        
        await pool.query(
            'INSERT INTO subscriptions (id, userId, planType, startDate, expiryDate, status) VALUES ($1, $2, $3, $4, $5, $6)',
            [subscriptionId, userId, planType, startDate, expiryDate, 'active']
        );
        
        await pool.query(
            'UPDATE users SET isPremium = true WHERE id = $1',
            [userId]
        );
        
        res.json({ success: true, subscriptionId, message: 'Premium upgrade successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/premium/status/:userId', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT isPremium FROM users WHERE id = $1',
            [req.params.userId]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ isPremium: result.rows[0].isPremium });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// =====================
// Error Handling
// =====================

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// =====================
// Start Server
// =====================

app.listen(port, () => {
    console.log(`🚀 HealthSymphony API Server running on port ${port}`);
    console.log(`📊 Database: ${process.env.DATABASE_URL ? 'PostgreSQL (Render)' : 'Local'}`);
    console.log(`🔐 Auth: JWT enabled`);
});
