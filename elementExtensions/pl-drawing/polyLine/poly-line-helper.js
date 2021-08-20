class PolyLineHelper {
  /**
   * Generates a UML Line element
   * @param  {Canvas Object} canvas Fabricjs Canvas Object
   * @param  {JSON Object} options contains attribute information
   * @param  {JSON Object} submittedAnswer submitted answer info
   */
  static generateBaseLine (_canvas, options, submittedAnswer, _attributes) {
    const subObj = Object.assign({}, options)

    subObj.lineType = options.lineType
    subObj.end1 = null
    subObj.head = subObj.end1
    subObj.end2 = null
    subObj.gridSize = options.gridSize
    PolyLineHelper.generateLine(subObj)

    console.log(PolyLineHelper)

    return subObj
  }
};

/**
 * Generates a segmented line given position of verticies
 * @param {JSON Object} options contains attribute information
 */
PolyLineHelper.generateLine = function (options) {
  // Options.nodes is a list of positions in the form {left: x, top: y}
  const nodes = options.nodes

  // Init all fabricJS Circles from positions
  let i = 0
  let currentNode = null

  const listOfNodes = []
  for (i; i < nodes.length; i++) {
    currentNode = nodes[i]
    const circle = PolyLineHelper.createCircle(options, [currentNode.left, currentNode.top])
    listOfNodes.push(circle)
  }

  // Set end nodes with end attributes
  options.end1 = listOfNodes[0]
  options.end1.prev = null
  options.end1.objectSnapped = null
  options.end1.side = 0
  options.end1.options = options
  PolyLineHelper.applyDefaultOptions(options, options.end1)

  options.end2 = listOfNodes[listOfNodes.length - 1]
  options.end2.next = null
  options.end2.objectSnapped = null
  options.end2.side = 1
  options.end2.options = options
  PolyLineHelper.applyDefaultOptions(options, options.end2)

  if ('keyIDs' in options) {
    options.end1.keyID = options.keyIDs[0]
    options.end2.keyID = options.keyIDs[1]
  }

  const endpoints = [options.end1, options.end2]

  if (options.snapData !== undefined) {
    for (let i = 0; i < options.snapData.length; i++) {
      if (options.snapData[i] !== null) {
        PolyLineHelper.loadSnappingAttributes(options, endpoints[i], i)
      } else {
        PolyLineHelper.applyDefaultSnappingAttributes(options, endpoints[i])
      }
    }
  } else {
    PolyLineHelper.applyDefaultSnappingAttributes(options, options.end1)
    PolyLineHelper.applyDefaultSnappingAttributes(options, options.end2)
  }

  // Connect nodes and draw a line inbetween them
  this.canvas.add(options.end1)
  for (let i = 1; i < listOfNodes.length; i++) {
    const currentNode = listOfNodes[i]
    currentNode.prev = listOfNodes[i - 1]
    currentNode.next = listOfNodes[i + 1]
    currentNode.split = true
    PolyLineHelper.drawSplitableLine(options, currentNode.prev, currentNode)
    this.canvas.add(currentNode)
  }

  // Add the head of the list to the answer object
  options.head = options.end1
}

/**
 * Updates the current answer state
 */
PolyLineHelper.updateAnswerState = function (options) {
  let node = options.end1
  let answerObject = options
  if (answerObject === null) { answerObject = {} }
  const listOfNodes = []

  // Loop through edges only
  while (node.next != null) {
    // Update coordinates
    node.setCoords()
    // Push coordinates to list
    listOfNodes.push({ left: node.left, top: node.top })

    node = node.next.next
  }

  // Add the end node to the list
  listOfNodes.push({ left: node.left, top: node.top })

  answerObject.nodes = listOfNodes
  answerObject.snapData = [options.end1.objectSnapped, options.end2.objectSnapped]
  answerObject.snappingPointIndexies = [
    options.end1.snappingPointIndex,
    options.end2.snappingPointIndex
  ]
  answerObject.constraintIds = [options.end1.constraintId, options.end2.constraintId]
  answerObject.angle = options.end2.angle

  this.submittedAnswer.updateObject(answerObject)
}

