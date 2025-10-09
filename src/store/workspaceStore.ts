import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { SnapHandler } from '@/lib/snapHandler'

interface Layer {
  id: string
  type: 'image'
  url: string
  position: { x: number; y: number }
  rotation: number
  width: number
  height: number
  crop: { x: number; y: number; width: number; height: number }
  slideId: string
}

interface Slide {
  id: string
  position: { x: number; y: number }
  width: number
  height: number
}

interface WorkspaceState {
  zoom: number
  pan: { x: number; y: number }
  isDragging: boolean
  lastPanPosition: { x: number; y: number }
  isDragKeyHeld: boolean
  minimisedToolbar: boolean
  layers: Layer[]
  slides: Slide[]
  selectedLayerId: string | null
  snapHandler: SnapHandler
  minimiseToolbar: () => void
  setZoom: (zoom: number) => void
  setPan: (pan: { x: number; y: number }) => void
  updatePan: (deltaX: number, deltaY: number) => void
  setIsDragging: (isDragging: boolean) => void
  setLastPanPosition: (position: { x: number; y: number }) => void
  setIsDragKeyHeld: (isDragKeyHeld: boolean) => void
  addLayer: (layer: Omit<Layer, 'id'>) => void
  updateLayer: (id: string, updates: Partial<Layer>) => void
  deleteLayer: (id: string) => void
  selectLayer: (id: string | null) => void
  addSlide: () => void
  snapToEdges: (layerId: string, newPosition: { x: number; y: number }, newSize?: { width: number; height: number }) => { x: number; y: number }
  reset: () => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  immer((set) => ({
    zoom: 1,
    pan: { x: window.innerWidth / 2 - 192, y: window.innerHeight / 2 - 192 },
    isDragging: false,
    lastPanPosition: { x: 0, y: 0 },
    isDragKeyHeld: false,
    layers: [] as Layer[],
    slides: [
      {
        id: 'default-slide',
        position: { x: 0, y: 0 },
        width: 384,
        height: 384
      }
    ] as Slide[],
    selectedLayerId: null,
    snapHandler: new SnapHandler(),
    minimisedToolbar: false,
    
    minimiseToolbar: () => set((state) => {
      state.minimisedToolbar = !state.minimisedToolbar
    }),

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

    setIsDragKeyHeld: (isDragKeyHeld: boolean) => set((state) => {
      state.isDragKeyHeld = isDragKeyHeld
    }),

    addLayer: (layer: Omit<Layer, 'id'>) => set((state) => {
      const id = crypto.randomUUID()
      const slideId = state.slides.length > 0 ? state.slides[0].id : 'default-slide'
      state.layers.push({ ...layer, id, slideId })
      state.selectedLayerId = id
    }),

    updateLayer: (id: string, updates: Partial<Layer>) => set((state) => {
      const layer = state.layers.find(l => l.id === id)
      if (layer) {
        Object.assign(layer, updates)
      }
    }),

    deleteLayer: (id: string) => set((state) => {
      state.layers = state.layers.filter(l => l.id !== id)
      if (state.selectedLayerId === id) {
        state.selectedLayerId = null
      }
    }),

    selectLayer: (id: string | null) => set((state) => {
      state.selectedLayerId = id
    }),

    addSlide: () => set((state) => {
      const id = crypto.randomUUID()
      const lastSlide = state.slides[state.slides.length - 1]
      const newPosition = {
        x: lastSlide.position.x + lastSlide.width + 1,
        y: lastSlide.position.y
      }
      state.slides.push({
        id,
        position: newPosition,
        width: 384,
        height: 384
      })
    }),

    snapToEdges: (layerId: string, newPosition: { x: number; y: number }, newSize?: { width: number; height: number }): { x: number; y: number } => {
      const state = useWorkspaceStore.getState()
      const currentLayer = state.layers.find((l: Layer) => l.id === layerId)
      if (!currentLayer) return newPosition

      const size = {
        width: newSize?.width ?? currentLayer.width,
        height: newSize?.height ?? currentLayer.height
      }

      const result = state.snapHandler.snap(layerId, newPosition, size, state.layers)
      return result.position
    },
    
    reset: () => set((state) => {
      state.zoom = 1
      state.pan = { x: window.innerWidth / 2 - 192, y: window.innerHeight / 2 - 192 }
      state.isDragging = false
      state.lastPanPosition = { x: 0, y: 0 }
      state.isDragKeyHeld = false
      state.layers = [] as Layer[]
      state.slides = [
        {
          id: 'default-slide',
          position: { x: 0, y: 0 },
          width: 384,
          height: 384
        }
      ] as Slide[]
      state.selectedLayerId = null
      state.minimisedToolbar = false
      state.snapHandler = new SnapHandler()
    })
  }))
)
