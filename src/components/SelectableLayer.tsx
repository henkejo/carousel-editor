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
  const zoom = useWorkspaceStore(state => state.zoom)
  const isSelected = selectedLayerId === id

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) {
      return
    }

    if (!isSelected) {
      selectLayer(id)
    }

    if (!containerRef.current) return

    const startX = e.clientX
    const startY = e.clientY
    const startPosition = { ...position }

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - startX) / zoom
      const deltaY = (e.clientY - startY) / zoom
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
        isSelected && 'outline outline-2 outline-white-500 drop-shadow-lg'
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
    </div>
  )
}

export default SelectableLayer
