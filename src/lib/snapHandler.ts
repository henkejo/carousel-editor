interface SnapRule {
  threshold: number
  enabled: boolean
}

interface SnapConfig {
  canvas: SnapRule
  layers: SnapRule
}

interface Layer {
  id: string
  position: { x: number; y: number }
  width: number
  height: number
}

interface SnapResult {
  position: { x: number; y: number }
  snapped: boolean
  snapType?: 'canvas' | 'layer'
}

export class SnapHandler {
  private config: SnapConfig

  constructor(config?: Partial<SnapConfig>) {
    this.config = {
      canvas: { threshold: 10, enabled: true },
      layers: { threshold: 10, enabled: true },
      ...config
    }
  }

  updateConfig(config: Partial<SnapConfig>) {
    this.config = { ...this.config, ...config }
  }

  snap(
    layerId: string,
    newPosition: { x: number; y: number },
    newSize: { width: number; height: number },
    allLayers: Layer[],
    canvasSize: number = 384
  ): SnapResult {
    const currentLayer = allLayers.find(l => l.id === layerId)
    if (!currentLayer) {
      return { position: newPosition, snapped: false }
    }

    let snappedPosition = { ...newPosition }
    let snapped = false
    let snapType: 'canvas' | 'layer' | undefined

    if (this.config.canvas.enabled) {
      const canvasResult = this.snapToCanvas(snappedPosition, newSize, canvasSize)
      if (canvasResult.snapped) {
        snappedPosition = canvasResult.position
        snapped = true
        snapType = 'canvas'
      }
    }

    if (this.config.layers.enabled) {
      const layerResult = this.snapToLayers(layerId, snappedPosition, newSize, allLayers)
      if (layerResult.snapped) {
        snappedPosition = layerResult.position
        snapped = true
        snapType = 'layer'
      }
    }

    return { position: snappedPosition, snapped, snapType }
  }

  private snapToCanvas(
    position: { x: number; y: number },
    size: { width: number; height: number },
    canvasSize: number
  ): SnapResult {
    const { threshold } = this.config.canvas
    let snappedX = position.x
    let snappedY = position.y
    let snapped = false

    const layerLeft = position.x
    const layerRight = position.x + size.width
    const layerTop = position.y
    const layerBottom = position.y + size.height

    const canvasLeft = 0
    const canvasRight = canvasSize
    const canvasTop = 0
    const canvasBottom = canvasSize

    if (Math.abs(layerLeft - canvasLeft) <= threshold) {
      snappedX = canvasLeft
      snapped = true
    } else if (Math.abs(layerRight - canvasRight) <= threshold) {
      snappedX = canvasRight - size.width
      snapped = true
    } else if (Math.abs(layerLeft - canvasRight) <= threshold) {
      snappedX = canvasRight
      snapped = true
    } else if (Math.abs(layerRight - canvasLeft) <= threshold) {
      snappedX = canvasLeft - size.width
      snapped = true
    }

    if (Math.abs(layerTop - canvasTop) <= threshold) {
      snappedY = canvasTop
      snapped = true
    } else if (Math.abs(layerBottom - canvasBottom) <= threshold) {
      snappedY = canvasBottom - size.height
      snapped = true
    } else if (Math.abs(layerTop - canvasBottom) <= threshold) {
      snappedY = canvasBottom
      snapped = true
    } else if (Math.abs(layerBottom - canvasTop) <= threshold) {
      snappedY = canvasTop - size.height
      snapped = true
    }

    return { position: { x: snappedX, y: snappedY }, snapped }
  }

  private snapToLayers(
    layerId: string,
    position: { x: number; y: number },
    size: { width: number; height: number },
    allLayers: Layer[]
  ): SnapResult {
    const { threshold } = this.config.layers
    let snappedX = position.x
    let snappedY = position.y
    let snapped = false

    const layerLeft = position.x
    const layerRight = position.x + size.width
    const layerTop = position.y
    const layerBottom = position.y + size.height

    const otherLayers = allLayers.filter(l => l.id !== layerId)

    for (const otherLayer of otherLayers) {
      const otherLeft = otherLayer.position.x
      const otherRight = otherLayer.position.x + otherLayer.width
      const otherTop = otherLayer.position.y
      const otherBottom = otherLayer.position.y + otherLayer.height

      if (Math.abs(layerLeft - otherLeft) <= threshold) {
        snappedX = otherLeft
        snapped = true
      } else if (Math.abs(layerRight - otherRight) <= threshold) {
        snappedX = otherRight - size.width
        snapped = true
      } else if (Math.abs(layerLeft - otherRight) <= threshold) {
        snappedX = otherRight
        snapped = true
      } else if (Math.abs(layerRight - otherLeft) <= threshold) {
        snappedX = otherLeft - size.width
        snapped = true
      }

      if (Math.abs(layerTop - otherTop) <= threshold) {
        snappedY = otherTop
        snapped = true
      } else if (Math.abs(layerBottom - otherBottom) <= threshold) {
        snappedY = otherBottom - size.height
        snapped = true
      } else if (Math.abs(layerTop - otherBottom) <= threshold) {
        snappedY = otherBottom
        snapped = true
      } else if (Math.abs(layerBottom - otherTop) <= threshold) {
        snappedY = otherTop - size.height
        snapped = true
      }
    }

    return { position: { x: snappedX, y: snappedY }, snapped }
  }

}

export const defaultSnapHandler = new SnapHandler()