/**
 * Inserts a new line when a node is split
 * @param {JSON Object} options Element Data
 * @param {Fabricjs Circle} node middle node
 */
PolyLineHelper.insertNewLine = function (options, node) {
  const prevNode = node.prev
  const nextNode = node.next

  // Create two middle nodes
  const newCircle1 = PolyLineHelper.createCircle(options, PolyLineHelper.getMidPoint(prevNode, node))
  const newCircle2 = PolyLineHelper.createCircle(options, PolyLineHelper.getMidPoint(node, nextNode))

  // Register new middle nodes
  PolyLineHelper.registerMidPoint(newCircle1, prevNode, node)
  PolyLineHelper.registerMidPoint(newCircle2, node, nextNode)

  // Move the init line to end at the midpoint
  prevNode.nextLine.set({ x2: node.left, y2: node.top })

  const lineTransform = PolyLineHelper.lineTransforms[nextNode.type](nextNode)

  // Create new line at midpoint to the right end
  const newLine = PolyLineHelper.createLine(options, [node.left, node.top, lineTransform[0], lineTransform[1]])

  // Register the new line with the right end
  nextNode.prevLine = newLine

  // Register both lines with the midpoint
  node.prevLine = prevNode.nextLine
  node.nextLine = newLine

  // Add a tag identifying that this node has already been split
  node.split = true

  // Add everything to the canvas
  this.canvas.add(newLine, newCircle1, newCircle2)

  // If the next node is an end then replace the old movement handlers
  // Applies only to next node since a new line is used for this node
  if (nextNode.isEnd) {
    PolyLineHelper.replaceLineRotationHandler(node.prevLine, newLine)
  }
}

/**
 * Replaces any 'moving' events from one line to another
 * CLEARS any existing 'moving' handlers on the old line
 * @param {FabricJs Line} oldLine line with 'moving' handlers
 * @param {FabricJs Line} newLine line receiving the movement handlers
 */
PolyLineHelper.replaceLineRotationHandler = function (oldLine, newLine) {
  const movementHandlers = oldLine.__eventListeners.moving

  // Clear the old event listeners
  oldLine.__eventListeners.moving = []

  // If the line does not have event handlers
  if (newLine.__eventListeners === undefined) {
    newLine.__eventListeners = {}
  }

  // Place them on the new line
  newLine.__eventListeners.moving = movementHandlers
}

/**
 * Draws a new line that can be split, includes middle circle
 * @param {JSON Object} options Element Data
 * @param {Fabricjs Circle} node1 End 1
 * @param {Fabricjs Circle} node2 End 2
 */
PolyLineHelper.drawSplitableLine = function (options, node1, node2) {
  // Create a new circle at the midpoint of the two nodes
  const newMidCircle = PolyLineHelper.createCircle(options, PolyLineHelper.getMidPoint(node1, node2))
  PolyLineHelper.registerMidPoint(newMidCircle, node1, node2)

  // Create a new line from the end of one node to the next
  const newLine = PolyLineHelper.createLine(options, [
    node1.left,
    node1.top,
    node2.left,
    node2.top
  ])

  // Register new line
  node1.nextLine = newLine
  node2.prevLine = newLine

  // Add both objects to the canvas, line first
  this.canvas.add(newLine, newMidCircle)
}

/**
 * Registers mid node with previous and next nodes
 * @param {Fabricjs Circle} node middle node
 * @param {Fabricjs Circle} prev to be previous node
 * @param {Fabricjs Circle} next to be next node
 */
PolyLineHelper.registerMidPoint = function (node, prev, next) {
  node.prev = prev
  node.next = next
  next.prev = node
  prev.next = node
}

/**
 * Gets the middle coordinates between two circles
 * @param {Fabricjs Circle} c1
 * @param {Fabricjs Circle} c2
 * @returns {List} 2D coordinates [x,y]
 */
