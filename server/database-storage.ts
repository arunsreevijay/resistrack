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
  users, bacteria, antibiotics, regions, facilities, resistanceData, resources, alerts,
} from "@shared/schema";
import { eq, desc, and, gte, lte } from "drizzle-orm";
import { IStorage } from "./storage";
import { db } from "./db";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }
  
  async createUser(user: InsertUser): Promise<User> {
    try {
      const result = await db.insert(users).values(user).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  async getBacteria(): Promise<Bacteria[]> {
    try {
      const result = await db.select().from(bacteria);
      return result;
    } catch (error) {
      console.error('Error getting bacteria:', error);
      return [];
    }
  }
  
  async getBacteriaById(id: number): Promise<Bacteria | undefined> {
    try {
      const result = await db.select().from(bacteria).where(eq(bacteria.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting bacterium by id:', error);
      return undefined;
    }
  }
  
  async createBacteria(bacterium: InsertBacteria): Promise<Bacteria> {
    try {
      const result = await db.insert(bacteria).values(bacterium).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating bacterium:', error);
      throw error;
    }
  }
  
  async getAntibiotics(): Promise<Antibiotic[]> {
    try {
      const result = await db.select().from(antibiotics);
      return result;
    } catch (error) {
      console.error('Error getting antibiotics:', error);
      return [];
    }
  }
  
  async getAntibioticById(id: number): Promise<Antibiotic | undefined> {
    try {
      const result = await db.select().from(antibiotics).where(eq(antibiotics.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting antibiotic by id:', error);
      return undefined;
    }
  }
  
  async createAntibiotic(antibiotic: InsertAntibiotic): Promise<Antibiotic> {
    try {
      const result = await db.insert(antibiotics).values(antibiotic).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating antibiotic:', error);
      throw error;
    }
  }
  
  async getRegions(): Promise<Region[]> {
    try {
      const result = await db.select().from(regions);
      return result;
    } catch (error) {
      console.error('Error getting regions:', error);
      return [];
    }
  }
  
  async getRegionById(id: number): Promise<Region | undefined> {
    try {
      const result = await db.select().from(regions).where(eq(regions.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting region by id:', error);
      return undefined;
    }
  }
  
  async createRegion(region: InsertRegion): Promise<Region> {
    try {
      const result = await db.insert(regions).values(region).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating region:', error);
      throw error;
    }
  }
  
  async getFacilities(): Promise<Facility[]> {
    try {
      const result = await db.select().from(facilities);
      return result;
    } catch (error) {
      console.error('Error getting facilities:', error);
      return [];
    }
  }
  
  async getFacilitiesByRegion(regionId: number): Promise<Facility[]> {
    try {
      const result = await db.select().from(facilities).where(eq(facilities.regionId, regionId));
      return result;
    } catch (error) {
      console.error('Error getting facilities by region:', error);
      return [];
    }
  }
  
  async createFacility(facility: InsertFacility): Promise<Facility> {
    try {
      const result = await db.insert(facilities).values(facility).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating facility:', error);
      throw error;
    }
  }
  
  async getResistanceData(filters?: Partial<FilterState>): Promise<ResistanceData[]> {
    try {
      let query = db.select().from(resistanceData);
      
      if (filters) {
        const conditions = [];
        
        if (filters.bacteriaId) {
          conditions.push(eq(resistanceData.bacteriaId, filters.bacteriaId));
        }
        
        if (filters.antibioticId) {
          conditions.push(eq(resistanceData.antibioticId, filters.antibioticId));
        }
        
        if (filters.regionId) {
          conditions.push(eq(resistanceData.regionId, filters.regionId));
        }
        
        if (filters.fromDate && filters.toDate) {
          conditions.push(and(
            gte(resistanceData.sampleDate, filters.fromDate),
            lte(resistanceData.sampleDate, filters.toDate)
          ));
        }
        
        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }
      }
      
      const result = await query.orderBy(desc(resistanceData.sampleDate));
      return result;
    } catch (error) {
      console.error('Error getting resistance data:', error);
      return [];
    }
  }
  
  async createResistanceData(data: InsertResistanceData): Promise<ResistanceData> {
    try {
      const result = await db.insert(resistanceData).values(data).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating resistance data:', error);
      throw error;
    }
  }
  
  async bulkCreateResistanceData(dataArray: InsertResistanceData[]): Promise<ResistanceData[]> {
    try {
      const result = await db.insert(resistanceData).values(dataArray).returning();
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
      const result = await db.select().from(resources).where(eq(resources.id, id)).limit(1);
      return result[0] || undefined;
    } catch (error) {
      console.error('Error getting resource by id:', error);
      return undefined;
    }
  }
  
  async createResource(resource: InsertResource): Promise<Resource> {
    try {
      const result = await db.insert(resources).values(resource).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  }
  
  async getAlerts(active?: boolean): Promise<Alert[]> {
    try {
      let query = db.select().from(alerts);
      
      if (active !== undefined) {
        query = query.where(eq(alerts.active, active));
      }
      
      const result = await query.orderBy(desc(alerts.createdAt));
      return result;
    } catch (error) {
      console.error('Error getting alerts:', error);
      return [];
    }
  }
  
  async createAlert(alert: InsertAlert): Promise<Alert> {
    try {
      const result = await db.insert(alerts).values(alert).returning();
      return result[0];
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }
  
  async getResistanceSummary(filters?: Partial<FilterState>): Promise<ResistanceSummary> {
    try {
      const data = await this.getResistanceData(filters);
      
      let totalSamples = 0;
      let resistantIsolates = 0;
      
      // Count distinct facilities
      const distinctFacilities = new Set<number>();
      
      for (const item of data) {
        totalSamples += item.totalSamples;
        resistantIsolates += item.resistantSamples;
        if (item.facilityId) {
          distinctFacilities.add(item.facilityId);
        }
      }
      
      const resistanceRate = totalSamples > 0 ? resistantIsolates / totalSamples : 0;

      return {
        totalSamples,
        resistantIsolates,
        resistanceRate,
        participatingFacilities: distinctFacilities.size
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
      const data = await this.getResistanceData(filters);
      const bacteriaList = await this.getBacteria();
      
      // Group data by month and bacteria
      const groupedData = new Map<string, Map<number, { total: number, resistant: number }>>();
      
      for (const item of data) {
        const date = new Date(item.sampleDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!groupedData.has(monthKey)) {
          groupedData.set(monthKey, new Map());
        }
        
        const bacteriaMap = groupedData.get(monthKey)!;
        
        if (!bacteriaMap.has(item.bacteriaId)) {
          bacteriaMap.set(item.bacteriaId, { total: 0, resistant: 0 });
        }
        
        const stats = bacteriaMap.get(item.bacteriaId)!;
        stats.total += item.totalSamples;
        stats.resistant += item.resistantSamples;
      }
      
      // Convert to array of trends
      const trends: ResistanceTrend[] = [];
      
      const sortedMonths = Array.from(groupedData.keys()).sort();
      
      for (const month of sortedMonths) {
        const bacteriaMap = groupedData.get(month)!;
        
        for (const [bacteriaId, stats] of bacteriaMap.entries()) {
          const bacteria = bacteriaList.find(b => b.id === bacteriaId);
          
          if (bacteria) {
            const resistanceRate = stats.total > 0 ? (stats.resistant / stats.total) : 0;
            
            trends.push({
              month,
              bacteriaId,
              bacteriaName: bacteria.name,
              resistanceRate,
            });
          }
        }
      }
      
      return trends;
    } catch (error) {
      console.error('Error getting resistance trends:', error);
      return [];
    }
  }
  
  async getAntibioticEffectiveness(filters?: Partial<FilterState>): Promise<AntibioticEffectiveness[]> {
    try {
      const data = await this.getResistanceData(filters);
      const antibioticsList = await this.getAntibiotics();
      const regionsList = await this.getRegions();
      
      // Group data by antibiotic
      const antibioticStats = new Map<number, { total: number, resistant: number, regions: Set<number> }>();
      
      for (const item of data) {
        if (!antibioticStats.has(item.antibioticId)) {
          antibioticStats.set(item.antibioticId, { total: 0, resistant: 0, regions: new Set() });
        }
        
        const stats = antibioticStats.get(item.antibioticId)!;
        stats.total += item.totalSamples;
        stats.resistant += item.resistantSamples;
        stats.regions.add(item.regionId);
      }
      
      // Convert to array of effectiveness
      const effectiveness: AntibioticEffectiveness[] = [];
      
      for (const [antibioticId, stats] of antibioticStats.entries()) {
        const antibiotic = antibioticsList.find(a => a.id === antibioticId);
        
        if (antibiotic) {
          const effectivenessRate = stats.total > 0 ? (1 - (stats.resistant / stats.total)) : 0;
          
          const regionNames = Array.from(stats.regions).map(regionId => {
            const region = regionsList.find(r => r.id === regionId);
            return region ? region.name : "Unknown";
          });
          
          effectiveness.push({
            id: antibioticId,
            name: antibiotic.name,
            effectiveness: effectivenessRate,
            regions: regionNames,
          });
        }
      }
      
      // Sort by effectiveness (descending)
      effectiveness.sort((a, b) => b.effectiveness - a.effectiveness);
      
      return effectiveness;
    } catch (error) {
      console.error('Error getting antibiotic effectiveness:', error);
      return [];
    }
  }
}