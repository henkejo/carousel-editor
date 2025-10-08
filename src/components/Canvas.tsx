import React from 'react'
import { useWorkspaceStore } from '@/store/workspaceStore'
import SelectableLayer from './SelectableLayer'

const Canvas: React.FC = () => {
  const layers = useWorkspaceStore(state => state.layers)

  return (
    <div 
      className="bg-white w-96 h-96 shadow-lg relative"
    >
      {layers.map(layer => (
        <SelectableLayer
          key={layer.id}
          id={layer.id}
          url={layer.url}
          position={layer.position}
          rotation={layer.rotation}
          scale={layer.scale}
          crop={layer.crop}
        />
      ))}
    </div>
  )
}

export default Canvas
