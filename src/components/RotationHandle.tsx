import React from 'react'

interface RotationHandleProps {
  onRotate: (e: React.MouseEvent) => void
}

const RotationHandle: React.FC<RotationHandleProps> = ({ onRotate }) => {
  return (
    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
      <div className="relative">
        <div className="w-px h-6 bg-white drop-shadow-lg"></div>
        <div
          className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rounded-full cursor-grab drop-shadow-xl hover:bg-gray-100"
          onMouseDown={onRotate}
        />
      </div>
    </div>
  )
}

export default RotationHandle
