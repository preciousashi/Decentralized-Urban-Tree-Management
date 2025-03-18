import { describe, it, expect, beforeEach, vi } from "vitest"

// Mock the Clarity VM environment
const mockClarity = {
  tx: {
    sender: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
  },
  block: {
    time: 1625097600, // July 1, 2021
  },
}

// Mock the contract functions
const plantingCoordination = {
  registerPlantingSite: vi.fn(),
  updateSitePriority: vi.fn(),
  createInitiative: vi.fn(),
  createPlantingEvent: vi.fn(),
  updateInitiativeProgress: vi.fn(),
  setSpeciesDiversityGoals: vi.fn(),
  getPlantingSite: vi.fn(),
  getPlantingInitiative: vi.fn(),
  getPlantingEvent: vi.fn(),
  getSpeciesDiversityGoals: vi.fn(),
}

describe("Planting Coordination Contract", () => {
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks()
    
    // Setup default mock implementations
    plantingCoordination.registerPlantingSite.mockReturnValue({ type: "ok", value: true })
    plantingCoordination.updateSitePriority.mockReturnValue({ type: "ok", value: true })
    plantingCoordination.createInitiative.mockReturnValue({ type: "ok", value: true })
    plantingCoordination.createPlantingEvent.mockReturnValue({ type: "ok", value: true })
    plantingCoordination.updateInitiativeProgress.mockReturnValue({ type: "ok", value: true })
    plantingCoordination.setSpeciesDiversityGoals.mockReturnValue({ type: "ok", value: true })
    
    plantingCoordination.getPlantingSite.mockReturnValue({
      value: {
        location: {
          latitude: 40712776,
          longitude: -74005974,
          address: "123 Main St, New York, NY",
        },
        siteType: "sidewalk",
        soilType: "loam",
        sunExposure: "partial",
        availableSpace: 200, // 2.00 meters (scaled by 100)
        priorityScore: 85,
        recommendedSpecies: ["Quercus rubra", "Acer rubrum", "Tilia americana"],
        status: "available",
        createdBy: mockClarity.tx.sender,
        creationTime: mockClarity.block.time,
      },
    })
    
    plantingCoordination.getPlantingInitiative.mockReturnValue({
      value: {
        name: "Green Streets Initiative",
        description: "Planting trees along main streets to improve air quality and aesthetics",
        targetArea: "Downtown",
        startDate: mockClarity.block.time,
        endDate: mockClarity.block.time + 31536000, // 1 year later
        targetCount: 100,
        currentCount: 25,
        status: "active",
        coordinator: mockClarity.tx.sender,
      },
    })
    
    plantingCoordination.getPlantingEvent.mockReturnValue({
      value: {
        name: "Community Planting Day",
        date: mockClarity.block.time + 1209600, // 2 weeks later
        location: "City Park",
        targetSites: ["site-001", "site-002", "site-003"],
        volunteersNeeded: 20,
        volunteersRegistered: 15,
        status: "scheduled",
        organizer: mockClarity.tx.sender,
      },
    })
    
    plantingCoordination.getSpeciesDiversityGoals.mockReturnValue({
      value: {
        targetPercentages: [
          { species: "Quercus rubra", targetPercentage: 20 },
          { species: "Acer rubrum", targetPercentage: 15 },
          { species: "Tilia americana", targetPercentage: 10 },
        ],
        currentPercentages: [
          { species: "Quercus rubra", currentPercentage: 25 },
          { species: "Acer rubrum", currentPercentage: 10 },
          { species: "Tilia americana", currentPercentage: 5 },
        ],
        lastUpdated: mockClarity.block.time,
      },
    })
  })
  
  describe("registerPlantingSite", () => {
    it("should register a planting site successfully", () => {
      const siteId = "site-001"
      const latitude = 40712776
      const longitude = -74005974
      const address = "123 Main St, New York, NY"
      const siteType = "sidewalk"
      const soilType = "loam"
      const sunExposure = "partial"
      const availableSpace = 200
      
      const result = plantingCoordination.registerPlantingSite(
          siteId,
          latitude,
          longitude,
          address,
          siteType,
          soilType,
          sunExposure,
          availableSpace,
      )
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(plantingCoordination.registerPlantingSite).toHaveBeenCalledWith(
          siteId,
          latitude,
          longitude,
          address,
          siteType,
          soilType,
          sunExposure,
          availableSpace,
      )
    })
  })
  
  describe("createInitiative", () => {
    it("should create a planting initiative successfully", () => {
      const initiativeId = "initiative-001"
      const name = "Green Streets Initiative"
      const description = "Planting trees along main streets to improve air quality and aesthetics"
      const targetArea = "Downtown"
      const startDate = mockClarity.block.time
      const endDate = mockClarity.block.time + 31536000 // 1 year later
      const targetCount = 100
      
      const result = plantingCoordination.createInitiative(
          initiativeId,
          name,
          description,
          targetArea,
          startDate,
          endDate,
          targetCount,
      )
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(plantingCoordination.createInitiative).toHaveBeenCalledWith(
          initiativeId,
          name,
          description,
          targetArea,
          startDate,
          endDate,
          targetCount,
      )
    })
  })
  
  describe("createPlantingEvent", () => {
    it("should create a planting event successfully", () => {
      const initiativeId = "initiative-001"
      const eventId = "event-001"
      const name = "Community Planting Day"
      const date = mockClarity.block.time + 1209600 // 2 weeks later
      const location = "City Park"
      const targetSites = ["site-001", "site-002", "site-003"]
      const volunteersNeeded = 20
      
      const result = plantingCoordination.createPlantingEvent(
          initiativeId,
          eventId,
          name,
          date,
          location,
          targetSites,
          volunteersNeeded,
      )
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(plantingCoordination.createPlantingEvent).toHaveBeenCalledWith(
          initiativeId,
          eventId,
          name,
          date,
          location,
          targetSites,
          volunteersNeeded,
      )
    })
  })
  
  describe("updateInitiativeProgress", () => {
    it("should update initiative progress successfully", () => {
      const initiativeId = "initiative-001"
      const treesPlanted = 10
      
      const result = plantingCoordination.updateInitiativeProgress(initiativeId, treesPlanted)
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(plantingCoordination.updateInitiativeProgress).toHaveBeenCalledWith(initiativeId, treesPlanted)
    })
  })
  
  describe("getPlantingSite", () => {
    it("should retrieve planting site information", () => {
      const siteId = "site-001"
      
      const result = plantingCoordination.getPlantingSite(siteId)
      
      expect(result.value).toEqual({
        location: {
          latitude: 40712776,
          longitude: -74005974,
          address: "123 Main St, New York, NY",
        },
        siteType: "sidewalk",
        soilType: "loam",
        sunExposure: "partial",
        availableSpace: 200,
        priorityScore: 85,
        recommendedSpecies: ["Quercus rubra", "Acer rubrum", "Tilia americana"],
        status: "available",
        createdBy: mockClarity.tx.sender,
        creationTime: mockClarity.block.time,
      })
      expect(plantingCoordination.getPlantingSite).toHaveBeenCalledWith(siteId)
    })
  })
})

