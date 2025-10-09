import React, { useState } from 'react'
import { useWorkspaceStore } from '@/store/workspaceStore'
import SelectableLayer from './SelectableLayer'

const Canvas: React.FC = () => {
  const layers = useWorkspaceStore(state => state.layers)
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
          position: { x: 0, y: 0 },
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
      className={`bg-white w-96 h-96 shadow-lg relative transition-colors duration-200 ${
        isDragOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''
      }`}
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
