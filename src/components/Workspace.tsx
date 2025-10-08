import React, { useRef, useEffect, useState } from 'react'
import { useWorkspaceStore } from '@/store/workspaceStore'
import Canvas from './Canvas'
import FloatingToolbar from './FloatingToolbar'

const isDragKeyPressed = (e: KeyboardEvent | MouseEvent | WheelEvent) => {
  return e.ctrlKey || e.metaKey
}

const Workspace: React.FC = () => {
  const workspaceRef = useRef<HTMLDivElement>(null)
  const [isDragKeyHeld, setIsDragKeyHeld] = useState(false)
  const {
    zoom,
    pan,
    isDragging,
    lastPanPosition,
    setZoom,
    updatePan,
    setIsDragging,
    setLastPanPosition,
    selectLayer
  } = useWorkspaceStore()

  useEffect(() => {
    const workspace = workspaceRef.current
    if (!workspace) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      if (isDragKeyPressed(e)) {
        const zoomChange = zoom + e.deltaY * -0.005
        setZoom(zoomChange)
      } else {
        updatePan(-e.deltaX, -e.deltaY)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Meta' || e.key === 'Control') {
        setIsDragKeyHeld(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Meta' || e.key === 'Control') {
        setIsDragKeyHeld(false)
        setIsDragging(false)
      }
    }

    workspace.addEventListener('wheel', handleWheel, { passive: false })
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      workspace.removeEventListener('wheel', handleWheel)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [zoom, pan, isDragging, lastPanPosition, setZoom, updatePan, setIsDragging, setLastPanPosition])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isDragKeyPressed(e.nativeEvent)) {
      e.preventDefault()
      setIsDragging(true)
      setLastPanPosition({ x: e.clientX, y: e.clientY })
    } else {
      selectLayer(null)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && isDragKeyPressed(e.nativeEvent)) {
      e.preventDefault()
      const deltaX = e.clientX - lastPanPosition.x
      const deltaY = e.clientY - lastPanPosition.y
      updatePan(deltaX, deltaY)
      setLastPanPosition({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div
      ref={workspaceRef}
      className={`w-full h-screen bg-black overflow-hidden ${isDragKeyHeld ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
      style={{ userSelect: 'none' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="relative"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
      >
        <Canvas />
      </div>
      <FloatingToolbar />
    </div>
  )
}

export default Workspace
