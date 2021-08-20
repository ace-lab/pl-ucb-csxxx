/**
 * Handles movements of verticies
 * @param {JSON Object} options Element Data
 * @param {JSON Object} node Fabricjs Circle
 */
PolyLineHelper.movementHandler = function (options, node) {
  // If did not snap to object, try to snap to grid if it exist
  if ((node.objectSnapped === null || node.objectSnapped === undefined) && options.gridSize > 0) {
    PolyLineHelper.snapToGrid(node, options.gridSize)
  }

  // If node has a previous line
  if ('prevLine' in node && node.prevLine != null) {
    PolyLineHelper.movePrevLine(node.prevLine, node, true)
  }
  // If node has a next line
  if ('nextLine' in node && node.nextLine != null) {
    PolyLineHelper.moveNextLine(node.nextLine, node, true)
  }
  // If node has a next node that is not an end
  if ('next' in node && node.next != null && !node.next.isEnd && !node.next.split) {
    PolyLineHelper.moveNode(node.next)
  }
  // If node has a previous node that is not an end
  if ('prev' in node && node.prev != null && !node.prev.isEnd && !node.prev.split) {
    PolyLineHelper.moveNode(node.prev)
  }
  // If node is moved and is not already an end
  if ('split' in node && !node.isEnd && !node.split) {
    PolyLineHelper.insertNewLine(options, node)
  }
  // If node has an association line
  if ('assocLine' in node && node.assocLine != null) {
    PolyLineHelper.moveNextLine(node.assocLine, node)
  }
  // Set the coordinates and render everything
  // this.canvas.renderAll()
}

/**
 * Handles rotation of verticies
 * @param {Canvas Object} canvas Fabricjs Canvas Object
 * @param {JSON Object} event Fabricjs event
 */
PolyLineHelper.attachRotationHandler = function (node) {
  node.on('rotating', function (_event) {
    PolyLineHelper.rotationHandler(node)
  })

  if ('prevLine' in node && node.prevLine != null) {
    PolyLineHelper.attachLineRotationHandler(node.prevLine, node)
  }

  if ('nextLine' in node && node.nextLine != null) {
    node.nextLine.on('moving', function (_event) {
      const p1 = { x: node.nextLine.x2, y: node.nextLine.y2 }
      const p2 = { x: node.nextLine.x1, y: node.nextLine.y1 }
      PolyLineHelper.applyLineAngle(node, p1, p2)
      PolyLineHelper.rotationHandler(node)
    })
  }
}

/**
 * Rotates a node based off the angle of line whenever the line moves
 * @param {Fabricjs Object} line this is an indiviual line object not a poly line
 * @param {Fabricjs Object} node
 */
PolyLineHelper.attachLineRotationHandler = function (line, node) {
  line.on('moving', function (_event) {
    const p1 = { x: node.prevLine.x1, y: node.prevLine.y1 }
    const p2 = { x: node.prevLine.x2, y: node.prevLine.y2 }
    PolyLineHelper.applyLineAngle(node, p1, p2)
    PolyLineHelper.rotationHandler(node)
  })
}

/**
 * Moves the line according to the position of the node
 * @param {Fabricjs Object} node
 */
PolyLineHelper.rotationHandler = function (node) {
  // If node has a previous line
  if ('prevLine' in node && node.prevLine != null) {
    PolyLineHelper.movePrevLine(node.prevLine, node)
    PolyLineHelper.moveNode(node.prev, true)
  } else if ('nextLine' in node && node.nextLine != null) { // If node has a next line
    PolyLineHelper.moveNextLine(node.nextLine, node)
    PolyLineHelper.moveNode(node.next, false)
  }
  // Set the coordinates and render everything
  node.setCoords()
}

/**
 * Adds a movement handler to any given node
 * This function helps interaction between other elements
 * @param {Fabricjs Object} node
 */
