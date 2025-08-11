import {
  users, bacteria, antibiotics, regions, facilities,
  resistanceData, resources, alerts,
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
} from "@shared/schema";
import { db } from "./db";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Bacteria methods
  getBacteria(): Promise<Bacteria[]>;
  getBacteriaById(id: number): Promise<Bacteria | undefined>;
  createBacteria(bacteria: InsertBacteria): Promise<Bacteria>;
  
  // Antibiotic methods
  getAntibiotics(): Promise<Antibiotic[]>;
  getAntibioticById(id: number): Promise<Antibiotic | undefined>;
  createAntibiotic(antibiotic: InsertAntibiotic): Promise<Antibiotic>;
  
  // Region methods
  getRegions(): Promise<Region[]>;
  getRegionById(id: number): Promise<Region | undefined>;
  createRegion(region: InsertRegion): Promise<Region>;
  
  // Facility methods
  getFacilities(): Promise<Facility[]>;
  getFacilitiesByRegion(regionId: number): Promise<Facility[]>;
  createFacility(facility: InsertFacility): Promise<Facility>;
  
  // Resistance data methods
  getResistanceData(filters?: Partial<FilterState>): Promise<ResistanceData[]>;
  createResistanceData(data: InsertResistanceData): Promise<ResistanceData>;
  bulkCreateResistanceData(dataArray: InsertResistanceData[]): Promise<ResistanceData[]>;
  
  // Resource methods
  getResources(): Promise<Resource[]>;
  getResourceById(id: number): Promise<Resource | undefined>;
  createResource(resource: InsertResource): Promise<Resource>;
  
  // Alert methods
  getAlerts(active?: boolean): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  
  // Dashboard summary methods
  getResistanceSummary(filters?: Partial<FilterState>): Promise<ResistanceSummary>;
  getResistanceTrends(filters?: Partial<FilterState>): Promise<ResistanceTrend[]>;
  getAntibioticEffectiveness(filters?: Partial<FilterState>): Promise<AntibioticEffectiveness[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private bacteria: Map<number, Bacteria>;
  private antibiotics: Map<number, Antibiotic>;
  private regions: Map<number, Region>;
  private facilities: Map<number, Facility>;
  private resistanceData: Map<number, ResistanceData>;
  private resources: Map<number, Resource>;
  private alerts: Map<number, Alert>;

  private userId: number;
  private bacteriaId: number;
  private antibioticId: number;
  private regionId: number;
  private facilityId: number;
  private resistanceDataId: number;
  private resourceId: number;
  private alertId: number;

  constructor() {
    // Initialize maps
    this.users = new Map();
    this.bacteria = new Map();
    this.antibiotics = new Map();
    this.regions = new Map();
    this.facilities = new Map();
    this.resistanceData = new Map();
    this.resources = new Map();
    this.alerts = new Map();

    // Initialize auto-increment IDs
    this.userId = 1;
    this.bacteriaId = 1;
    this.antibioticId = 1;
    this.regionId = 1;
    this.facilityId = 1;
    this.resistanceDataId = 1;
    this.resourceId = 1;
    this.alertId = 1;

    // Seed initial data
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed bacteria
    const bacteriaList: InsertBacteria[] = [
      { name: "E. coli", scientificName: "Escherichia coli", description: "Common gram-negative bacteria found in the intestines" },
      { name: "S. aureus", scientificName: "Staphylococcus aureus", description: "Gram-positive bacteria commonly found on the skin" },
      { name: "K. pneumoniae", scientificName: "Klebsiella pneumoniae", description: "Gram-negative bacteria that can cause pneumonia and other infections" },
      { name: "P. aeruginosa", scientificName: "Pseudomonas aeruginosa", description: "Gram-negative bacteria associated with hospital-acquired infections" }
    ];
    
    bacteriaList.forEach(b => this.createBacteria(b));

    // Seed antibiotics
    const antibioticList: InsertAntibiotic[] = [
      { name: "Amoxicillin", class: "Penicillin", description: "Beta-lactam antibiotic used to treat a range of bacterial infections" },
      { name: "Ciprofloxacin", class: "Fluoroquinolone", description: "Broad-spectrum antibiotic effective against gram-negative bacteria" },
      { name: "Ceftriaxone", class: "Cephalosporin", description: "Third-generation cephalosporin with broad-spectrum activity" },
      { name: "Meropenem", class: "Carbapenem", description: "Broad-spectrum beta-lactam antibiotic reserved for serious infections" },
      { name: "Vancomycin", class: "Glycopeptide", description: "Used for serious gram-positive infections, including MRSA" }
    ];
    
    antibioticList.forEach(a => this.createAntibiotic(a));

    // Seed regions
    const regionList: InsertRegion[] = [
      { name: "North America", code: "NA", parentId: null, geoJson: null },
      { name: "Europe", code: "EU", parentId: null, geoJson: null },
      { name: "Asia", code: "AS", parentId: null, geoJson: null },
      { name: "Africa", code: "AF", parentId: null, geoJson: null }
    ];
    
    regionList.forEach(r => this.createRegion(r));

    // Seed some facilities
    const facilityList: InsertFacility[] = [
      { name: "Central Hospital", type: "Hospital", regionId: 1, address: "123 Main St, New York", contactInfo: "contact@centralhospital.org" },
      { name: "University Medical Center", type: "Hospital", regionId: 1, address: "456 College Rd, Boston", contactInfo: "info@universitymedical.org" },
      { name: "Regional Health Center", type: "Clinic", regionId: 2, address: "789 Health Blvd, London", contactInfo: "info@regionalhealthcenter.org" },
      { name: "Community Hospital", type: "Hospital", regionId: 3, address: "101 Care St, Tokyo", contactInfo: "info@communityhospital.org" }
    ];
    
    facilityList.forEach(f => this.createFacility(f));

    // Seed some resources
    const resourceList: InsertResource[] = [
      { 
        title: "WHO Global Report on AMR Surveillance", 
        type: "document", 
        url: "https://www.who.int/publications/i/item/9789240054608", 
        description: "Comprehensive report on the global state of antimicrobial resistance", 
        publishedAt: new Date("2023-04-15"), 
        addedById: null 
      },
      { 
        title: "Webinar: New Approaches to MDRO Detection", 
        type: "webinar", 
        url: "https://example.com/webinars/mdro-detection", 
        description: "Learn about the latest methods for detecting multi-drug resistant organisms", 
        publishedAt: new Date("2023-07-15"), 
        addedById: null 
      },
      { 
        title: "Guide: Interpreting Antibiograms", 
        type: "guide", 
        url: "https://example.com/guides/antibiogram-interpretation", 
        description: "A comprehensive guide to understanding and interpreting antibiograms", 
        publishedAt: new Date("2023-03-10"), 
        addedById: null 
      }
    ];
    
    resourceList.forEach(r => this.createResource(r));

    // Seed some alerts
    const alertList: InsertAlert[] = [
      { 
        title: "Critical: Carbapenem Resistance Surge", 
        description: "300% increase in carbapenem-resistant K. pneumoniae detected in Northwest region", 
        severity: "critical", 
        bacteriaId: 3, 
        antibioticId: 4, 
        regionId: 1, 
        isActive: true 
      },
      { 
        title: "Warning: New Resistance Mechanism", 
        description: "Novel ESBL gene variant detected in 5 facilities across the Eastern region", 
        severity: "warning", 
        bacteriaId: 1, 
        antibioticId: null, 
        regionId: 2, 
        isActive: true 
      },
      { 
        title: "Pattern Change: Quinolone Resistance", 
        description: "Stable trend of ciprofloxacin resistance in E. coli after 2 years of increases", 
        severity: "info", 
        bacteriaId: 1, 
        antibioticId: 2, 
        regionId: null, 
        isActive: true 
      }
    ];
    
    alertList.forEach(a => this.createAlert(a));

    // Seed resistance data for the past 12 months
    const today = new Date();
    const bacteriaIds = [1, 2, 3, 4];
    const antibioticIds = [1, 2, 3, 4, 5];
    const regionIds = [1, 2, 3, 4];
    const facilityIds = [1, 2, 3, 4];

    // Generate random resistance data for the past 12 months
    for (let m = 0; m < 12; m++) {
      const sampleDate = new Date(today);
      sampleDate.setMonth(today.getMonth() - m);
      
      for (const bacteriaId of bacteriaIds) {
        for (const antibioticId of antibioticIds) {
          for (const regionId of regionIds) {
            const totalSamples = Math.floor(Math.random() * 1000) + 100;
            const resistanceRate = Math.random() * 0.8; // 0-80% resistance rate
            const resistantSamples = Math.floor(totalSamples * resistanceRate);
            
            const resistanceDataEntry: InsertResistanceData = {
              bacteriaId,
              antibioticId,
              regionId,
              facilityId: facilityIds[Math.floor(Math.random() * facilityIds.length)],
              sampleDate,
              totalSamples,
              resistantSamples,
              uploadedById: null,
              notes: null
            };
            
            this.createResistanceData(resistanceDataEntry);
          }
        }
      }
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const now = new Date();
    const user = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  // Bacteria methods
  async getBacteria(): Promise<Bacteria[]> {
    return Array.from(this.bacteria.values());
  }

  async getBacteriaById(id: number): Promise<Bacteria | undefined> {
    return this.bacteria.get(id);
  }

  async createBacteria(insertBacteria: InsertBacteria): Promise<Bacteria> {
    const id = this.bacteriaId++;
    const bacteria = { ...insertBacteria, id };
    this.bacteria.set(id, bacteria);
    return bacteria;
  }

  // Antibiotic methods
  async getAntibiotics(): Promise<Antibiotic[]> {
    return Array.from(this.antibiotics.values());
  }

  async getAntibioticById(id: number): Promise<Antibiotic | undefined> {
    return this.antibiotics.get(id);
  }

  async createAntibiotic(insertAntibiotic: InsertAntibiotic): Promise<Antibiotic> {
    const id = this.antibioticId++;
    const antibiotic = { ...insertAntibiotic, id };
    this.antibiotics.set(id, antibiotic);
    return antibiotic;
  }

  // Region methods
  async getRegions(): Promise<Region[]> {
    return Array.from(this.regions.values());
  }

  async getRegionById(id: number): Promise<Region | undefined> {
    return this.regions.get(id);
  }

  async createRegion(insertRegion: InsertRegion): Promise<Region> {
    const id = this.regionId++;
    const region = { ...insertRegion, id };
    this.regions.set(id, region);
    return region;
  }

  // Facility methods
  async getFacilities(): Promise<Facility[]> {
    return Array.from(this.facilities.values());
  }

  async getFacilitiesByRegion(regionId: number): Promise<Facility[]> {
    return Array.from(this.facilities.values()).filter(
      facility => facility.regionId === regionId
    );
  }

  async createFacility(insertFacility: InsertFacility): Promise<Facility> {
    const id = this.facilityId++;
    const facility = { ...insertFacility, id };
    this.facilities.set(id, facility);
    return facility;
  }

  // Resistance data methods
  async getResistanceData(filters?: Partial<FilterState>): Promise<ResistanceData[]> {
    let data = Array.from(this.resistanceData.values());

    if (filters) {
      if (filters.bacteriaId) {
        data = data.filter(d => d.bacteriaId === filters.bacteriaId);
      }
      if (filters.antibioticId) {
        data = data.filter(d => d.antibioticId === filters.antibioticId);
      }
      if (filters.regionId) {
        data = data.filter(d => d.regionId === filters.regionId);
      }
      if (filters.fromDate) {
        data = data.filter(d => new Date(d.sampleDate) >= filters.fromDate!);
      }
      if (filters.toDate) {
        data = data.filter(d => new Date(d.sampleDate) <= filters.toDate!);
      }
      if (filters.timePeriod) {
        const today = new Date();
        let fromDate = new Date(today);
        
        switch (filters.timePeriod) {
          case '3m':
            fromDate.setMonth(today.getMonth() - 3);
            break;
          case '6m':
            fromDate.setMonth(today.getMonth() - 6);
            break;
          case '12m':
            fromDate.setMonth(today.getMonth() - 12);
            break;
          case '2y':
            fromDate.setFullYear(today.getFullYear() - 2);
            break;
          case '5y':
            fromDate.setFullYear(today.getFullYear() - 5);
            break;
        }
        
        data = data.filter(d => new Date(d.sampleDate) >= fromDate);
      }
    }

    return data;
  }

  async createResistanceData(insertData: InsertResistanceData): Promise<ResistanceData> {
    const id = this.resistanceDataId++;
    const now = new Date();
    const data = { ...insertData, id, uploadedAt: now };
    this.resistanceData.set(id, data);
    return data;
  }

  async bulkCreateResistanceData(dataArray: InsertResistanceData[]): Promise<ResistanceData[]> {
    return Promise.all(dataArray.map(data => this.createResistanceData(data)));
  }

  // Resource methods
  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values())
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
  }

  async getResourceById(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.resourceId++;
    const resource = { ...insertResource, id };
    this.resources.set(id, resource);
    return resource;
  }

  // Alert methods
  async getAlerts(active?: boolean): Promise<Alert[]> {
    let alerts = Array.from(this.alerts.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    if (active !== undefined) {
      alerts = alerts.filter(alert => alert.isActive === active);
    }

    return alerts;
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = this.alertId++;
    const now = new Date();
    const alert = { ...insertAlert, id, createdAt: now };
    this.alerts.set(id, alert);
    return alert;
  }

  // Dashboard summary methods
  async getResistanceSummary(filters?: Partial<FilterState>): Promise<ResistanceSummary> {
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
    
    const resistanceRate = totalSamples > 0 ? (resistantIsolates / totalSamples) * 100 : 0;

    return {
      totalSamples,
      resistantIsolates,
      resistanceRate,
      participatingFacilities: distinctFacilities.size
    };
  }

  async getResistanceTrends(filters?: Partial<FilterState>): Promise<ResistanceTrend[]> {
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
          const resistanceRate = stats.total > 0 ? (stats.resistant / stats.total) * 100 : 0;
          
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
  }

  async getAntibioticEffectiveness(filters?: Partial<FilterState>): Promise<AntibioticEffectiveness[]> {
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
        const effectivenessRate = stats.total > 0 ? ((stats.total - stats.resistant) / stats.total) * 100 : 0;
        
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
  }
}

import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { eq, and, gte, lte, desc, sql } from 'drizzle-orm';

const { Pool } = pg;

// Database configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export class DbStorage implements IStorage {
  private db;

  constructor() {
    this.db = drizzle(pool);
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id));
    return result[0] || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0] || undefined;
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await this.db.insert(users).values(user).returning();
    return result[0];
  }

  // Bacteria methods
  async getBacteria(): Promise<Bacteria[]> {
    return await this.db.select().from(bacteria);
  }

  async getBacteriaById(id: number): Promise<Bacteria | undefined> {
    const result = await this.db.select().from(bacteria).where(eq(bacteria.id, id));
    return result[0] || undefined;
  }

  async createBacteria(bacterium: InsertBacteria): Promise<Bacteria> {
    const result = await this.db.insert(bacteria).values(bacterium).returning();
    return result[0];
  }

  // Antibiotic methods
  async getAntibiotics(): Promise<Antibiotic[]> {
    return await this.db.select().from(antibiotics);
  }

  async getAntibioticById(id: number): Promise<Antibiotic | undefined> {
    const result = await this.db.select().from(antibiotics).where(eq(antibiotics.id, id));
    return result[0] || undefined;
  }

  async createAntibiotic(antibiotic: InsertAntibiotic): Promise<Antibiotic> {
    const result = await this.db.insert(antibiotics).values(antibiotic).returning();
    return result[0];
  }

  // Region methods
  async getRegions(): Promise<Region[]> {
    return await this.db.select().from(regions);
  }

  async getRegionById(id: number): Promise<Region | undefined> {
    const result = await this.db.select().from(regions).where(eq(regions.id, id));
    return result[0] || undefined;
  }

  async createRegion(region: InsertRegion): Promise<Region> {
    const result = await this.db.insert(regions).values(region).returning();
    return result[0];
  }

  // Facility methods
  async getFacilities(): Promise<Facility[]> {
    return await this.db.select().from(facilities);
  }

  async getFacilitiesByRegion(regionId: number): Promise<Facility[]> {
    return await this.db.select().from(facilities).where(eq(facilities.regionId, regionId));
  }

  async createFacility(facility: InsertFacility): Promise<Facility> {
    const result = await this.db.insert(facilities).values(facility).returning();
    return result[0];
  }

  // Resistance data methods
  async getResistanceData(filters?: Partial<FilterState>): Promise<ResistanceData[]> {
    let query = this.db.select().from(resistanceData);
    
    if (filters) {
      const conditions = [];
      
      if (filters.bacteriaId !== undefined) {
        conditions.push(eq(resistanceData.bacteriaId, filters.bacteriaId));
      }
      
      if (filters.antibioticId !== undefined) {
        conditions.push(eq(resistanceData.antibioticId, filters.antibioticId));
      }
      
      if (filters.regionId !== undefined) {
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
    
    return await query;
  }

  async createResistanceData(data: InsertResistanceData): Promise<ResistanceData> {
    const result = await this.db.insert(resistanceData).values(data).returning();
    return result[0];
  }

  async bulkCreateResistanceData(dataArray: InsertResistanceData[]): Promise<ResistanceData[]> {
    const result = await this.db.insert(resistanceData).values(dataArray).returning();
    return result;
  }

  // Resource methods
  async getResources(): Promise<Resource[]> {
    return await this.db.select().from(resources).orderBy(desc(resources.publishedAt));
  }

  async getResourceById(id: number): Promise<Resource | undefined> {
    const result = await this.db.select().from(resources).where(eq(resources.id, id));
    return result[0] || undefined;
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const result = await this.db.insert(resources).values(resource).returning();
    return result[0];
  }

  // Alert methods
  async getAlerts(active?: boolean): Promise<Alert[]> {
    let query = this.db.select().from(alerts);
    
    if (active !== undefined) {
      query = query.where(eq(alerts.active, active));
    }
    
    return await query.orderBy(desc(alerts.createdAt));
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const result = await this.db.insert(alerts).values(alert).returning();
    return result[0];
  }

  // Dashboard summary methods
  async getResistanceSummary(filters?: Partial<FilterState>): Promise<ResistanceSummary> {
    const data = await this.getResistanceData(filters);
    
    const totalSamples = data.reduce((sum, item) => sum + item.totalSamples, 0);
    const resistantIsolates = data.reduce((sum, item) => sum + item.resistantSamples, 0);
    const resistanceRate = totalSamples > 0 ? (resistantIsolates / totalSamples) * 100 : 0;
    
    // Count unique facility IDs
    const facilityIds = new Set(data.map(item => item.facilityId));
    const participatingFacilities = facilityIds.size;
    
    return {
      totalSamples,
      resistantIsolates,
      resistanceRate,
      participatingFacilities
    };
  }

  async getResistanceTrends(filters?: Partial<FilterState>): Promise<ResistanceTrend[]> {
    const data = await this.getResistanceData(filters);
    
    // Group data by month and bacteria
    const trends = new Map<string, Map<number, { total: number, resistant: number }>>();
    
    for (const item of data) {
      const date = new Date(item.sampleDate);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!trends.has(month)) {
        trends.set(month, new Map());
      }
      
      const monthData = trends.get(month)!;
      
      if (!monthData.has(item.bacteriaId)) {
        monthData.set(item.bacteriaId, { total: 0, resistant: 0 });
      }
      
      const bacteriaData = monthData.get(item.bacteriaId)!;
      bacteriaData.total += item.totalSamples;
      bacteriaData.resistant += item.resistantSamples;
    }
    
    // Get bacteria names
    const bacteriaList = await this.getBacteria();
    const bacteriaMap = new Map(bacteriaList.map(b => [b.id, b.name]));
    
    // Convert to ResistanceTrend array
    const result: ResistanceTrend[] = [];
    
    for (const [month, bacteriaData] of trends.entries()) {
      for (const [bacteriaId, data] of bacteriaData.entries()) {
        result.push({
          month,
          bacteriaId,
          bacteriaName: bacteriaMap.get(bacteriaId) || `Unknown (ID: ${bacteriaId})`,
          resistanceRate: data.total > 0 ? (data.resistant / data.total) * 100 : 0
        });
      }
    }
    
    // Sort by month and bacteria name
    result.sort((a, b) => {
      if (a.month !== b.month) {
        return a.month.localeCompare(b.month);
      }
      return a.bacteriaName.localeCompare(b.bacteriaName);
    });
    
    return result;
  }

  async getAntibioticEffectiveness(filters?: Partial<FilterState>): Promise<AntibioticEffectiveness[]> {
    const data = await this.getResistanceData(filters);
    
    // Group data by antibiotic
    const effectiveness = new Map<number, { total: number, resistant: number, regions: Set<number> }>();
    
    for (const item of data) {
      if (!effectiveness.has(item.antibioticId)) {
        effectiveness.set(item.antibioticId, { total: 0, resistant: 0, regions: new Set() });
      }
      
      const antibioticData = effectiveness.get(item.antibioticId)!;
      antibioticData.total += item.totalSamples;
      antibioticData.resistant += item.resistantSamples;
      antibioticData.regions.add(item.regionId);
    }
    
    // Get antibiotic names
    const antibioticList = await this.getAntibiotics();
    const antibioticMap = new Map(antibioticList.map(a => [a.id, a.name]));
    
    // Get region names
    const regionList = await this.getRegions();
    const regionMap = new Map(regionList.map(r => [r.id, r.name]));
    
    // Convert to AntibioticEffectiveness array
    const result: AntibioticEffectiveness[] = [];
    
    for (const [antibioticId, data] of effectiveness.entries()) {
      result.push({
        id: antibioticId,
        name: antibioticMap.get(antibioticId) || `Unknown (ID: ${antibioticId})`,
        effectiveness: data.total > 0 ? 100 - (data.resistant / data.total) * 100 : 0,
        regions: Array.from(data.regions).map(id => regionMap.get(id) || `Unknown Region (ID: ${id})`)
      });
    }
    
    // Sort by effectiveness (descending)
    result.sort((a, b) => b.effectiveness - a.effectiveness);
    
    return result;
  }
}

import { DatabaseStorage } from './database-storage';

// Initialize the appropriate storage implementation
// For production, use DatabaseStorage
export const storage = process.env.NODE_ENV === 'test' 
  ? new MemStorage()
  : new DbStorage();
