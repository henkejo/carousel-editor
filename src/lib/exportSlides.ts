interface Layer {
  id: string
  type: 'image'
  url: string
  position: { x: number; y: number }
  rotation: number
  width: number
  height: number
  crop: { x: number; y: number; width: number; height: number }
}

interface Slide {
  id: string
  position: { x: number; y: number }
  width: number
  height: number
}

function isLayerInSlide(layer: Layer, slide: Slide): boolean {
  const layerRight = layer.position.x + layer.width
  const layerBottom = layer.position.y + layer.height
  const slideRight = slide.position.x + slide.width
  const slideBottom = slide.position.y + slide.height

  return (
    layer.position.x < slideRight &&
    layerRight > slide.position.x &&
    layer.position.y < slideBottom &&
    layerBottom > slide.position.y
  )
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

async function renderSlideToCanvas(
  slide: Slide,
  layers: Layer[],
  scale: number = 4
): Promise<HTMLCanvasElement | null> {
  const slideLayers = layers.filter(layer => isLayerInSlide(layer, slide))

  const canvas = document.createElement('canvas')
  canvas.width = slide.width * scale
  canvas.height = slide.height * scale
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  ctx.scale(scale, scale)

  const relativePosition = (layerPos: { x: number; y: number }) => ({
    x: layerPos.x - slide.position.x,
    y: layerPos.y - slide.position.y
  })

  for (const layer of slideLayers) {
    try {
      const img = await loadImage(layer.url)
      const relPos = relativePosition(layer.position)
      const centerX = relPos.x + layer.width / 2
      const centerY = relPos.y + layer.height / 2

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate((layer.rotation * Math.PI) / 180)

      const hasCrop = layer.crop.width > 0 && layer.crop.height > 0
      const sourceX = hasCrop ? layer.crop.x : 0
      const sourceY = hasCrop ? layer.crop.y : 0
      const sourceWidth = hasCrop ? layer.crop.width : img.width
      const sourceHeight = hasCrop ? layer.crop.height : img.height

      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceWidth,
        sourceHeight,
        -layer.width / 2,
        -layer.height / 2,
        layer.width,
        layer.height
      )

      ctx.restore()
    } catch (error) {
      console.error(`Failed to load image for layer ${layer.id}:`, error)
    }
  }

  return canvas
}

export async function exportAllSlidesAsPNG(
  slides: Slide[],
  layers: Layer[]
): Promise<void> {
  const JSZip = (await import('jszip')).default
  const zip = new JSZip()

  for (let i = 0; i < slides.length; i++) {
    const canvas = await renderSlideToCanvas(slides[i], layers, 4)
    if (!canvas) continue

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/png', 1.0)
    })

    if (blob) {
      zip.file(`slide-${i + 1}.png`, blob)
    }
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(zipBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'slides.zip'
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 1000)
}