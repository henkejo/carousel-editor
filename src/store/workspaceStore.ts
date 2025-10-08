import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface Layer {
  id: string
  type: 'image'
  url: string
  position: { x: number; y: number }
  rotation: number
  scale: { x: number; y: number }
  crop: { x: number; y: number; width: number; height: number }
}

interface WorkspaceState {
  zoom: number
  pan: { x: number; y: number }
  isDragging: boolean
  lastPanPosition: { x: number; y: number }
  layers: Layer[]
  selectedLayerId: string | null
  setZoom: (zoom: number) => void
  setPan: (pan: { x: number; y: number }) => void
  updatePan: (deltaX: number, deltaY: number) => void
  setIsDragging: (isDragging: boolean) => void
  setLastPanPosition: (position: { x: number; y: number }) => void
  addLayer: (layer: Omit<Layer, 'id'>) => void
  updateLayer: (id: string, updates: Partial<Layer>) => void
  selectLayer: (id: string | null) => void
  reset: () => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  immer((set) => ({
    zoom: 1,
    pan: { x: window.innerWidth / 2 - 192, y: window.innerHeight / 2 - 192 },
    isDragging: false,
    lastPanPosition: { x: 0, y: 0 },
    layers: [],
    selectedLayerId: null,
    
    setZoom: (zoom: number) => set((state) => {
      state.zoom = Math.min(Math.max(0.1, zoom), 8)
    }),
    
    setPan: (pan: { x: number; y: number }) => set((state) => {
      state.pan = pan
    }),
    
    updatePan: (deltaX: number, deltaY: number) => set((state) => {
      state.pan.x += deltaX
      state.pan.y += deltaY
    }),
    
    setIsDragging: (isDragging: boolean) => set((state) => {
      state.isDragging = isDragging
    }),
    
    setLastPanPosition: (position: { x: number; y: number }) => set((state) => {
      state.lastPanPosition = position
    }),

    addLayer: (layer: Omit<Layer, 'id'>) => set((state) => {
      const id = crypto.randomUUID()
      state.layers.push({ ...layer, id })
      state.selectedLayerId = id
    }),

    updateLayer: (id: string, updates: Partial<Layer>) => set((state) => {
      const layer = state.layers.find(l => l.id === id)
      if (layer) {
        Object.assign(layer, updates)
      }
    }),

    selectLayer: (id: string | null) => set((state) => {
      state.selectedLayerId = id
    }),
    
    reset: () => set((state) => {
      state.zoom = 1
      state.pan = { x: window.innerWidth / 2 - 192, y: window.innerHeight / 2 - 192 }
      state.isDragging = false
      state.lastPanPosition = { x: 0, y: 0 }
      state.layers = []
      state.selectedLayerId = null
    })
  }))
)
