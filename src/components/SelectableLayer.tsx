import React, { useRef, useState, useEffect } from 'react'
import { useWorkspaceStore } from '@/store/workspaceStore'
import classNames from 'classnames'

type ResizeHandle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

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

  const handleResize = (handle: ResizeHandle) => (e: React.MouseEvent) => {
    e.stopPropagation()

    const startX = e.clientX / zoom
    const startY = e.clientY / zoom
    const startScale = { ...scale }

    const isLeft = handle.includes('left')
    const isTop = handle.includes('top')

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX / zoom
      const currentY = e.clientY / zoom

      const deltaX = currentX - startX
      const deltaY = currentY - startY

      const scaleFactor = 0.005
      let scaleChange = 0

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        scaleChange = deltaX * scaleFactor
      } else {
        scaleChange = deltaY * scaleFactor
      }

      if (isLeft || isTop) {
        scaleChange = -scaleChange
      }

      const minScale = 0.1
      const newScaleValue = Math.max(minScale, startScale.x + scaleChange)

      updateLayer(id, {
        scale: {
          x: newScaleValue,
          y: newScaleValue
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
        isSelected && 'outline outline-2 outline-white drop-shadow-lg'
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
        <>
          <div
            className="absolute w-3 h-3 bg-white border-2 border-black rounded-sm cursor-nw-resize -left-1.5 -top-1.5"
            onMouseDown={handleResize('top-left')}
          />
          <div
            className="absolute w-3 h-3 bg-white border-2 border-black rounded-sm cursor-ne-resize -right-1.5 -top-1.5"
            onMouseDown={handleResize('top-right')}
          />
          <div
            className="absolute w-3 h-3 bg-white border-2 border-black rounded-sm cursor-sw-resize -left-1.5 -bottom-1.5"
            onMouseDown={handleResize('bottom-left')}
          />
          <div
            className="absolute w-3 h-3 bg-white border-2 border-black rounded-sm cursor-se-resize -right-1.5 -bottom-1.5"
            onMouseDown={handleResize('bottom-right')}
          />
        </>
      )}
    </div>
  )
}

export default SelectableLayer