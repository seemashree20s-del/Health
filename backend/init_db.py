import sqlite3
import os

db_path = os.path.join(os.path.dirname(__file__), 'database.sqlite')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS hospitals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        type TEXT,
        specialty TEXT,
        address TEXT,
        district TEXT,
        latitude REAL,
        longitude REAL,
        phone TEXT
    )
''')

# Check if empty
cursor.execute('SELECT COUNT(*) FROM hospitals')
if cursor.fetchone()[0] == 0:
    seed_data = [
        ('Tamil Nadu Government Multi Super Speciality Hospital', 'hospital', 'General', 'Omandurar Government Estate, Chennai', 'chennai', 13.073225, 80.279268, '044-25673500'),
        ('Rajiv Gandhi Government General Hospital', 'hospital', 'General', 'EVR Periyar Salai, Park Town, Chennai', 'chennai', 13.0811, 80.2775, '044-25305000'),
        ('Apollo Hospitals', 'hospital', 'Cardiology', '21, Greams Lane, Off Greams Road, Chennai', 'chennai', 13.0617, 80.2520, '044-28290200'),
        ('Annal Gandhi Memorial Government Hospital', 'hospital', 'General', 'Puthur, Trichy', 'trichy', 10.8276, 78.6835, '0431-2771465'),
        ('Apollo Speciality Hospitals', 'hospital', 'Orthopedics', 'Chennai Bypass Road, Trichy', 'trichy', 10.8037, 78.6966, '0431-3344555'),
        ('Kauvery Hospital', 'hospital', 'General', 'Tennur, Trichy', 'trichy', 10.8174, 78.6841, '0431-4022555'),
        ('Government Mohan Kumaramangalam Medical College Hospital', 'hospital', 'Pediatrics', 'Fort Main Road, Salem', 'salem', 11.6441, 78.1402, '0427-2383200'),
        ('Shanmuga Hospital', 'hospital', 'General', '24, Sarada College Rd, Salem', 'salem', 11.6669, 78.1504, '0427-2324444'),
        ('Coimbatore Medical College Hospital', 'hospital', 'General', 'Trichy Rd, Coimbatore', 'coimbatore', 10.9996, 76.9733, '0422-2301393'),
        ('Ganga Hospital', 'hospital', 'Orthopedics', 'Mettupalayam Rd, Coimbatore', 'coimbatore', 11.0205, 76.9455, '0422-2485000'),
        ('Government Rajaji Hospital', 'hospital', 'Neurology', 'Panagal Road, Madurai', 'madurai', 9.9295, 78.1384, '0452-2532535'),
        ('Meenakshi Mission Hospital', 'hospital', 'Cardiology', 'Melur Road, Madurai', 'madurai', 9.9469, 78.1738, '0452-4263000'),
        ('Christian Medical College (CMC)', 'hospital', 'General', 'Ida Scudder Road, Vellore', 'vellore', 12.9248, 79.1352, '0416-2281000'),
        ('Government Erode Medical College Hospital', 'hospital', 'General', 'Perundurai, Erode', 'erode', 11.2750, 77.5857, '04294-220950'),
        ('Tirunelveli Medical College Hospital', 'hospital', 'Pediatrics', 'High Ground, Tirunelveli', 'tirunelveli', 8.7186, 77.7473, '0462-2572701'),
        ('108 Ambulance Hub - Chennai', 'emergency', 'General', 'Central Chennai', 'chennai', 13.0650, 80.2000, '108'),
        ('108 Ambulance Hub - Trichy', 'emergency', 'General', 'Central Trichy', 'trichy', 10.8200, 78.6800, '108'),
        ('108 Ambulance Hub - Madurai', 'emergency', 'General', 'Central Madurai', 'madurai', 9.9300, 78.1200, '108'),
        ('Chennai Primary Health Clinic', 'clinic', 'General', 'Adyar, Chennai', 'chennai', 13.0031, 80.2558, '044-25656565'),
        ('Salem Smiles Dental Clinic', 'clinic', 'Dental', 'Alagapuram, Salem', 'salem', 11.6600, 78.1400, '0427-2345678'),
        ('MIOT International', 'hospital', 'Orthopedics', 'Manapakkam, Chennai', 'chennai', 13.0163, 80.1803, '044-42002288')
    ]
    cursor.executemany('''
        INSERT INTO hospitals (name, type, specialty, address, district, latitude, longitude, phone) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', seed_data)
    conn.commit()

conn.close()
print("Database officially created at database.sqlite!")
