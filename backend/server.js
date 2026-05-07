// const express = require('express');
// const cors = require('cors');
// const sqlite3 = require('sqlite3').verbose();
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// const app = express();
// const port = 5000;
// const SECRET_KEY = "healthsymphony-secret-key-placeholder";

// app.use(cors());
// app.use(express.json());

// // Initialize SQLite database
// const db = new sqlite3.Database('./database.sqlite', (err) => {
//     if (err) console.error(err.message);
//     else console.log('Connected to SQLite database.');
// });

// // Setup Tables for Secure System Requirements
// db.serialize(() => {
//     // User Table
//     db.run(`CREATE TABLE IF NOT EXISTS users (
//         id TEXT PRIMARY KEY,
//         name TEXT,
//         email TEXT UNIQUE,
//         phone TEXT,
//         password TEXT,
//         isPremium BOOLEAN DEFAULT 0
//     )`);
    
//     // Subscription Table
//     db.run(`CREATE TABLE IF NOT EXISTS subscriptions (
//         id TEXT PRIMARY KEY,
//         userId TEXT,
//         planType TEXT,
//         startDate INTEGER,
//         expiryDate INTEGER,
//         status TEXT
//     )`);
    
//     // Payment Table
//     db.run(`CREATE TABLE IF NOT EXISTS payments (
//         paymentId TEXT PRIMARY KEY,
//         userId TEXT,
//         amount REAL,
//         paymentMethod TEXT,
//         gateway TEXT,
//         status TEXT
//     )`);

//     // Session Table
//     db.run(`CREATE TABLE IF NOT EXISTS sessions (
//         id TEXT PRIMARY KEY,
//         userId TEXT,
//         title TEXT,
//         timestamp INTEGER
//     )`);

//     // Message Table
//     db.run(`CREATE TABLE IF NOT EXISTS messages (
//         id TEXT PRIMARY KEY,
//         sessionId TEXT,
//         sender TEXT,
//         text TEXT,
//         timestamp INTEGER,
//         buttons TEXT
//     )`);

//     // Hospital Table
//     db.run(`CREATE TABLE IF NOT EXISTS hospitals (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         name TEXT,
//         type TEXT,
//         specialty TEXT,
//         address TEXT,
//         district TEXT,
//         latitude REAL,
//         longitude REAL,
//         phone TEXT
//     )`, () => {
//         // Seed data for Tamil Nadu hospitals
//         db.get(`SELECT COUNT(*) as count FROM hospitals`, (err, row) => {
//             if (row && row.count === 0) {
//                 const seedData = [
//                     ['Tamil Nadu Government Multi Super Speciality Hospital', 'hospital', 'General', 'Omandurar Government Estate, Chennai', 'chennai', 13.073225, 80.279268, '044-25673500'],
//                     ['Rajiv Gandhi Government General Hospital', 'hospital', 'General', 'EVR Periyar Salai, Park Town, Chennai', 'chennai', 13.0811, 80.2775, '044-25305000'],
//                     ['Apollo Hospitals', 'hospital', 'Cardiology', '21, Greams Lane, Off Greams Road, Chennai', 'chennai', 13.0617, 80.2520, '044-28290200'],
//                     ['Annal Gandhi Memorial Government Hospital', 'hospital', 'General', 'Puthur, Trichy', 'trichy', 10.8276, 78.6835, '0431-2771465'],
//                     ['Apollo Speciality Hospitals', 'hospital', 'Orthopedics', 'Chennai Bypass Road, Trichy', 'trichy', 10.8037, 78.6966, '0431-3344555'],
//                     ['Kauvery Hospital', 'hospital', 'General', 'Tennur, Trichy', 'trichy', 10.8174, 78.6841, '0431-4022555'],
//                     ['Government Mohan Kumaramangalam Medical College Hospital', 'hospital', 'Pediatrics', 'Fort Main Road, Salem', 'salem', 11.6441, 78.1402, '0427-2383200'],
//                     ['Shanmuga Hospital', 'hospital', 'General', '24, Sarada College Rd, Salem', 'salem', 11.6669, 78.1504, '0427-2324444'],
//                     ['Coimbatore Medical College Hospital', 'hospital', 'General', 'Trichy Rd, Coimbatore', 'coimbatore', 10.9996, 76.9733, '0422-2301393'],
//                     ['Ganga Hospital', 'hospital', 'Orthopedics', 'Mettupalayam Rd, Coimbatore', 'coimbatore', 11.0205, 76.9455, '0422-2485000'],
//                     ['Government Rajaji Hospital', 'hospital', 'Neurology', 'Panagal Road, Madurai', 'madurai', 9.9295, 78.1384, '0452-2532535'],
//                     ['Meenakshi Mission Hospital', 'hospital', 'Cardiology', 'Melur Road, Madurai', 'madurai', 9.9469, 78.1738, '0452-4263000'],
//                     ['Christian Medical College (CMC)', 'hospital', 'General', 'Ida Scudder Road, Vellore', 'vellore', 12.9248, 79.1352, '0416-2281000'],
//                     ['Government Erode Medical College Hospital', 'hospital', 'General', 'Perundurai, Erode', 'erode', 11.2750, 77.5857, '04294-220950'],
//                     ['Tirunelveli Medical College Hospital', 'hospital', 'Pediatrics', 'High Ground, Tirunelveli', 'tirunelveli', 8.7186, 77.7473, '0462-2572701'],
//                     ['108 Ambulance Hub - Chennai', 'emergency', 'General', 'Central Chennai', 'chennai', 13.0650, 80.2000, '108'],
//                     ['108 Ambulance Hub - Trichy', 'emergency', 'General', 'Central Trichy', 'trichy', 10.8200, 78.6800, '108'],
//                     ['108 Ambulance Hub - Madurai', 'emergency', 'General', 'Central Madurai', 'madurai', 9.9300, 78.1200, '108'],
//                     ['Chennai Primary Health Clinic', 'clinic', 'General', 'Adyar, Chennai', 'chennai', 13.0031, 80.2558, '044-25656565'],
//                     ['Salem Smiles Dental Clinic', 'clinic', 'Dental', 'Alagapuram, Salem', 'salem', 11.6600, 78.1400, '0427-2345678'],
//                     ['MIOT International', 'hospital', 'Orthopedics', 'Manapakkam, Chennai', 'chennai', 13.0163, 80.1803, '044-42002288']
//                 ];
                