PolyLineHelper.attachMovementHandler = function (options, node) {
  // Attach movement handler
  node.on('moving', function (event) {
    // Follow all other movement rules after the first two take place
    PolyLineHelper.movementHandler(options, node)
    PolyLineHelper.moveConstraint(node)

    // Update the answer state
    PolyLineHelper.updateAnswerState(options)
  })
}

/**
 * Adds a selection handler for a line in between nodes
 * When an indiviual line is selected then the entire object (head to tail including other lines are selected)
 * @param {JSON Object} options line answer object, stores the root node
 * @param {Fabricjs Line} line line inbetween two nodes
 */
PolyLineHelper.attachLineSelectionHandler = function (options, line) {
  const canvas = PolyLineHelper.canvas

  line.on('selected', function (event) {
    // Ensure the selection is made by a user and not programatically
    // This is to prevent a recusion loop
    if (event.e !== undefined) {
      // Delselect the line that was clicked on
      canvas.discardActiveObject()

      // Loop through the current line and push all nodes and lines to the list
      const objectsToSelect = []
      let node = options.end1
      while (node !== undefined) {
        objectsToSelect.push(node)
        if (node.nextLine !== undefined) {
          objectsToSelect.push(node.nextLine)
        }
        node = node.next
      }

      // Create a selection from the list and have the canvas select it
      const sel = new fabric.ActiveSelection(objectsToSelect, { canvas: canvas, id: options.end1.id })
      canvas.setActiveObject(sel)
      canvas.renderAll()

      // Unsnap from any objects
      PolyLineHelper.unsnapFromObject(options.end1)
      PolyLineHelper.unsnapFromObject(options.end2)

      // Work around to unknown bug in FabricJS
      // When the selection is cleared (user deselects), fire moving for the objects to reset the coordinates
      canvas.on('selection:cleared', function (event) {
        if (event.deselected === undefined) return
        event.deselected.forEach(object => {
          // Do not fire moving for the nodes that are splittable
          if (object.nextLine !== undefined || object.prevLine !== undefined) {
            object.fire('moving')
          }
        })
      })
    }
  })
}

/**
 * Gets the x and y coord to the end of the triangle
 * This is used to draw the line at the end of the triangle
 * @param {Fabricjs Object} triangle Fabric triangle object
 * @returns {Array} X and Y coords
 */
PolyLineHelper.triangleLineTransform = function (triangle) {
  const w = triangle.width
  const h = triangle.height
  const ta = triangle.angle
  const x = triangle.left
  const y = triangle.top

  const cosOfTa = Math.cos(ta * Math.PI / 180)
  const sinOfTa = Math.sin(ta * Math.PI / 180)

  return [
    x - (h * sinOfTa),
    y + (h * cosOfTa)
  ]
}

/**
 * Gets the x and y coord to the center of the circle
 * @param {Fabricjs Object} circle Fabric circle
 * @returns {Array} X and Y coords
 */
PolyLineHelper.circleLineTransform = function (circle) {
  return [
    circle.left,
    circle.top
  ]
}

/**
 * Move the tip of a polygon
 * @param {Fabricjs Object} polygon
 * @param {JSON Object} point x and y
 */
PolyLineHelper.movePolygonTip = function (polygon, point) {
  polygon.left = point.x
  polygon.top = point.y
}

/*
These are used to map a shape to the functions for the transforms
I left this to make it easier to add a shape
*/
PolyLineHelper.lineTransforms = {
  triangle: PolyLineHelper.triangleLineTransform,
  circle: PolyLineHelper.circleLineTransform,
  polygon: PolyLineHelper.triangleLineTransform,
  polyline: PolyLineHelper.circleLineTransform
}

PolyLineHelper.tipTransforms = {
  triangle: PolyLineHelper.movePolygonTip,
  circle: PolyLineHelper.movePolygonTip,
  polygon: PolyLineHelper.movePolygonTip,
  polyline: PolyLineHelper.movePolygonTip
}
