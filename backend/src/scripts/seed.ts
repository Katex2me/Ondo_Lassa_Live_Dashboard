import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Seed database with sample data
const seedDatabase = async () => {
  try {
    // Insert sample lassa cases data
    const sampleData = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      region: 'Ondo State',
      confirmed: Math.floor(Math.random() * 100) + 50,
      suspected: Math.floor(Math.random() * 50) + 20,
      deaths: Math.floor(Math.random() * 20) + 5,
      recovered: Math.floor(Math.random() * 80) + 30,
    }));

    for (const data of sampleData) {
      await pool.query(
        `INSERT INTO lassa_cases (date, region, confirmed_cases, suspected_cases, deaths, recovered)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [data.date, data.region, data.confirmed, data.suspected, data.deaths, data.recovered]
      );
    }

    console.log('✅ Database seeded with sample data');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    pool.end();
  }
};

seedDatabase();
