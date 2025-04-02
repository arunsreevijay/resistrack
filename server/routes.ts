import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBacteriaSchema, insertAntibioticSchema, 
  insertRegionSchema, insertFacilitySchema, insertResistanceDataSchema, 
  insertResourceSchema, insertAlertSchema } from "@shared/schema";
import * as z from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API Base Path
  const basePath = "/api";
  
  // Middleware for handling validation errors
  const validateRequest = (schema: z.ZodTypeAny) => (req: Request, res: Response, next: Function) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred during validation" });
      }
    }
  };
  
  // Dashboard Endpoints
  app.get(`${basePath}/dashboard/summary`, async (req, res) => {
    try {
      const filters = parseFilters(req.query);
      const summary = await storage.getResistanceSummary(filters);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard summary" });
    }
  });
  
  app.get(`${basePath}/dashboard/trends`, async (req, res) => {
    try {
      const filters = parseFilters(req.query);
      const trends = await storage.getResistanceTrends(filters);
      res.json(trends);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resistance trends" });
    }
  });
  
  app.get(`${basePath}/dashboard/effectiveness`, async (req, res) => {
    try {
      const filters = parseFilters(req.query);
      const effectiveness = await storage.getAntibioticEffectiveness(filters);
      res.json(effectiveness);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch antibiotic effectiveness" });
    }
  });
  
  // Bacteria Endpoints
  app.get(`${basePath}/bacteria`, async (_req, res) => {
    try {
      const bacteria = await storage.getBacteria();
      res.json(bacteria);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bacteria" });
    }
  });
  
  app.get(`${basePath}/bacteria/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const bacteria = await storage.getBacteriaById(id);
      if (!bacteria) {
        return res.status(404).json({ message: "Bacteria not found" });
      }
      
      res.json(bacteria);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bacteria" });
    }
  });
  
  app.post(`${basePath}/bacteria`, validateRequest(insertBacteriaSchema), async (req, res) => {
    try {
      const newBacteria = await storage.createBacteria(req.body);
      res.status(201).json(newBacteria);
    } catch (error) {
      res.status(500).json({ message: "Failed to create bacteria" });
    }
  });
  
  // Antibiotic Endpoints
  app.get(`${basePath}/antibiotics`, async (_req, res) => {
    try {
      const antibiotics = await storage.getAntibiotics();
      res.json(antibiotics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch antibiotics" });
    }
  });
  
  app.get(`${basePath}/antibiotics/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const antibiotic = await storage.getAntibioticById(id);
      if (!antibiotic) {
        return res.status(404).json({ message: "Antibiotic not found" });
      }
      
      res.json(antibiotic);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch antibiotic" });
    }
  });
  
  app.post(`${basePath}/antibiotics`, validateRequest(insertAntibioticSchema), async (req, res) => {
    try {
      const newAntibiotic = await storage.createAntibiotic(req.body);
      res.status(201).json(newAntibiotic);
    } catch (error) {
      res.status(500).json({ message: "Failed to create antibiotic" });
    }
  });
  
  // Region Endpoints
  app.get(`${basePath}/regions`, async (_req, res) => {
    try {
      const regions = await storage.getRegions();
      res.json(regions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch regions" });
    }
  });
  
  app.get(`${basePath}/regions/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const region = await storage.getRegionById(id);
      if (!region) {
        return res.status(404).json({ message: "Region not found" });
      }
      
      res.json(region);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch region" });
    }
  });
  
  app.post(`${basePath}/regions`, validateRequest(insertRegionSchema), async (req, res) => {
    try {
      const newRegion = await storage.createRegion(req.body);
      res.status(201).json(newRegion);
    } catch (error) {
      res.status(500).json({ message: "Failed to create region" });
    }
  });
  
  // Facility Endpoints
  app.get(`${basePath}/facilities`, async (req, res) => {
    try {
      const regionId = req.query.regionId ? parseInt(req.query.regionId as string) : undefined;
      
      if (regionId) {
        const facilities = await storage.getFacilitiesByRegion(regionId);
        res.json(facilities);
      } else {
        const facilities = await storage.getFacilities();
        res.json(facilities);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch facilities" });
    }
  });
  
  app.post(`${basePath}/facilities`, validateRequest(insertFacilitySchema), async (req, res) => {
    try {
      const newFacility = await storage.createFacility(req.body);
      res.status(201).json(newFacility);
    } catch (error) {
      res.status(500).json({ message: "Failed to create facility" });
    }
  });
  
  // Resistance Data Endpoints
  app.get(`${basePath}/resistance-data`, async (req, res) => {
    try {
      const filters = parseFilters(req.query);
      const data = await storage.getResistanceData(filters);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resistance data" });
    }
  });
  
  app.post(`${basePath}/resistance-data`, validateRequest(insertResistanceDataSchema), async (req, res) => {
    try {
      const newData = await storage.createResistanceData(req.body);
      res.status(201).json(newData);
    } catch (error) {
      res.status(500).json({ message: "Failed to create resistance data" });
    }
  });
  
  app.post(`${basePath}/resistance-data/bulk`, async (req, res) => {
    try {
      if (!Array.isArray(req.body)) {
        return res.status(400).json({ message: "Expected an array of resistance data" });
      }
      
      // Validate each item in the array
      for (const item of req.body) {
        try {
          insertResistanceDataSchema.parse(item);
        } catch (error) {
          if (error instanceof z.ZodError) {
            const validationError = fromZodError(error);
            return res.status(400).json({ message: validationError.message });
          }
        }
      }
      
      const newData = await storage.bulkCreateResistanceData(req.body);
      res.status(201).json(newData);
    } catch (error) {
      res.status(500).json({ message: "Failed to create resistance data" });
    }
  });
  
  // Resources Endpoints
  app.get(`${basePath}/resources`, async (_req, res) => {
    try {
      const resources = await storage.getResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });
  
  app.get(`${basePath}/resources/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID format" });
      }
      
      const resource = await storage.getResourceById(id);
      if (!resource) {
        return res.status(404).json({ message: "Resource not found" });
      }
      
      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resource" });
    }
  });
  
  app.post(`${basePath}/resources`, validateRequest(insertResourceSchema), async (req, res) => {
    try {
      const newResource = await storage.createResource(req.body);
      res.status(201).json(newResource);
    } catch (error) {
      res.status(500).json({ message: "Failed to create resource" });
    }
  });
  
  // Alerts Endpoints
  app.get(`${basePath}/alerts`, async (req, res) => {
    try {
      const activeOnly = req.query.active === 'true';
      const alerts = await storage.getAlerts(activeOnly);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch alerts" });
    }
  });
  
  app.post(`${basePath}/alerts`, validateRequest(insertAlertSchema), async (req, res) => {
    try {
      const newAlert = await storage.createAlert(req.body);
      res.status(201).json(newAlert);
    } catch (error) {
      res.status(500).json({ message: "Failed to create alert" });
    }
  });
  
  // User Endpoints
  app.post(`${basePath}/users`, validateRequest(insertUserSchema), async (req, res) => {
    try {
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Helper function to parse filter parameters
  function parseFilters(query: any) {
    const filters: any = {};
    
    if (query.bacteriaId) {
      filters.bacteriaId = parseInt(query.bacteriaId as string);
    }
    
    if (query.antibioticId) {
      filters.antibioticId = parseInt(query.antibioticId as string);
    }
    
    if (query.regionId) {
      filters.regionId = parseInt(query.regionId as string);
    }
    
    if (query.fromDate) {
      filters.fromDate = new Date(query.fromDate as string);
    }
    
    if (query.toDate) {
      filters.toDate = new Date(query.toDate as string);
    }
    
    if (query.timePeriod) {
      filters.timePeriod = query.timePeriod as string;
    } else {
      // Default to last 12 months if not specified
      filters.timePeriod = '12m';
    }
    
    return filters;
  }

  const httpServer = createServer(app);
  return httpServer;
}
