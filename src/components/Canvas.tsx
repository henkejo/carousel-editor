import React, { useState, useEffect } from 'react'
import { useWorkspaceStore } from '@/store/workspaceStore'

interface CanvasProps {
  slideId: string
  position: { x: number; y: number }
  width: number
  height: number
  isAnimating?: boolean
}

const Canvas: React.FC<CanvasProps> = ({ slideId, position, width, height, isAnimating = false }) => {
  const addLayer = useWorkspaceStore(state => state.addLayer)
  const finishSlideAnimation = useWorkspaceStore(state => state.finishSlideAnimation)
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        finishSlideAnimation(slideId)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isAnimating, slideId, finishSlideAnimation])

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
      className={`bg-white shadow-lg relative transition-all duration-500 ease-out ${
        isDragOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''
      } ${
        isAnimating ? 'animate-slide-in' : ''
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
