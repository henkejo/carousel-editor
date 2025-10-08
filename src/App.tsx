import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Star } from 'lucide-react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-white w-48 h-48">
      </div>
    </div>
  )
}

export default App
