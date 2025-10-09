import React, { useRef } from 'react'
import { useWorkspaceStore } from '@/store/workspaceStore'
import classNames from 'classnames'
import ResizeHandles from './ResizeHandles'
import RotationHandle from './RotationHandle'

type ResizeHandle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

interface SelectableLayerProps {
  id: string
  url: string
  position: { x: number; y: number }
  rotation: number
  width: number
  height: number
  crop: { x: number; y: number; width: number; height: number }
}

const SelectableLayer: React.FC<SelectableLayerProps> = ({
  id,
  url,
  position,
  rotation,
  width,
  height,
  crop
}) => {
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedLayerId = useWorkspaceStore(state => state.selectedLayerId)
  const selectLayer = useWorkspaceStore(state => state.selectLayer)
  const updateLayer = useWorkspaceStore(state => state.updateLayer)
  const zoom = useWorkspaceStore(state => state.zoom)
  const isDragKeyHeld = useWorkspaceStore(state => state.isDragKeyHeld)
  const isSelected = selectedLayerId === id

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || isDragKeyHeld) {
      return
    }
    e.stopPropagation()

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
    const startWidth = width
    const startHeight = height
    const startPosition = { ...position }

    const isLeft = handle.includes('left')
    const isTop = handle.includes('top')

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX / zoom
      const currentY = e.clientY / zoom

      const deltaX = currentX - startX
      const deltaY = currentY - startY

      let newWidth = startWidth
      let newHeight = startHeight
      let newPosition = { ...startPosition }

      if (isLeft) {
        newWidth = Math.max(20, startWidth - deltaX)
        newPosition.x = startPosition.x + (startWidth - newWidth)
      } else {
        newWidth = Math.max(20, startWidth + deltaX)
      }

      if (isTop) {
        newHeight = Math.max(20, startHeight - deltaY)
        newPosition.y = startPosition.y + (startHeight - newHeight)
      } else {
        newHeight = Math.max(20, startHeight + deltaY)
      }

      updateLayer(id, {
        width: newWidth,
        height: newHeight,
        position: newPosition
      })
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation()

    const startX = e.clientX
    const startY = e.clientY
    const startRotation = rotation
    const pan = useWorkspaceStore.getState().pan
    const centerX = pan.x + (position.x + width / 2) * zoom
    const centerY = pan.y + (position.y + height / 2) * zoom

    const getAngle = (x: number, y: number) => {
      return Math.atan2(y - centerY, x - centerX) * (180 / Math.PI)
    }

    const startAngle = getAngle(startX, startY)

    const handleMouseMove = (e: MouseEvent) => {
      const currentAngle = getAngle(e.clientX, e.clientY)
      let deltaAngle = currentAngle - startAngle
      
      if (deltaAngle > 180) deltaAngle -= 360
      if (deltaAngle < -180) deltaAngle += 360
      
      const newRotation = startRotation + deltaAngle

      updateLayer(id, {
        rotation: newRotation
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
        isDragKeyHeld && 'cursor-grabbing',
        isSelected && 'outline outline-2 outline-white drop-shadow-lg'
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) rotate(${rotation}deg)`,
        transformOrigin: 'center',
        width: `${width}px`,
        height: `${height}px`
      }}
      onMouseDown={handleMouseDown}
    >
      <img
        ref={imageRef}
        src={url}
        alt=""
        className="pointer-events-none w-full h-full object-cover"
        style={{
          clipPath: `inset(${crop.y}px ${crop.x}px ${crop.height}px ${crop.width}px)`
        }}
      />
      {isSelected && (
        <>
          <ResizeHandles onResize={handleResize} />
          <RotationHandle onRotate={handleRotate} />
        </>
      )}
    </div>
  )
}

export default SelectableLayer