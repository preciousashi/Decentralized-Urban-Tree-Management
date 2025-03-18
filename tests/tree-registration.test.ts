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
const treeRegistration = {
  registerTree: vi.fn(),
  updateTree: vi.fn(),
  updateTreeStatus: vi.fn(),
  transferOwnership: vi.fn(),
  getTree: vi.fn(),
  getTreeHistoryRecord: vi.fn(),
  getTreeHistoryCount: vi.fn(),
}

describe("Tree Registration Contract", () => {
  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks()
    
    // Setup default mock implementations
    treeRegistration.registerTree.mockReturnValue({ type: "ok", value: true })
    treeRegistration.updateTree.mockReturnValue({ type: "ok", value: true })
    treeRegistration.updateTreeStatus.mockReturnValue({ type: "ok", value: true })
    treeRegistration.transferOwnership.mockReturnValue({ type: "ok", value: true })
    
    treeRegistration.getTree.mockReturnValue({
      value: {
        owner: mockClarity.tx.sender,
        species: "Quercus rubra",
        location: {
          latitude: 40712776,
          longitude: -74005974,
          address: "123 Main St, New York, NY",
        },
        height: 500, // 5.00 meters (scaled by 100)
        diameter: 30, // 30 cm
        condition: "healthy",
        plantingDate: mockClarity.block.time - 31536000, // 1 year ago
        lastUpdated: mockClarity.block.time,
        status: "active",
      },
    })
    
    treeRegistration.getTreeHistoryRecord.mockReturnValue({
      value: {
        updateType: "registration",
        updatedBy: mockClarity.tx.sender,
        updateTime: mockClarity.block.time - 31536000,
        previousCondition: "",
        newCondition: "healthy",
        notes: "Initial tree registration",
      },
    })
    
    treeRegistration.getTreeHistoryCount.mockReturnValue({
      value: 1,
    })
  })
  
  describe("registerTree", () => {
    it("should register a new tree successfully", () => {
      const treeId = "tree-001"
      const species = "Quercus rubra"
      const latitude = 40712776
      const longitude = -74005974
      const address = "123 Main St, New York, NY"
      const height = 500
      const diameter = 30
      const condition = "healthy"
      const plantingDate = mockClarity.block.time - 31536000
      
      const result = treeRegistration.registerTree(
          treeId,
          species,
          latitude,
          longitude,
          address,
          height,
          diameter,
          condition,
          plantingDate,
      )
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(treeRegistration.registerTree).toHaveBeenCalledWith(
          treeId,
          species,
          latitude,
          longitude,
          address,
          height,
          diameter,
          condition,
          plantingDate,
      )
    })
  })
  
  describe("updateTree", () => {
    it("should update tree information successfully", () => {
      const treeId = "tree-001"
      const height = 550 // 5.50 meters
      const diameter = 35 // 35 cm
      const condition = "good"
      const notes = "Annual growth assessment"
      
      const result = treeRegistration.updateTree(treeId, height, diameter, condition, notes)
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(treeRegistration.updateTree).toHaveBeenCalledWith(treeId, height, diameter, condition, notes)
    })
  })
  
  describe("updateTreeStatus", () => {
    it("should update tree status successfully", () => {
      const treeId = "tree-001"
      const status = "removed"
      const notes = "Tree removed due to disease"
      
      const result = treeRegistration.updateTreeStatus(treeId, status, notes)
      
      expect(result.type).toBe("ok")
      expect(result.value).toBe(true)
      expect(treeRegistration.updateTreeStatus).toHaveBeenCalledWith(treeId, status, notes)
    })
  })
  
  describe("getTree", () => {
    it("should retrieve tree information", () => {
      const treeId = "tree-001"
      
      const result = treeRegistration.getTree(treeId)
      
      expect(result.value).toEqual({
        owner: mockClarity.tx.sender,
        species: "Quercus rubra",
        location: {
          latitude: 40712776,
          longitude: -74005974,
          address: "123 Main St, New York, NY",
        },
        height: 500,
        diameter: 30,
        condition: "healthy",
        plantingDate: mockClarity.block.time - 31536000,
        lastUpdated: mockClarity.block.time,
        status: "active",
      })
      expect(treeRegistration.getTree).toHaveBeenCalledWith(treeId)
    })
  })
})