PolyLineHelper.getMidPoint = function (c1, c2) {
  return [
    (c1.left + c2.left) / 2,
    (c1.top + c2.top) / 2
  ]
}

/**
 * Moves previous line to nodes position
 * @param {Fabricjs Line} line line to be updated
 * @param {Fabricjs Circle} node
 */
PolyLineHelper.movePrevLine = function (line, node, fireMovementHandler = false) {
  const lineTransform = PolyLineHelper.lineTransforms[node.type](node)
  line.set({ x2: lineTransform[0], y2: lineTransform[1] })
  line.setCoords()
  if (fireMovementHandler) {
    line.fire('moving')
  }
}

/**
 * Moves next line to nodes position
 * @param {Fabricjs Line} line line to be updated
 * @param {Fabricjs Circle} node
 */
PolyLineHelper.moveNextLine = function (line, node, fireMovementHandler = false) {
  const lineTransform = PolyLineHelper.lineTransforms[node.type](node)
  line.set({ x1: lineTransform[0], y1: lineTransform[1] })
  line.setCoords()
  if (fireMovementHandler) {
    line.fire('moving')
  }
}

/**
 * Moves middle node based on previous and nexts nodes position
 * @param {Fabricjs Circle} node
 */
PolyLineHelper.moveNode = function (node, next = true) {
  let lineTransform
  const otherNode = next ? node.prev : node.next
  if (next) {
    lineTransform = PolyLineHelper.lineTransforms[node.next.type](node.next)
  } else {
    lineTransform = PolyLineHelper.lineTransforms[node.prev.type](node.prev)
  }
  const mid = PolyLineHelper.getMidPoint(
    { left: lineTransform[0], top: lineTransform[1] },
    otherNode
  )
  node.left = mid[0]
  node.top = mid[1]
  node.setCoords()
}

/**
 * Moves the line of an endpoint
 * @param {JSON Object} options Element Data
 * @param {Fabricjs Circle} endpoint Fabric JS Circle
 */
PolyLineHelper.moveEndpoints = function (options, endpoint) {
  if (endpoint === options.end1) {
    PolyLineHelper.moveNextLine(endpoint.nextLine, endpoint)
  } else if (endpoint === options.end2) {
    PolyLineHelper.movePrevLine(endpoint.prevLine, endpoint)
  }
}

/**
 * Reorders the drawing order, so circles are drawn over lines.
 * @param {JSON Object} options Element Data
 */
PolyLineHelper.moveNodesToFront = function (options) {
  let node = options.head
  // Loop through each circle
  while (node.next != null) {
    // Update coordinates
    node.setCoords()
    // Bring node to front
    this.canvas.bringToFront(node)

    node = node.next
  }

  this.canvas.bringToFront(node)
}

/**
 * Gets an endpoint object given a lineId and side
 * @param {Int} lineId Id of the line
 * @param {Int} side Side of the endpoint
 * @returns FabricJS Circle (endpoint)
 */
PolyLineHelper.getEndpointById = function (lineId, side) {
  if (PolyLine.instances === undefined) {
    return undefined
  }
  try {
    return PolyLine.instances[parseInt(lineId)][side]
  } catch (err) {
    return undefined
  }
}

/**
 * Applies default attributes
 * @param {JSON Object} options contains attribute information
 * @param {Fabricjs Circle} node Fabric JS Circle
 */
PolyLineHelper.applyDefaultOptions = function (_options, node) {
  node.isEnd = true
  node.tag = 'pl-poly-line'
}

/**
 * Loads snapping attributes from submitted answer data
 * @param {JSON Object} options contains attribute information
 * @param {Fabricjs Circle} node Fabric JS Circle
 * @param {Int} side Side of the endpoint
 */
PolyLineHelper.loadSnappingAttributes = function (options, node, side) {
  node.objectSnapped = options.snapData[side]
  if (node.objectSnapped !== null) {
    node.snappingPointIndex = options.snappingPointIndexies[side]
    node.constraintId = options.constraintIds[side]
  }
}

