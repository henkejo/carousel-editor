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
  const deleteSlide = useWorkspaceStore(state => state.deleteSlide)
  const finishSlideAnimation = useWorkspaceStore(state => state.finishSlideAnimation)
  const [isDragOver, setIsDragOver] = useState(false)
  const [showDeleteIcon, setShowDeleteIcon] = useState(false)

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

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowDeleteIcon(true)
  }

  const handleDeleteClick = () => {
    deleteSlide(slideId)
    setShowDeleteIcon(false)
  }

  const handleClickOutside = () => {
    setShowDeleteIcon(false)
  }

  return (
    <>
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
        onContextMenu={handleContextMenu}
        onClick={handleClickOutside}
      >
      </div>
      
      {showDeleteIcon && (
        <div
          className="absolute z-50 cursor-pointer transition-all duration-200 ease-out hover:scale-110"
          style={{
            left: position.x + width / 2 - 12,
            top: position.y - 40,
            animation: 'fadeInScale 0.2s ease-out'
          }}
          onClick={handleDeleteClick}
        >
          <div className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="3,6 5,6 21,6"></polyline>
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </div>
        </div>
      )}
    </>
  )
}

export default Canvas
