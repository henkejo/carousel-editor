import React, { useRef } from 'react'
import { useWorkspaceStore } from '@/store/workspaceStore'
import { RotateCw } from 'lucide-react'
import classNames from 'classnames'

interface SelectableLayerProps {
  id: string
  url: string
  position: { x: number; y: number }
  rotation: number
  scale: { x: number; y: number }
  crop: { x: number; y: number; width: number; height: number }
}

const SelectableLayer: React.FC<SelectableLayerProps> = ({
  id,
  url,
  position,
  rotation,
  scale,
  crop
}) => {
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedLayerId = useWorkspaceStore(state => state.selectedLayerId)
  const selectLayer = useWorkspaceStore(state => state.selectLayer)
  const updateLayer = useWorkspaceStore(state => state.updateLayer)
  const isSelected = selectedLayerId === id

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateLayer(id, {
      rotation: rotation + 90
    })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    // If any modifier key is pressed, don't handle the event
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
      return
    }

    // Always select the layer first
    selectLayer(id)

    // Only start dragging if we have a container ref
    if (!containerRef.current) return

    const startX = e.clientX
    const startY = e.clientY
    const startPosition = { ...position }

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      updateLayer(id, {
        position: {
          x: startPosition.x + deltaX,
          y: startPosition.y + deltaY
        }
      })
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      ref={containerRef}
      className={classNames(
        'absolute cursor-move select-none',
        isSelected && 'outline outline-2 outline-blue-500'
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg) scale(${scale.x}, ${scale.y})`,
        transformOrigin: 'center'
      }}
      onMouseDown={handleMouseDown}
    >
      <img
        ref={imageRef}
        src={url}
        alt=""
        className="pointer-events-none"
        style={{
          clipPath: `inset(${crop.y}px ${crop.x}px ${crop.height}px ${crop.width}px)`
        }}
      />
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
            onClick={handleRotate}
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export default SelectableLayer
