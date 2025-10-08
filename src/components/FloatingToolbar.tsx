import React from 'react'
import { CirclePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import classNames from 'classnames'

const FloatingToolbar: React.FC = () => {
  const handleAdd = () => {
    console.log('Add button clicked')
  }

  return (
    <div className={classNames(
      "fixed bottom-6 left-1/2 transform -translate-x-1/2",
      "z-50 animate-[slideUp_0.3s_ease-out]"
    )}>
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
            <CirclePlus className='!w-9 !h-9'/>
            <span className="text-xs font-medium">Add</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default FloatingToolbar
