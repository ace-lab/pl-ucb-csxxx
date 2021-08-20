class canvasHelper {
  static isCanvasInteractable (canvas) {
    return typeof canvas._onDrag === 'function'
  }

  static preformOnStaticCanvas (elementObject, staticCanvas, func) {
    const interactiveCanvas = elementObject.canvas
    elementObject.canvas = staticCanvas
    func()
    elementObject.canvas = interactiveCanvas
  }
}
