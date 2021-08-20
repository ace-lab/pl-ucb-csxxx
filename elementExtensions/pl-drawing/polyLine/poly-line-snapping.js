/**
 * Snaps the line to an object that is line snappable.
 * @param {JSON Object} options Element Data
 * @param {Fabricjs Circle} node Node to snap
 */
PolyLineHelper.snapToObject = function (options, node) {
  const snappingTolerance = 15

  PolyLineHelper.findLineSnappableObjects()

  // Loop through objects
  PolyLineHelper.lineSnappableObjects.forEach(object => {
    // Get snapping points from object
    const snappingPoints = object.getSnappingPoints(this.canvas)
    for (let j = 0; j < snappingPoints.length; j++) {
      const point = snappingPoints[j]

      // Snap if near a snapping point of the object.
      if (PolyLineHelper.isNodeNearPoint(node, point.x, point.y, snappingTolerance)) {
        // PolyLineHelper.snappingFncs[node.type](node, point, object)
        PolyLineHelper.tipTransforms[node.type](node, point)
        PolyLineHelper.rotationHandler(node)

        node.objectSnapped = object.id
        node.snapped = true
        node.snappingPointIndex = j

        if (object.removeLineSnappingIndicator !== undefined) {
          object.applyLineSnappingIndicator(object)
        }
        object.snappedEndpoints.push({ id: node.id, side: node.side })

        PolyLineHelper.updateAnswerState(options)

        return
      }
    }
  })
}

/**
 * Checks if node is near a point within the tolerance
 * @param {Fabricjs Circle} node Fabric JS Circle
 * @param {Float} x X position of the point
 * @param {Float} y Y position of the point
 * @param {Float} tolerance Threshold
 * @returns true if within the tolerance, false otherwise
 */
PolyLineHelper.isNodeNearPoint = function (node, x, y, tolerance) {
  return (Math.abs(node.left - x) < tolerance &&
        Math.abs(node.top - y) < tolerance)
}

/**
 * Gets the snapping points of an endpoint. This will return 8 points, one at every corner,
 * and one inbetween each corner. All a certain distance from the endpoint.
 * @param {Fabricjs Circle} endpoint Endpoint of a line
 * @returns {List Of Float} List of points
 */
PolyLineHelper.getSnappingPoints = function (endpoint) {
  const points = []
  const distanceFromEndpoint = 30
  const iterationsAcross = 3
  const y = endpoint.top - distanceFromEndpoint
  let x = endpoint.left - distanceFromEndpoint

  // Add points on top of the endpoint and the bottom
  for (let i = 0; i < iterationsAcross; i++) {
    points.push({ x: x, y: y })
    points.push({ x: x, y: y + distanceFromEndpoint * 2 })
    x += distanceFromEndpoint
  }

  // Add two more points to the left and right of the endpoint
  const midY = endpoint.top + endpoint.height / 2
  points.push({ x: endpoint.left - distanceFromEndpoint, y: midY })
  points.push({ x: endpoint.left + endpoint.width + distanceFromEndpoint, y: midY })

  return points
}

/**
 * Snaps node to grid given a grid size
 * @param {Fabricjs Circle} node Fabric JS Circle
 * @param {Int} gridSize Total size of the grid
 */
PolyLineHelper.snapToGrid = function (node, gridSize) {
  const point = {
    x: Math.round(node.left / gridSize) * gridSize,
    y: Math.round(node.top / gridSize) * gridSize
  }

  PolyLineHelper.tipTransforms[node.type](node, point)
  PolyLineHelper.rotationHandler(node)
}

/**
 * Moves constrints atteched to an endpoint
 * @param {Fabricjs Circle} endpoint Endpoint of a line
 */
PolyLineHelper.moveConstraint = function (endpoint) {
  const constraint = Constraint.getConstraintById(endpoint.constraintId)

  if (constraint !== undefined) {
    // Find the new snapping point
    const snappingPointIndex = constraint.snappingPointIndex
    const snappingPoint = PolyLineHelper.getSnappingPoints(endpoint)[snappingPointIndex]

    PolyLineHelper.canvas.bringToFront(constraint)

    // Update coordinates
    constraint.left = snappingPoint.x - constraint.width / 2
    constraint.top = snappingPoint.y - constraint.height / 2
    constraint.setCoords()

    constraint.fire('moving')
  }
}

PolyLineHelper.attachSnapHandler = function (node) {
  const options = node.options

  node.on('moving', function (event) {
    // Try to snap to object if the user is moving the endpoint
    if (node.isEnd && event.transform !== undefined) {
      PolyLineHelper.unsnapFromObject(node)
      node.objectSnapped = null
      PolyLineHelper.snapToObject(options, node)
    }
  })
}

/**
 * Removes snapping indicators and data of the line from the snapped object
 * @param {Fabricjs Circle} endpoint Endpoint of a line
 */
PolyLineHelper.unsnapFromObject = function (endpoint) {
  const snappedObject = PolyLineHelper.getObjectOnCanvasById(endpoint.objectSnapped)
  if (snappedObject !== undefined) {
    console.log("here")
    snappedObject.removeSnappedEndpoints(snappedObject, [endpoint.id], [endpoint.side])
    if (snappedObject.removeLineSnappingIndicator !== undefined && snappedObject.snappedEndpoints.length === 0) {
      console.log("here")
      snappedObject.removeLineSnappingIndicator(snappedObject)
    }
  }
}

PolyLineHelper.snapDiamond = function (diamond, point, object) {
  if (point.y === object.top) {
    diamond.top = point.y - diamond.height
    diamond.angle = 0
  } else if (point.y === object.top + object.height) {
    diamond.top = point.y + diamond.height
    diamond.angle = 180
  }

  if (point.x === object.left) {
    diamond.left = point.x - diamond.height
    diamond.angle = 270
  } else if (point.x === object.left + object.width) {
    diamond.left = point.x + diamond.height
    diamond.angle = 90
  }
}

PolyLineHelper.snapCircle = function (circle, point, object) {
  circle.top = point.y
  circle.left = point.x
}

PolyLineHelper.snapTriangle = function (triangle, point, object) {
  if (point.y === object.top) {
    triangle.angle = 180
  } else if (point.y === object.top + object.height) {
    triangle.angle = 0
  }

  if (point.x === object.left) {
    triangle.angle = 90
  } else if (point.x === object.left + object.width) {
    triangle.angle = 270
  }
}

PolyLineHelper.snappingFncs = {
  circle: PolyLineHelper.snapCircle,
  polygon: PolyLineHelper.snapDiamond,
  triangle: PolyLineHelper.snapTriangle,
  polyline: PolyLineHelper.snapTriangle
}
