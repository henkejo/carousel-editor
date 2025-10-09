import React, { useRef } from 'react'
import { CirclePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import classNames from 'classnames'
import { useWorkspaceStore } from '@/store/workspaceStore'

const FloatingToolbar: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addLayer = useWorkspaceStore(state => state.addLayer)

  const handleAdd = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      if (!url) return

      addLayer({
        type: 'image',
        url,
        position: { x: 0, y: 0 },
        rotation: 0,
        width: 200,
        height: 200,
        crop: { x: 0, y: 0, width: 0, height: 0 }
      })
    }
    reader.readAsDataURL(file)

    e.target.value = ''
  }

  return (
    <div className={classNames(
      "fixed bottom-6 left-1/2 transform -translate-x-1/2",
      "z-50 animate-[slideUp_0.3s_ease-out]"
    )}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className={classNames(
        "bg-card backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg border"
      )}>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleAdd}
            className={classNames(
              "flex flex-col justify-center p-2 text-white transition-all",
              "hover:bg-gray-700/50 hover:text-white h-auto"
            )}
          >
            <CirclePlus className='!w-8 !h-8'/>
            <span className="text-xs font-medium">Add</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FloatingToolbar
