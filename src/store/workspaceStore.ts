import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface WorkspaceState {
  zoom: number
  pan: { x: number; y: number }
  isDragging: boolean
  lastPanPosition: { x: number; y: number }
  setZoom: (zoom: number) => void
  setPan: (pan: { x: number; y: number }) => void
  updatePan: (deltaX: number, deltaY: number) => void
  setIsDragging: (isDragging: boolean) => void
  setLastPanPosition: (position: { x: number; y: number }) => void
  reset: () => void
}

export const useWorkspaceStore = create<WorkspaceState>()(
  immer((set) => ({
    zoom: 1,
    pan: { x: window.innerWidth / 2 - 192, y: window.innerHeight / 2 - 192 },
    isDragging: false,
    lastPanPosition: { x: 0, y: 0 },
    
    setZoom: (zoom: number) => set((state) => {
      state.zoom = Math.min(Math.max(0.1, zoom), 5)
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
    
    reset: () => set((state) => {
      state.zoom = 1
      state.pan = { x: window.innerWidth / 2 - 192, y: window.innerHeight / 2 - 192 }
      state.isDragging = false
      state.lastPanPosition = { x: 0, y: 0 }
    })
  }))
)