/**
 * Applies default snapping attributes
 * @param {JSON Object} options contains attribute information
 * @param {Fabricjs Circle} node Fabric JS Circle
 */
PolyLineHelper.applyDefaultSnappingAttributes = function (_options, node) {
  node.objectSnapped = null
  node.snappingPointIndexies = null
  node.constraintId = null
}

/**
 * Gets linesnappable object given id
 * @param {Int} objectId
 * @returns {Fabricjs Object}
 */
PolyLineHelper.getObjectOnCanvasById = function (objectId) {

  PolyLineHelper.findLineSnappableObjects()

  for (var i = 0; i < PolyLineHelper.lineSnappableObjects.length; i++) {
    const object = PolyLineHelper.lineSnappableObjects[i]
    if (objectId === object.id) {
      return object
    }
  }
}

/**
 * Removes a constraint from a line given id and side
 * @param {Int} lineId id of line
 * @param {Int} side side of endpoint
 */
PolyLineHelper.removeConstraint = function (lineId, side) {
  try {
    const constraint = Constraint.getConstraintById(PolyLine.instances[lineId][side].constraintId)
    constraint.snapData = null
    constraint.snappingPointIndex = null
    Constraint.updateAnswerState(constraint)
    PolyLine.instances[lineId][side].constraintId = null
  } catch (err) {
  }
}

/**
 * Peforms the actions needed for deletion
 * @param {Int} lineId id of line
 */
PolyLineHelper.delete = function (lineId) {
  // unsnap everything
  for (let i = 0; i < 2; i++) {
    PolyLineHelper.removeConstraint(lineId, i)
    const endpoint = PolyLineHelper.getEndpointById(lineId, i)
    if (endpoint.objectSnapped !== undefined || endpoint.objectSnapped !== null) {
      const snappedObject = PolyLineHelper.getObjectOnCanvasById(endpoint.objectSnapped)
      if (snappedObject !== undefined) {
        snappedObject.removeSnappedEndpoints(snappedObject, [lineId], [i])
      }
    }
  }

  // Remove from canvas and submitted answers
  PolyLineHelper.canvas.getObjects().forEach(object => {
    if (object.id === lineId) {
      PolyLineHelper.canvas.remove(object)
    }
  })

  delete PolyLine.instances[lineId]

  PolyLineHelper.submittedAnswer.deleteObject(lineId)
  PolyLineHelper.canvas.renderAll()
}

/**
 * Applies an angle to node given two points
 * @param {Fabricjs Object} node
 * @param {JSON Object} p1 point
 * @param {JSON Object} p2 point
 */
PolyLineHelper.applyLineAngle = function (node, p1, p2) {
  const angleOfLine = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI
  node.angle = angleOfLine + 90
}

/**
 * Attaches deletion handler
 * @param {Fabricjs Object} node
 */
PolyLineHelper.attachDeleteHandler = function (node) {
  node.on('removed', function (event) {
    PolyLineHelper.delete(node.id)
  })
}

PolyLineHelper.highlightLine = function (lineId) {
  let node = PolyLineHelper.getEndpointById(lineId, 0)

  while (node !== undefined) {
    if (node.nextLine !== undefined) {
      node.nextLine.set('stroke', '#007BFF')
    }
    node = node.next
  }
}

PolyLineHelper.removeLineHighlight =  function (lineId) {
  let node = PolyLineHelper.getEndpointById(lineId, 0)

  while (node !== undefined) {
    if (node.nextLine !== undefined) {
      node.nextLine.set('stroke', 'black')
    }
    node = node.next
  }
}

/**
 * Copies the information necessary to maintain the line order and
 * replaces the old fabric object with the new one
 * @param {Fabric JS Object} oldNode
 * @param {Fabric JS Object} newNode
 */
