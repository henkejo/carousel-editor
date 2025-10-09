import React, { useState } from 'react'
import { useWorkspaceStore } from '@/store/workspaceStore'

interface CanvasProps {
  slideId: string
  position: { x: number; y: number }
  width: number
  height: number
}

const Canvas: React.FC<CanvasProps> = ({ position, width, height }) => {
  const addLayer = useWorkspaceStore(state => state.addLayer)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    imageFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        if (!url) return

        addLayer({
          type: 'image',
          url,
          position: { x: position.x + 50, y: position.y + 50 },
          rotation: 0,
          width: 200,
          height: 200,
          crop: { x: 0, y: 0, width: 0, height: 0 }
        })
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <div 
      className={`bg-white shadow-lg relative transition-colors duration-200 ${
        isDragOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''
      }`}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: width,
        height: height
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
    </div>
  )
}

export default Canvas