//                 const stmt = db.prepare(`INSERT INTO hospitals (name, type, specialty, address, district, latitude, longitude, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
//                 seedData.forEach(row => stmt.run(row));
//                 stmt.finalize();
//             }
//         });
//     });
// });

// const KnowledgeBase = require('../knowledgeBase.js');

// // Authentication Middleware
// const authenticateToken = (req, res, next) => {
//     const token = req.headers['authorization']?.split(' ')[1];
//     if (!token) return res.status(401).json({ error: "Access denied" });
//     jwt.verify(token, SECRET_KEY, (err, user) => {
//         if (err) return res.status(403).json({ error: "Invalid token" });
//         req.user = user;
//         next();
//     });
// };

// app.post('/api/auth/register', async (req, res) => {
//     const { name, email, password } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, hashedPassword], function(err) {
//             if (err) return res.status(400).json({ error: "Email already exists" });
//             const token = jwt.sign({ id: this.lastID, email, name }, SECRET_KEY);
//             res.json({ token, user: { id: this.lastID, email, name, isPremium: false } });
//         });
//     } catch {
//         res.status(500).json({ error: "Server error" });
//     }
// });

// app.post('/api/auth/login', (req, res) => {
//     const { email, password } = req.body;
//     db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
//         if (err || !user) return res.status(400).json({ error: "Invalid user or password" });
//         const validPassword = await bcrypt.compare(password, user.password);
//         if (!validPassword) return res.status(400).json({ error: "Invalid user or password" });
        
//         const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET_KEY);
//         res.json({ token, user: { id: user.id, email: user.email, name: user.name, isPremium: user.isPremium } });
//     });
// });

// app.post('/api/user/premium', authenticateToken, (req, res) => {
//     db.run(`UPDATE users SET isPremium = 1 WHERE id = ?`, [req.user.id], (err) => {
//         if (err) return res.status(500).json({ error: "Failed to upgrade" });
//         res.json({ success: true, message: "Upgraded to Premium" });
//     });
// });

// app.get('/api/sessions', authenticateToken, (req, res) => {
//     db.all(`SELECT * FROM sessions WHERE userId = ? ORDER BY timestamp DESC`, [req.user.id], (err, rows) => {
//         res.json(rows || []);
//     });
// });

