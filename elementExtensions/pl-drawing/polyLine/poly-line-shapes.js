/**
 * Creates a new Fabricjs Circle
 * @param {JSON Object} options Element Data
 * @param {List} coordinates 2D coordinates [x,y]
 * @returns {Fabricjs Circle}
 */
PolyLineHelper.createCircle = function (options, coordinates = [0, 0], fill = 'black') {
  const circle = new fabric.Circle({
    left: coordinates[0],
    top: coordinates[1],
    strokeWidth: 3,
    radius: 1,
    fill: '#03a5fc',
    stroke: '#03a5fc',
    originX: 'center',
    originY: 'center',
    padding: 15,
    id: options.id,
    tag: 'pl-poly-line'
  })

  // Disables borders
  circle.hasControls = circle.hasBorders = false
  circle.split = false
  circle.submittedAnswer = options.submittedAnswer

  if ('keyID' in options) {
    circle.keyID = options.keyID
  }

  PolyLineHelper.attachMovementHandler(options, circle)
  PolyLineHelper.attachDeleteHandler(circle)

  if (options.gridSize !== 0) {
    circle.on('moving', function (event) {
      PolyLineHelper.snapToGrid(circle, options.gridSize)
    })
  }

  circle.type = 'circle'

  return circle
}

/**
 * Creates a new Fabricjs Line
 * @param {JSON Object} options Element Data
 * @param {List} coordinates 2D coordinates [x,y]
 * @param {Boolean} dashed dashed or normal line
 * @returns {Fabricjs Circle}
 */
PolyLineHelper.createLine = function (options, coordinates, dashed = false) {
  const line = new fabric.Line(coordinates, {
    fill: 'black',
    stroke: 'black',
    strokeWidth: 2,
    originX: 'center',
    originY: 'center',
    line: true,
    selectable: true,
    hoverCursor: 'context-menu',
    id: options.id
  })

  // Disables borders
  line.hasControls = false
  line.hoverCursor = 'grabbing'

  // Add dashed attribute
  if (options.dashed) {
    line.strokeDashArray = [3, 3]
  }

  line.on('mouseover', function (_event) {
    PolyLineHelper.highlightLine(line.id)
    PolyLineHelper.canvas.renderAll()
  })

  line.on('mouseout', function (_event) {
    PolyLineHelper.removeLineHighlight(line.id)
    PolyLineHelper.canvas.renderAll()
  })

  PolyLineHelper.attachLineSelectionHandler(options, line)
  line.fire('selected')

  return line
}

/**
 * Creates a new diamond object
 * @param {List} coordinates 2D coordinates [x,y]
 * @param {Float} height height of diamond
 * @param {Float} width width of diamond
 * @returns {Fabricjs Poly}
 */
PolyLineHelper.createDiamond = function (options, coordinates, fill = 'white', height = 30, width = 20) {
  const diamond = new fabric.Polyline([
    { x: coordinates[0] + width / 2, y: coordinates[1] + height },
    { x: coordinates[0] + width, y: coordinates[1] + height / 2 },
    { x: coordinates[0] + width / 2, y: coordinates[1] },
    { x: coordinates[0], y: coordinates[1] + height / 2 },
    { x: coordinates[0] + width / 2, y: coordinates[1] + height }],
  {
    fill: fill,
    originX: 'center',
    stroke: 'black',
    strokeWidth: 3.5,
    id: this.id
  })

  // Disables scaling
  diamond.lockScalingX = true
  diamond.lockScalingY = true

  // Removes lines
  diamond.hasBorders = diamond.hasControls = true

  PolyLineHelper.attachMovementHandler(options, diamond)

  diamond.type = 'polygon'

  return diamond
}

/**
 * Creates a new triangle object
 * @param {List} coordinates 2D coordinates [x,y]
 * @param {Float} height height of diamond
 * @param {Float} width width of diamond
 * @returns {Fabricjs Polyline}
 */
PolyLineHelper.createTriangle = function (options, coordinates, fill = 'black', height = 15, width = 20) {
  const triangle = new fabric.Polyline([
    {
      x: coordinates[0], y: coordinates[1] + height
    },
    {
      x: coordinates[0] + width / 2, y: coordinates[1]
    },
    {
      x: coordinates[0] + width, y: coordinates[1] + height
    },
    {
      x: coordinates[0], y: coordinates[1] + height
    }
  ],
  {
    left: coordinates[0],
    top: coordinates[1],
    originX: 'center',
    stroke: 'black',
    strokeWidth: 2,
    fill: fill,
    id: this.id
  })

  triangle.type = 'triangle'
  triangle.hasBorders = triangle.hasControls = true

  PolyLineHelper.attachMovementHandler(options, triangle)

  return triangle
}

/**
 * Creates a new arrow object
 * @param {List} coordinates 2D coordinates [x,y]
 * @param {Float} height height of diamond
 * @param {Float} width width of diamond
 * @returns {Fabricjs Poly}
 */
PolyLineHelper.createArrowHead = function (options, coordinates, fill = '', height = 15, width = 20) {
  const arrowHead = new fabric.Polyline([
    {
      x: coordinates[0], y: coordinates[1] + height
    },
    {
      x: coordinates[0] + width / 2, y: coordinates[1]
    },
    {
      x: coordinates[0] + width, y: coordinates[1] + height
    }
  ],
  {
    left: coordinates[0],
    top: coordinates[1],
    fill: fill,
    originX: 'center',
    stroke: 'black',
    strokeWidth: 2,
    id: this.id
  })

  PolyLineHelper.attachMovementHandler(options, arrowHead)
  PolyLineHelper.rotationHandler(arrowHead)

  arrowHead.type = 'polyline'
  arrowHead.hasBorders = arrowHead.hasControls = false

  return arrowHead
}

PolyLineHelper.shapeFnc = {
  diamond: PolyLineHelper.createDiamond,
  circle: PolyLineHelper.createCircle,
  arrow: PolyLineHelper.createArrowHead,
  triangle: PolyLineHelper.createTriangle
}