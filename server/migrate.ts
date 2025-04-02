import { pool } from './db';
import * as schema from '@shared/schema';

// Add migrate script to package.json: "db:migrate": "ts-node server/migrate.ts"

async function runMigration() {
  console.log('Running database migrations...');
  
  try {
    // Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        organization VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created');

    // Bacteria table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bacteria (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        scientific_name VARCHAR(255) NOT NULL,
        description TEXT
      )
    `);
    console.log('Bacteria table created');

    // Antibiotics table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS antibiotics (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        class VARCHAR(255) NOT NULL,
        description TEXT
      )
    `);
    console.log('Antibiotics table created');

    // Regions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS regions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50) NOT NULL,
        parent_id INTEGER REFERENCES regions(id),
        geo_json JSONB
      )
    `);
    console.log('Regions table created');

    // Facilities table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS facilities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        region_id INTEGER NOT NULL REFERENCES regions(id),
        address TEXT,
        contact_info TEXT
      )
    `);
    console.log('Facilities table created');

    // Resistance data table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS resistance_data (
        id SERIAL PRIMARY KEY,
        bacteria_id INTEGER NOT NULL REFERENCES bacteria(id),
        antibiotic_id INTEGER NOT NULL REFERENCES antibiotics(id),
        region_id INTEGER NOT NULL REFERENCES regions(id),
        facility_id INTEGER REFERENCES facilities(id),
        sample_date DATE NOT NULL,
        total_samples INTEGER NOT NULL,
        resistant_samples INTEGER NOT NULL,
        uploaded_by_id INTEGER REFERENCES users(id),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
      )
    `);
    console.log('Resistance data table created');

    // Resources table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS resources (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        url TEXT NOT NULL,
        description TEXT,
        published_at TIMESTAMP NOT NULL,
        added_by_id INTEGER REFERENCES users(id)
      )
    `);
    console.log('Resources table created');

    // Alerts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        severity VARCHAR(50) NOT NULL,
        bacteria_id INTEGER REFERENCES bacteria(id),
        antibiotic_id INTEGER REFERENCES antibiotics(id),
        region_id INTEGER REFERENCES regions(id),
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Alerts table created');

    // Seed initial data
    await seedInitialData();

    console.log('Database migration completed successfully!');
  } catch (error) {
    console.error('Error running migration:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

async function seedInitialData() {
  console.log('Seeding initial data...');

  // Seed bacteria
  const bacteriaResult = await pool.query(`
    INSERT INTO bacteria (name, scientific_name, description)
    VALUES 
      ('E. coli', 'Escherichia coli', 'Common gram-negative bacteria found in the intestines'),
      ('S. aureus', 'Staphylococcus aureus', 'Gram-positive bacteria commonly found on the skin'),
      ('K. pneumoniae', 'Klebsiella pneumoniae', 'Gram-negative bacteria that can cause pneumonia and other infections'),
      ('P. aeruginosa', 'Pseudomonas aeruginosa', 'Gram-negative bacteria associated with hospital-acquired infections')
    ON CONFLICT DO NOTHING
    RETURNING id, name
  `);
  console.log('Bacteria seeded:', bacteriaResult.rows);

  // Seed antibiotics
  const antibioticsResult = await pool.query(`
    INSERT INTO antibiotics (name, class, description)
    VALUES 
      ('Amoxicillin', 'Penicillin', 'Beta-lactam antibiotic used to treat a range of bacterial infections'),
      ('Ciprofloxacin', 'Fluoroquinolone', 'Broad-spectrum antibiotic effective against gram-negative bacteria'),
      ('Ceftriaxone', 'Cephalosporin', 'Third-generation cephalosporin with broad-spectrum activity'),
      ('Meropenem', 'Carbapenem', 'Broad-spectrum beta-lactam antibiotic reserved for serious infections'),
      ('Vancomycin', 'Glycopeptide', 'Used for serious gram-positive infections, including MRSA')
    ON CONFLICT DO NOTHING
    RETURNING id, name
  `);
  console.log('Antibiotics seeded:', antibioticsResult.rows);

  // Seed regions
  const regionsResult = await pool.query(`
    INSERT INTO regions (name, code, parent_id, geo_json)
    VALUES 
      ('North America', 'NA', NULL, '{"type":"Point","coordinates":[0,0]}'::jsonb),
      ('Europe', 'EU', NULL, '{"type":"Point","coordinates":[0,0]}'::jsonb),
      ('Asia', 'AS', NULL, '{"type":"Point","coordinates":[0,0]}'::jsonb),
      ('Africa', 'AF', NULL, '{"type":"Point","coordinates":[0,0]}'::jsonb)
    ON CONFLICT DO NOTHING
    RETURNING id, name
  `);
  console.log('Regions seeded:', regionsResult.rows);

  // Seed facilities - check if any regions were created first
  const checkRegionsResult = await pool.query('SELECT COUNT(*) FROM regions');
  const regionCount = parseInt(checkRegionsResult.rows[0].count);
  
  let facilitiesResult = { rows: [] };
  if (regionCount > 0) {
    facilitiesResult = await pool.query(`
      INSERT INTO facilities (name, type, region_id, address, contact_info)
      VALUES 
        ('Central Hospital', 'Hospital', 1, '123 Main St, New York', 'contact@centralhospital.org'),
        ('University Medical Center', 'Hospital', 1, '456 College Rd, Boston', 'info@universitymedical.org'),
        ('Regional Health Center', 'Clinic', 2, '789 Health Blvd, London', 'info@regionalhealthcenter.org'),
        ('Community Hospital', 'Hospital', 3, '101 Care St, Tokyo', 'info@communityhospital.org')
      ON CONFLICT DO NOTHING
      RETURNING id, name
    `);
  } else {
    console.log('Skipping facilities seed - no regions available.');
  }
  console.log('Facilities seeded:', facilitiesResult.rows);

  // Seed resources
  const resourcesResult = await pool.query(`
    INSERT INTO resources (title, type, url, description, published_at)
    VALUES 
      ('WHO Global Report on AMR Surveillance', 'document', 'https://www.who.int/publications/i/item/9789240054608', 'Comprehensive report on the global state of antimicrobial resistance', '2023-04-15'),
      ('Webinar: New Approaches to MDRO Detection', 'webinar', 'https://example.com/webinars/mdro-detection', 'Learn about the latest methods for detecting multi-drug resistant organisms', '2023-07-15'),
      ('Guide: Interpreting Antibiograms', 'guide', 'https://example.com/guides/antibiogram-interpretation', 'A comprehensive guide to understanding and interpreting antibiograms', '2023-03-10')
    ON CONFLICT DO NOTHING
    RETURNING id, title
  `);
  console.log('Resources seeded:', resourcesResult.rows);

  // Seed alerts - check if bacteria and antibiotics are available first 
  const checkDataResult = await pool.query(`
    SELECT 
      (SELECT COUNT(*) FROM bacteria) AS bacteria_count,
      (SELECT COUNT(*) FROM antibiotics) AS antibiotics_count,
      (SELECT COUNT(*) FROM regions) AS regions_count
  `);
  
  const counts = checkDataResult.rows[0];
  let alertsResult = { rows: [] };
  
  if (parseInt(counts.bacteria_count) > 0 && parseInt(counts.antibiotics_count) > 0) {
    alertsResult = await pool.query(`
      INSERT INTO alerts (title, description, severity, bacteria_id, antibiotic_id, region_id, is_active)
      VALUES 
        ('Critical: Carbapenem Resistance Surge', '300% increase in carbapenem-resistant K. pneumoniae detected in Northwest region', 'critical', 3, 4, 1, TRUE),
        ('Warning: New Resistance Mechanism', 'Novel ESBL gene variant detected in 5 facilities across the Eastern region', 'warning', 1, NULL, 2, TRUE),
        ('Pattern Change: Quinolone Resistance', 'Stable trend of ciprofloxacin resistance in E. coli after 2 years of increases', 'info', 1, 2, NULL, TRUE)
      ON CONFLICT DO NOTHING
      RETURNING id, title
    `);
  } else {
    console.log('Skipping alerts seed - either bacteria, antibiotics or regions not available.');
  }
  console.log('Alerts seeded:', alertsResult.rows);

  // Seed resistance data for the past 12 months - but only if we have the required base data
  if (parseInt(counts.bacteria_count) > 0 && 
      parseInt(counts.antibiotics_count) > 0 && 
      parseInt(counts.regions_count) > 0) {
    
    // Get actually inserted IDs for bacteria, antibiotics, regions, and facilities
    const actualBacteriaResult = await pool.query('SELECT id FROM bacteria LIMIT 10');
    const actualAntibioticResult = await pool.query('SELECT id FROM antibiotics LIMIT 10');
    const actualRegionResult = await pool.query('SELECT id FROM regions LIMIT 10');
    const actualFacilityResult = await pool.query('SELECT id FROM facilities LIMIT 10');
    
    const bacteriaIds = actualBacteriaResult.rows.map(row => row.id);
    const antibioticIds = actualAntibioticResult.rows.map(row => row.id);
    const regionIds = actualRegionResult.rows.map(row => row.id);
    const facilityIds = actualFacilityResult.rows.length > 0 ? 
      actualFacilityResult.rows.map(row => row.id) : [null];
    
    if (bacteriaIds.length > 0 && antibioticIds.length > 0 && regionIds.length > 0) {
      const today = new Date();
      
      // Generate random resistance data for a subset of combinations
      let recordsInserted = 0;
      // This is a simplified approach to avoid creating too many records
      for (const bacteriaId of bacteriaIds) {
        for (const antibioticId of antibioticIds) {
          // Only create data for a subset of combinations to reduce volume
          if ((bacteriaId + antibioticId) % 3 !== 0) continue;
          
          for (const regionId of regionIds) {
            // Skip some region combinations to reduce data volume
            if ((bacteriaId + regionId) % 2 !== 0) continue;
            
            const facilityId = facilityIds[Math.floor(Math.random() * facilityIds.length)];
            
            // Create data for last 6 months
            for (let m = 0; m < 6; m++) {
              const sampleDate = new Date(today);
              sampleDate.setMonth(today.getMonth() - m);
              
              const totalSamples = Math.floor(Math.random() * 1000) + 100;
              const resistanceRate = Math.random() * 0.8; // 0-80% resistance rate
              const resistantSamples = Math.floor(totalSamples * resistanceRate);
              
              await pool.query(`
                INSERT INTO resistance_data 
                  (bacteria_id, antibiotic_id, region_id, facility_id, sample_date, total_samples, resistant_samples)
                VALUES 
                  ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT DO NOTHING
              `, [
                bacteriaId,
                antibioticId,
                regionId,
                facilityId,
                sampleDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
                totalSamples,
                resistantSamples
              ]);
              
              recordsInserted++;
            }
          }
        }
      }
      
      console.log(`Resistance data seeded (${recordsInserted} records inserted)`);
    } else {
      console.log('Skipping resistance data seed - missing required reference data');
    }
  } else {
    console.log('Skipping resistance data seed - missing bacteria, antibiotics, or regions');
  }
}

// Run the migration
runMigration().catch(error => {
  console.error('Failed to run migration:', error);
  process.exit(1);
});