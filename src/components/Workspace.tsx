import React, { useRef, useEffect, useState } from 'react'
import { useWorkspaceStore } from '@/store/workspaceStore'
import Canvas from './Canvas'

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
    setLastPanPosition
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

    const handleMouseDown = (e: MouseEvent) => {
      if (isDragKeyPressed(e)) {
        e.preventDefault()
        setIsDragging(true)
        setLastPanPosition({ x: e.clientX, y: e.clientY })
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && isDragKeyPressed(e)) {
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

    workspace.addEventListener('wheel', handleWheel, { passive: false })
    workspace.addEventListener('mousedown', handleMouseDown)
    workspace.addEventListener('mousemove', handleMouseMove)
    workspace.addEventListener('mouseup', handleMouseUp)
    workspace.addEventListener('mouseleave', handleMouseUp)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      workspace.removeEventListener('wheel', handleWheel)
      workspace.removeEventListener('mousedown', handleMouseDown)
      workspace.removeEventListener('mousemove', handleMouseMove)
      workspace.removeEventListener('mouseup', handleMouseUp)
      workspace.removeEventListener('mouseleave', handleMouseUp)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [zoom, pan, isDragging, lastPanPosition, setZoom, updatePan, setIsDragging, setLastPanPosition])

  return (
    <div
      ref={workspaceRef}
      className={`w-full h-screen bg-black overflow-hidden ${isDragKeyHeld ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
      style={{ userSelect: 'none' }}
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
    </div>
  )
}

export default Workspace
