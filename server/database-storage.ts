import {
  type User, type InsertUser,
  type Bacteria, type InsertBacteria,
  type Antibiotic, type InsertAntibiotic,
  type Region, type InsertRegion,
  type Facility, type InsertFacility,
  type ResistanceData, type InsertResistanceData,
  type Resource, type InsertResource,
  type Alert, type InsertAlert,
  type ResistanceSummary, type ResistanceTrend, type AntibioticEffectiveness, 
  type FilterState,
  resources,
} from "@shared/schema";
import { desc } from "drizzle-orm";
import { IStorage } from "./storage";
import { db } from "./db";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE id = $1 LIMIT 1', 
        [id]
      );
      
      return result.rows.length > 0 ? result.rows[0] : undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE username = $1 LIMIT 1', 
        [username]
      );
      
      return result.rows.length > 0 ? result.rows[0] : undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }
  
  async createUser(user: InsertUser): Promise<User> {
    try {
      const result = await db.query(
        'INSERT INTO users (username, password_hash, email, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [user.username, user.password, user.email, user.role]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  async getBacteria(): Promise<Bacteria[]> {
    try {
      const result = await db.query('SELECT * FROM bacteria ORDER BY name');
      
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        scientificName: row.scientific_name,
        description: row.description
      }));
    } catch (error) {
      console.error('Error getting bacteria:', error);
      return [];
    }
  }
  
  async getBacteriaById(id: number): Promise<Bacteria | undefined> {
    try {
      const result = await db.query(
        'SELECT * FROM bacteria WHERE id = $1 LIMIT 1', 
        [id]
      );
      
      if (result.rows.length === 0) {
        return undefined;
      }
      
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        scientificName: row.scientific_name,
        description: row.description
      };
    } catch (error) {
      console.error('Error getting bacterium by id:', error);
      return undefined;
    }
  }
  
  async createBacteria(bacterium: InsertBacteria): Promise<Bacteria> {
    try {
      const result = await db.query(
        'INSERT INTO bacteria (name, scientific_name, description) VALUES ($1, $2, $3) RETURNING *',
        [bacterium.name, bacterium.scientificName, bacterium.description]
      );
      
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        scientificName: row.scientific_name,
        description: row.description
      };
    } catch (error) {
      console.error('Error creating bacterium:', error);
      throw error;
    }
  }
  
  async getAntibiotics(): Promise<Antibiotic[]> {
    try {
      const result = await db.query('SELECT * FROM antibiotics ORDER BY name');
      
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        class: row.class,
        description: row.description
      }));
    } catch (error) {
      console.error('Error getting antibiotics:', error);
      return [];
    }
  }
  
  async getAntibioticById(id: number): Promise<Antibiotic | undefined> {
    try {
      const result = await db.query(
        'SELECT * FROM antibiotics WHERE id = $1 LIMIT 1', 
        [id]
      );
      
      if (result.rows.length === 0) {
        return undefined;
      }
      
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        class: row.class,
        description: row.description
      };
    } catch (error) {
      console.error('Error getting antibiotic by id:', error);
      return undefined;
    }
  }
  
  async createAntibiotic(antibiotic: InsertAntibiotic): Promise<Antibiotic> {
    try {
      const result = await db.query(
        'INSERT INTO antibiotics (name, class, description) VALUES ($1, $2, $3) RETURNING *',
        [antibiotic.name, antibiotic.class, antibiotic.description]
      );
      
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        class: row.class,
        description: row.description
      };
    } catch (error) {
      console.error('Error creating antibiotic:', error);
      throw error;
    }
  }
  
  async getRegions(): Promise<Region[]> {
    try {
      const result = await db.query('SELECT * FROM regions ORDER BY name');
      
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        code: row.code,
        parentId: row.parent_id,
        population: row.population
      }));
    } catch (error) {
      console.error('Error getting regions:', error);
      return [];
    }
  }
  
  async getRegionById(id: number): Promise<Region | undefined> {
    try {
      const result = await db.query(
        'SELECT * FROM regions WHERE id = $1 LIMIT 1', 
        [id]
      );
      
      if (result.rows.length === 0) {
        return undefined;
      }
      
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        code: row.code,
        parentId: row.parent_id,
        population: row.population
      };
    } catch (error) {
      console.error('Error getting region by id:', error);
      return undefined;
    }
  }
  
  async createRegion(region: InsertRegion): Promise<Region> {
    try {
      const result = await db.query(
        'INSERT INTO regions (name, code, parent_id, population) VALUES ($1, $2, $3, $4) RETURNING *',
        [region.name, region.code, region.parentId, region.population]
      );
      
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        code: row.code,
        parentId: row.parent_id,
        population: row.population
      };
    } catch (error) {
      console.error('Error creating region:', error);
      throw error;
    }
  }
  
  async getFacilities(): Promise<Facility[]> {
    try {
      const result = await db.query('SELECT * FROM facilities ORDER BY name');
      
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        type: row.type,
        regionId: row.region_id,
        location: row.location
      }));
    } catch (error) {
      console.error('Error getting facilities:', error);
      return [];
    }
  }
  
  async getFacilitiesByRegion(regionId: number): Promise<Facility[]> {
    try {
      const result = await db.query(
        'SELECT * FROM facilities WHERE region_id = $1 ORDER BY name',
        [regionId]
      );
      
      return result.rows.map(row => ({
        id: row.id,
        name: row.name,
        type: row.type,
        regionId: row.region_id,
        location: row.location
      }));
    } catch (error) {
      console.error('Error getting facilities by region:', error);
      return [];
    }
  }
  
  async createFacility(facility: InsertFacility): Promise<Facility> {
    try {
      const result = await db.query(
        'INSERT INTO facilities (name, type, region_id, location) VALUES ($1, $2, $3, $4) RETURNING *',
        [facility.name, facility.type, facility.regionId, facility.location]
      );
      
      const row = result.rows[0];
      return {
        id: row.id,
        name: row.name,
        type: row.type,
        regionId: row.region_id,
        location: row.location
      };
    } catch (error) {
      console.error('Error creating facility:', error);
      throw error;
    }
  }
  
  async getResistanceData(filters?: Partial<FilterState>): Promise<ResistanceData[]> {
    try {
      let query = 'SELECT * FROM resistance_data';
      const params: any[] = [];
      
      if (filters) {
        const conditions: string[] = [];
        
        if (filters.bacteriaId) {
          conditions.push(`bacteria_id = $${params.length + 1}`);
          params.push(filters.bacteriaId);
        }
        
        if (filters.antibioticId) {
          conditions.push(`antibiotic_id = $${params.length + 1}`);
          params.push(filters.antibioticId);
        }
        
        if (filters.regionId) {
          conditions.push(`region_id = $${params.length + 1}`);
          params.push(filters.regionId);
        }
        
        if (filters.fromDate && filters.toDate) {
          conditions.push(`sample_date >= $${params.length + 1} AND sample_date <= $${params.length + 2}`);
          params.push(filters.fromDate);
          params.push(filters.toDate);
        }
        
        if (conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ');
        }
      }
      
      query += ' ORDER BY sample_date DESC';
      
      const result = await db.query(query, params);
      
      return result.rows.map(row => ({
        id: row.id,
        bacteriaId: row.bacteria_id,
        antibioticId: row.antibiotic_id,
        regionId: row.region_id,
        facilityId: row.facility_id,
        sampleDate: row.sample_date,
        totalSamples: row.total_samples,
        resistantSamples: row.resistant_samples
      }));
    } catch (error) {
      console.error('Error getting resistance data:', error);
      return [];
    }
  }
  
  async createResistanceData(data: InsertResistanceData): Promise<ResistanceData> {
    try {
      const result = await db.query(
        `INSERT INTO resistance_data 
         (bacteria_id, antibiotic_id, region_id, facility_id, sample_date, total_samples, resistant_samples) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          data.bacteriaId, 
          data.antibioticId, 
          data.regionId, 
          data.facilityId, 
          data.sampleDate,
          data.totalSamples, 
          data.resistantSamples
        ]
      );
      
      const row = result.rows[0];
      return {
        id: row.id,
        bacteriaId: row.bacteria_id,
        antibioticId: row.antibiotic_id,
        regionId: row.region_id,
        facilityId: row.facility_id,
        sampleDate: row.sample_date,
        totalSamples: row.total_samples,
        resistantSamples: row.resistant_samples
      };
    } catch (error) {
      console.error('Error creating resistance data:', error);
      throw error;
    }
  }
  
  async bulkCreateResistanceData(dataArray: InsertResistanceData[]): Promise<ResistanceData[]> {
    try {
      // This would be better with a batch insert, but for simplicity we'll use multiple inserts
      const result: ResistanceData[] = [];
      
      for (const data of dataArray) {
        const createdData = await this.createResistanceData(data);
        result.push(createdData);
      }
      
      return result;
    } catch (error) {
      console.error('Error bulk creating resistance data:', error);
      throw error;
    }
  }
  
  async getResources(): Promise<Resource[]> {
    try {
      const result = await db.select().from(resources).orderBy(desc(resources.publishedAt));
      
      return result;
    } catch (error) {
      console.error('Error getting resources:', error);
      return [];
    }
  }
  
  async getResourceById(id: number): Promise<Resource | undefined> {
    try {
      const result = await db.query(
        'SELECT * FROM resources WHERE id = $1 LIMIT 1', 
        [id]
      );
      
      if (result.rows.length === 0) {
        return undefined;
      }
      
      const row = result.rows[0];
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        url: row.url,
        type: row.type,
        publishedAt: row.published_at,
        authoredBy: row.authored_by
      };
    } catch (error) {
      console.error('Error getting resource by id:', error);
      return undefined;
    }
  }
  
  async createResource(resource: InsertResource): Promise<Resource> {
    try {
      const result = await db.query(
        `INSERT INTO resources 
         (title, description, url, type, published_at, authored_by) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          resource.title, 
          resource.description, 
          resource.url, 
          resource.type, 
          resource.publishedAt,
          resource.authoredBy
        ]
      );
      
      const row = result.rows[0];
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        url: row.url,
        type: row.type,
        publishedAt: row.published_at,
        authoredBy: row.authored_by
      };
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  }
  
  async getAlerts(active?: boolean): Promise<Alert[]> {
    try {
      let query = 'SELECT * FROM alerts';
      const params: any[] = [];
      
      if (active !== undefined) {
        query += ' WHERE active = $1';
        params.push(active);
      }
      
      query += ' ORDER BY created_at DESC';
      
      const result = await db.query(query, params);
      
      return result.rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        severity: row.severity,
        active: row.active,
        createdAt: row.created_at
      }));
    } catch (error) {
      console.error('Error getting alerts:', error);
      return [];
    }
  }
  
  async createAlert(alert: InsertAlert): Promise<Alert> {
    try {
      const result = await db.query(
        `INSERT INTO alerts 
         (title, description, severity, active) 
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [alert.title, alert.description, alert.severity, alert.active]
      );
      
      const row = result.rows[0];
      return {
        id: row.id,
        title: row.title,
        description: row.description,
        severity: row.severity,
        active: row.active,
        createdAt: row.created_at
      };
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }
  
  async getResistanceSummary(filters?: Partial<FilterState>): Promise<ResistanceSummary> {
    try {
      let query = `
        SELECT 
          SUM(total_samples) as total_samples,
          SUM(resistant_samples) as resistant_samples,
          COUNT(DISTINCT facility_id) as participating_facilities
        FROM resistance_data
      `;
      
      const params: any[] = [];
      
      if (filters) {
        const conditions: string[] = [];
        
        if (filters.bacteriaId) {
          conditions.push(`bacteria_id = $${params.length + 1}`);
          params.push(filters.bacteriaId);
        }
        
        if (filters.antibioticId) {
          conditions.push(`antibiotic_id = $${params.length + 1}`);
          params.push(filters.antibioticId);
        }
        
        if (filters.regionId) {
          conditions.push(`region_id = $${params.length + 1}`);
          params.push(filters.regionId);
        }
        
        if (filters.fromDate && filters.toDate) {
          conditions.push(`sample_date >= $${params.length + 1} AND sample_date <= $${params.length + 2}`);
          params.push(filters.fromDate);
          params.push(filters.toDate);
        }
        
        if (conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ');
        }
      }
      
      const result = await db.query(query, params);
      
      if (!result.rows[0] || result.rows[0].total_samples === null) {
        return {
          totalSamples: 0,
          resistantIsolates: 0,
          resistanceRate: 0,
          participatingFacilities: 0
        };
      }
      
      const row = result.rows[0];
      const totalSamples = parseInt(row.total_samples);
      const resistantIsolates = parseInt(row.resistant_samples);
      
      return {
        totalSamples,
        resistantIsolates,
        resistanceRate: totalSamples > 0 ? resistantIsolates / totalSamples : 0,
        participatingFacilities: parseInt(row.participating_facilities)
      };
    } catch (error) {
      console.error('Error getting resistance summary:', error);
      return {
        totalSamples: 0,
        resistantIsolates: 0,
        resistanceRate: 0,
        participatingFacilities: 0
      };
    }
  }
  
  async getResistanceTrends(filters?: Partial<FilterState>): Promise<ResistanceTrend[]> {
    try {
      let query = `
        SELECT 
          TO_CHAR(sample_date, 'YYYY-MM') as month,
          bacteria_id,
          SUM(total_samples) as total_samples,
          SUM(resistant_samples) as resistant_samples
        FROM resistance_data
      `;
      
      const params: any[] = [];
      
      if (filters) {
        const conditions: string[] = [];
        
        if (filters.bacteriaId) {
          conditions.push(`bacteria_id = $${params.length + 1}`);
          params.push(filters.bacteriaId);
        }
        
        if (filters.antibioticId) {
          conditions.push(`antibiotic_id = $${params.length + 1}`);
          params.push(filters.antibioticId);
        }
        
        if (filters.regionId) {
          conditions.push(`region_id = $${params.length + 1}`);
          params.push(filters.regionId);
        }
        
        if (filters.fromDate && filters.toDate) {
          conditions.push(`sample_date >= $${params.length + 1} AND sample_date <= $${params.length + 2}`);
          params.push(filters.fromDate);
          params.push(filters.toDate);
        }
        
        if (conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ');
        }
      }
      
      query += ' GROUP BY month, bacteria_id ORDER BY month';
      
      const result = await db.query(query, params);
      
      // Get bacteria names
      const bacteriaMap = new Map<number, string>();
      const bacteriaResult = await this.getBacteria();
      
      for (const bacterium of bacteriaResult) {
        bacteriaMap.set(bacterium.id, bacterium.name);
      }
      
      // Create trends
      return result.rows.map(row => ({
        month: row.month,
        bacteriaId: row.bacteria_id,
        bacteriaName: bacteriaMap.get(row.bacteria_id) || `Bacteria ${row.bacteria_id}`,
        resistanceRate: parseInt(row.resistant_samples) / parseInt(row.total_samples)
      }));
    } catch (error) {
      console.error('Error getting resistance trends:', error);
      return [];
    }
  }
  
  async getAntibioticEffectiveness(filters?: Partial<FilterState>): Promise<AntibioticEffectiveness[]> {
    try {
      let query = `
        SELECT 
          a.id,
          a.name,
          SUM(rd.total_samples) as total_samples,
          SUM(rd.resistant_samples) as resistant_samples,
          ARRAY_AGG(DISTINCT r.name) as regions
        FROM resistance_data rd
        JOIN antibiotics a ON rd.antibiotic_id = a.id
        JOIN regions r ON rd.region_id = r.id
      `;
      
      const params: any[] = [];
      
      if (filters) {
        const conditions: string[] = [];
        
        if (filters.bacteriaId) {
          conditions.push(`rd.bacteria_id = $${params.length + 1}`);
          params.push(filters.bacteriaId);
        }
        
        if (filters.antibioticId) {
          conditions.push(`rd.antibiotic_id = $${params.length + 1}`);
          params.push(filters.antibioticId);
        }
        
        if (filters.regionId) {
          conditions.push(`rd.region_id = $${params.length + 1}`);
          params.push(filters.regionId);
        }
        
        if (filters.fromDate && filters.toDate) {
          conditions.push(`rd.sample_date >= $${params.length + 1} AND rd.sample_date <= $${params.length + 2}`);
          params.push(filters.fromDate);
          params.push(filters.toDate);
        }
        
        if (conditions.length > 0) {
          query += ' WHERE ' + conditions.join(' AND ');
        }
      }
      
      query += ' GROUP BY a.id, a.name';
      
      const result = await db.query(query, params);
      
      return result.rows.map(row => {
        const totalSamples = parseInt(row.total_samples);
        const resistantSamples = parseInt(row.resistant_samples);
        // Calculate effectiveness as (1 - resistance rate)
        const effectiveness = 1 - (resistantSamples / totalSamples);
        
        return {
          id: row.id,
          name: row.name,
          effectiveness,
          regions: row.regions
        };
      }).sort((a, b) => b.effectiveness - a.effectiveness);
    } catch (error) {
      console.error('Error getting antibiotic effectiveness:', error);
      return [];
    }
  }
}