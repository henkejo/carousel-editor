import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart, Star } from 'lucide-react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="bg-card p-8 rounded-lg shadow-lg border">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Hello World
        </h1>
        <div className="flex gap-4 items-center">
          <Button onClick={() => setCount(count + 1)}>
            <Star className="w-4 h-4 mr-2" />
            Count: {count}
          </Button>
          <Button variant="outline">
            <Heart className="w-4 h-4 mr-2" />
            Like
          </Button>
        </div>
      </div>
    </div>
  )
}

export default App