// app.post('/api/chat', authenticateToken, (req, res) => {
//     const { sessionId, text } = req.body;
//     let currentSessionId = sessionId;

//     const processChat = (sId) => {
//         const timestamp = Date.now();
//         const userMsgId = timestamp.toString() + Math.random();
        
//         db.run(`INSERT INTO messages (id, sessionId, sender, text, timestamp) VALUES (?, ?, ?, ?, ?)`, 
//             [userMsgId, sId, 'user', text, timestamp], () => {
            
//             // Bot Response
//             const analysis = KnowledgeBase.analyze(text);
//             const botText = analysis.text;
//             const buttons = JSON.stringify(analysis.followUps || []);
//             const botTimestamp = Date.now() + 1000;
//             const botMsgId = botTimestamp.toString() + Math.random();
            
//             db.run(`INSERT INTO messages (id, sessionId, sender, text, timestamp, buttons) VALUES (?, ?, ?, ?, ?, ?)`, 
//                 [botMsgId, sId, 'bot', botText, botTimestamp, buttons], () => {
                
//                 res.json({ 
//                     sessionId: sId, 
//                     userMessage: { text, timestamp }, 
//                     botMessage: { text: botText, timestamp: botTimestamp, buttons: analysis.followUps } 
//                 });
//             });
//         });
//     };

//     if (!currentSessionId) {
//         currentSessionId = Date.now().toString();
//         const title = text.length > 20 ? text.substring(0,20)+'...' : text;
//         db.run(`INSERT INTO sessions (id, userId, title, timestamp) VALUES (?, ?, ?, ?)`, 
//             [currentSessionId, req.user.id, title, Date.now()], () => {
//             processChat(currentSessionId);
//         });
//     } else {
//         processChat(currentSessionId);
//     }
// });

// app.get('/api/sessions/:id/messages', authenticateToken, (req, res) => {
//     db.all(`SELECT * FROM messages WHERE sessionId = ? ORDER BY timestamp ASC`, [req.params.id], (err, rows) => {
//         res.json(rows || []);
//     });
// });

// app.get('/api/locations', (req, res) => {
//     const { district, type, search, specialty } = req.query;
//     let query = `SELECT * FROM hospitals WHERE 1=1`;
//     let params = [];
    
//     if (district && district !== 'all') {
//         query += ` AND LOWER(district) = ?`;
//         params.push(district.toLowerCase());
//     }
    
//     if (type && type !== 'all') {
//         query += ` AND type = ?`;
//         params.push(type);
//     }

//     if (specialty && specialty !== 'all') {
//         query += ` AND LOWER(specialty) LIKE ?`;
//         params.push(`%${specialty.toLowerCase()}%`);
//     }
    
//     if (search) {
//         query += ` AND (LOWER(name) LIKE ? OR LOWER(address) LIKE ?)`;
//         params.push(`%${search.toLowerCase()}%`);
//         params.push(`%${search.toLowerCase()}%`);
//     }
    
//     db.all(query, params, (err, rows) => {
//         if (err) return res.status(500).json({ error: "Failed to fetch locations" });
//         res.json(rows || []);
//     });
// });

// app.listen(port, () => {
//     console.log(`Backend API running on http://localhost:${port}`);
// });




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

// Routes
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = Date.now().toString();
        
        await pool.query(
            'INSERT INTO users (id, name, email, phone, password) VALUES ($1, $2, $3, $4, $5)',
            [userId, name, email, phone, hashedPassword]
        );
        
        res.json({ success: true, userId });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ success: true, token, userId: user.id, name: user.name });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/hospitals', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM hospitals');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/hospitals/:district', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM hospitals WHERE LOWER(district) = LOWER($1)',
            [req.params.district]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/sessions', async (req, res) => {
    try {
        const { userId, title } = req.body;
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

app.post('/api/messages', async (req, res) => {
    try {
        const { sessionId, sender, text, buttons } = req.body;
        const messageId = Date.now().toString();
        
        await pool.query(
            'INSERT INTO messages (id, sessionId, sender, text, timestamp, buttons) VALUES ($1, $2, $3, $4, $5, $6)',
            [messageId, sessionId, sender, text, Date.now(), JSON.stringify(buttons)]
        );
        
        res.json({ success: true, messageId });
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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});