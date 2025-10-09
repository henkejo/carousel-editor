import React, { useState, useMemo } from 'react'
import { useWorkspaceStore } from '@/store/workspaceStore'
import SelectableLayer from './SelectableLayer'

interface CanvasProps {
  slideId: string
  position: { x: number; y: number }
  width: number
  height: number
}

const Canvas: React.FC<CanvasProps> = ({ slideId, position, width, height }) => {
  const allLayers = useWorkspaceStore(state => state.layers)
  const addLayer = useWorkspaceStore(state => state.addLayer)
  const [isDragOver, setIsDragOver] = useState(false)

  const layers = useMemo(() => 
    allLayers.filter(layer => layer.slideId === slideId),
    [allLayers, slideId]
  )

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
          position: { x: 0, y: 0 },
          rotation: 0,
          width: 200,
          height: 200,
          crop: { x: 0, y: 0, width: 0, height: 0 },
          slideId
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
      {layers.map(layer => (
        <SelectableLayer
          key={layer.id}
          id={layer.id}
          url={layer.url}
          position={layer.position}
          rotation={layer.rotation}
          width={layer.width}
          height={layer.height}
          crop={layer.crop}
        />
      ))}
    </div>
  )
}

export default Canvas