PolyLine.replaceEnd = function (oldNode, newNode) {
  newNode.side = oldNode.side
  if (newNode.side === 0) {
    PolyLineHelper.registerMidPoint(oldNode.next, newNode, oldNode.next.next)
    oldNode.options.end1 = newNode
  } else if (newNode.side === 1) {
    PolyLineHelper.registerMidPoint(oldNode.prev, oldNode.prev.prev, newNode)
    oldNode.options.end2 = newNode
  }

  newNode.prev = oldNode.prev
  newNode.next = oldNode.next
  newNode.prevLine = oldNode.prevLine
  newNode.nextLine = oldNode.nextLine
  newNode.split = oldNode.split
  newNode.id = oldNode.id
  newNode.objectSnapped = oldNode.objectSnapped
  newNode.constraintId = oldNode.constraintId
  newNode.snappingPointIndex = oldNode.snappingPointIndex
  newNode.tag = oldNode.tag
  newNode.options = oldNode.options
  newNode.isEnd = true
  oldNode.__eventListeners = undefined

  PolyLineHelper.attachDeleteHandler(newNode)
  PolyLine.canvas.add(newNode)
  PolyLine.canvas.remove(oldNode)
  delete oldNode
}

/**
 * Connect two classes into a simple binary relation.
 * @param options
 */
PolyLineHelper.connectClasses = function (options) {
  let nodes = []
  // retrieve each class
  const classIDs = options.classIDs
  const classes = [UmlClass.getUmlClassById(classIDs[0]), UmlClass.getUmlClassById(classIDs[1])]
  // identify class in 'parent' position
  let parent
  let child
  if (classes[0].left < classes[1].left) {
    parent = classes[0]
    child = classes[1]
  } else {
    parent = classes[0]
    child = classes[1]
  }
  // connect with a vertical line or horizontal line
  const minSpace = options.gridSize * 4
  const parentRight = parent.left + parent.width
  let horizontal = true
  if (child.left - parentRight < minSpace) {
    horizontal = false
  }
  const visited = {}
  // select 'snapping points'
  if (horizontal) {
    const parentPoint = { left: parentRight, top: parent.top + (3 * options.gridSize) }
    const childPoint = { left: child.left, top: child.top + (3 * options.gridSize) }
    const startPoint = { left: parentPoint.left + options.gridSize, top: parentPoint.top }
    const endPoint = { left: childPoint.left - options.gridSize, top: childPoint.top }
    const direction = { left: options.gridSize, top: 0 }
    nodes = [parentPoint, startPoint, endPoint, childPoint]
    const intermediateNodes = PolyLineHelper.findPath(nodes, nodes[1], nodes[2], visited, options.gridSize, direction)
    nodes.splice(2, 0, ...intermediateNodes)
  } else {
    const parentPoint = { left: parent.left + parent.width / 2, top: parent.top + parent.height }
    const childPoint = { left: child.left + child.width / 2, top: child.top }
    const startPoint = { left: parentPoint.left, top: parentPoint.top + options.gridSize }
    const endPoint = { left: childPoint.left, top: childPoint.top - options.gridSize }
    const direction = { left: 0, top: options.gridSize }
    nodes = [parentPoint, startPoint, endPoint, childPoint]
    const intermediateNodes = PolyLineHelper.findPath(nodes, nodes[1], nodes[2], visited, options.gridSize, direction)
    nodes.splice(2, 0, ...intermediateNodes)
  }
  return nodes
}

PolyLineHelper.findLineSnappableObjects = function () {
  PolyLineHelper.lineSnappableObjects = []
  Object.values(window.PLDrawingApi.elements).forEach(elementType => {
    if (elementType.instances !== undefined) {
      const object = Object.values(elementType.instances)[0]
      if (object.lineSnappable && object.getSnappingPoints !== undefined) {
        PolyLineHelper.lineSnappableObjects.push(Object.values(elementType.instances))
      }
    }
  })
  PolyLineHelper.lineSnappableObjects = PolyLineHelper.lineSnappableObjects.flat()
}
