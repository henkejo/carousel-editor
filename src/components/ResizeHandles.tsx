import classNames from 'classnames'
import React from 'react'

type ResizeHandle = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

interface ResizeHandlesProps {
  onResize: (handle: ResizeHandle) => (e: React.MouseEvent) => void
}

interface ResizeHandleConfig {
  handle: ResizeHandle
  cursor: string
  position: string
}

const handleConfigs: ResizeHandleConfig[] = [
  { handle: 'top-left', cursor: 'cursor-nw-resize', position: '-left-1.5 -top-1.5' },
  { handle: 'top-right', cursor: 'cursor-ne-resize', position: '-right-1.5 -top-1.5' },
  { handle: 'bottom-left', cursor: 'cursor-sw-resize', position: '-left-1.5 -bottom-1.5' },
  { handle: 'bottom-right', cursor: 'cursor-se-resize', position: '-right-1.5 -bottom-1.5' }
]

const ResizeHandles: React.FC<ResizeHandlesProps> = ({ onResize }) => {
  return (
    <>
      {handleConfigs.map(({ handle, cursor, position }) => (
        <div
          key={handle}
          className={classNames(
            `absolute w-3 h-3 bg-white rounded-full ${cursor} ${position}`,
            'drop-shadow-xl'
        )}
          onMouseDown={onResize(handle)}
        />
      ))}
    </>
  )
}

export default ResizeHandles
