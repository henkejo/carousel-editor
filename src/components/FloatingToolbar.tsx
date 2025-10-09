import React, { useRef } from 'react'
import { CirclePlus, CopyPlus, X, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import classNames from 'classnames'
import { useWorkspaceStore } from '@/store/workspaceStore'

const FloatingToolbar: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addLayer = useWorkspaceStore(state => state.addLayer)
  const addSlide = useWorkspaceStore(state => state.addSlide)
  const minimiseToolbar = useWorkspaceStore(state => state.minimiseToolbar)
  const minimisedToolbar = useWorkspaceStore(state => state.minimisedToolbar)

  const handleAddLayer = () => {
    fileInputRef.current?.click()
  }

  const handleAddSlide = () => {
    addSlide()
  }

  const handleMinimiseToolbar = () => {
    minimiseToolbar()
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
        crop: { x: 0, y: 0, width: 0, height: 0 },
        slideId: 'default-slide'
      })
    }
    reader.readAsDataURL(file)

    e.target.value = ''
  }

  return (
    <>
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
        {/* Expanded Toolbar */}
        <div className={classNames(
          "bg-card backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border transition-all duration-300 ease-in-out",
          minimisedToolbar ? "opacity-0 scale-95 translate-y-4 pointer-events-none" : "opacity-100 scale-100 translate-y-0"
        )}>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={handleAddLayer}
              className={classNames(
                "flex flex-col justify-center p-2 text-white transition-all",
                "hover:bg-gray-700/50 hover:text-white h-auto"
              )}
            >
              <CirclePlus className='!w-8 !h-8'/>
              <span className="text-xs font-medium">Add layer</span>
            </Button>
            <Button
              variant="ghost"
              onClick={handleAddSlide}
              className={classNames(
                "flex flex-col justify-center p-2 text-white transition-all",
                "hover:bg-gray-700/50 hover:text-white h-auto"
              )}
            >
              <CopyPlus className='!w-8 !h-8'/>
              <span className="text-xs font-medium">Add slide</span>
            </Button>
            <Button
              variant="ghost"
              onClick={handleMinimiseToolbar}
              className={classNames(
                "flex flex-col justify-center p-2 text-white transition-all",
                "hover:bg-gray-700/50 hover:text-white h-auto rounded-full"
              )}
            >
              <X className='!w-8 !h-8 !text-gray-200'/>
            </Button>
          </div>
        </div>
      </div>

      {/* Minimized Toolbar */}
      <div className={classNames(
        "fixed bottom-0 left-1/2 transform -translate-x-1/2",
        "z-50 animate-[slideUp_0.3s_ease-out]"
      )}>
        <div className={classNames(
          "transition-all duration-300 ease-in-out",
          minimisedToolbar
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none rounded-full"
        )}>
          <Button
            variant="ghost"
            onClick={handleMinimiseToolbar}
            className={classNames(
              "w-16 h-8 bg-card backdrop-blur-sm shadow-lg border rounded-t-full",
              "flex items-center justify-center text-white transition-all",
              "hover:bg-gray-700/50 hover:text-white"
            )}
          >
            <ChevronUp className='!w-6 !h-6 !text-gray-200'/>
          </Button>
        </div>
      </div>
    </>
  )
}

export default FloatingToolbar
