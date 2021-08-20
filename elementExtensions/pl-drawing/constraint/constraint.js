class Constraint extends PLDrawingBaseElement {
  /**
     * Generates a constraint
     * @param  {Canvas Object} canvas Fabricjs Canvas Object
     * @param  {JSON Object} options contains attribute information
     * @param  {JSON Object} submittedAnswer submitted answer info, parsed
     */
  static generate (canvas, options, submittedAnswer) {
    const subObj = Object.assign({}, options)

    const constraint = Constraint.createConstraint(options)
    constraint.options = subObj

    // Determine if this drawing is static or interactive
    let staticDiagram = false
    if ('static' in options) {
      staticDiagram = options.static === 'true'
    }

    if (canvasHelper.isCanvasInteractable(canvas)) {
      Constraint.canvas = canvas
      Constraint.submittedAnswer = submittedAnswer

      // Keep a dict of constraints
      const idString = parseInt(constraint.id)
      if (Constraint.instances === undefined) {
        Constraint.instances = {}
      }
      Constraint.instances[idString] = constraint

      if ('snapData' in options) {
        Constraint.loadSnappingAttributes(options, constraint)
      } else {
        Constraint.applyDefaultSnappingAttributes(options, constraint)
      }

      Constraint.attachMovementHandler(constraint)
      Constraint.updateAnswerState(constraint)
    } else if (staticDiagram) {
      canvasHelper.preformOnStaticCanvas(Constraint, canvas, function () {
        if ('keyID' in options) {
          Constraint.attachToLine(options, constraint)
        }
      })
    }

    // Place on canvas
    canvas.add(constraint)
  }

  /**
     * gets button tool tip when user hovers over button
     * @param  {JSON Object} options contains attribute information
     * @return {String} string to display
     */
  static get_button_tooltip (options) {
    return 'Add ' + options.constraintType
  }

  /**
     * gets button icon file name
     * @param {JSON Object} options contains attribute information
     * @return {String} file name for svg file in clientFilesExtension
     */
  static get_button_icon (options) {
    let file = options.constraintType

    if (file[3] === '*') {
      file = file.substring(0, 3) + 'm'
    }
    return file + '.svg'
  }
};

/**
 * Updates the answer state of a constraint object
 * @param {FabicJS Object} constraint Constraint object
 */
Constraint.updateAnswerState = function (constraint) {
  constraint.options.coordinates = [constraint.left, constraint.top]
  constraint.options.snappingPointIndex = constraint.snappingPointIndex
  constraint.options.snapData = constraint.snapData
  constraint.options.id = constraint.id
  Constraint.submittedAnswer.updateObject(constraint.options)
}

/**
 * Attaches movement handlers for a constraint
 * @param {FabicJS Object} constraint Constraint object
 */
Constraint.attachMovementHandler = function (constraint) {
  constraint.on('moving', function (event) {
    // If user moves the constraint
    if (event.transform !== undefined) {
      Constraint.unsnapFromLine(constraint)
    }

    Constraint.canvas.bringToFront(constraint)

    if (!constraint.snapped) {
      Constraint.snapToLine(constraint)
    }

    Constraint.updateAnswerState(constraint)
  })

  constraint.on('modified', function () {
    Constraint.updateAnswerState(constraint)
  })

  constraint.on('mouseup', function(_event) {
    if (constraint.snapData !== undefined && constraint.snapData !== null) {
      PolyLineHelper.removeLineHighlight(constraint.snapData.id)
    }
  })
}

/**
 * Creates a constraint from options
 * @param  {JSON Object} options contains attribute information
 * @returns FabricJS object
 */
Constraint.createConstraint = function (options) {
  // Create a new fabric text object
  const constraint = new fabric.Text(options.constraintType, {
    fontSize: 16,
    left: options.coordinates[0],
    top: options.coordinates[1]
  })

  /* Lock Object */
  constraint.lockScalingX = true
  constraint.lockScalingY = true
  constraint.tag = 'pl-constraint'

  /* Generate a unique ID for this object if it doesn't have one */
  if (!('id' in options)) {
    constraint.id = PLDrawingApi.generateID()
  } else {
    constraint.id = options.id
  }

  return constraint
}

/**
 * Tries to snap a constraint to a line
 * @param {FabicJS Object} constraint Constraint object
 */
Constraint.snapToLine = function (constraint) {
  const objectsOnCanvas = Constraint.canvas.getObjects()
  const snappingTolerance = 15

  for (let i = 0; i < objectsOnCanvas.length; i++) {
    const object = objectsOnCanvas[i]

    if (object.tag === 'pl-poly-line' && object.isEnd === true) {
      const snappingPoints = PolyLineHelper.getSnappingPoints(object)
      for (let j = 0; j < snappingPoints.length; j++) {
        const point = snappingPoints[j]

        if (Constraint.isNearPoint(constraint, point.x, point.y, snappingTolerance)) {
          constraint.left = point.x - constraint.width / 2
          constraint.top = point.y - constraint.height / 2
          constraint.snappingPointIndex = j
          constraint.setCoords()

          if (object.nextLine === undefined) {
            constraint.snapData = { id: object.id, endpoint: 1 }
          } else {
            constraint.snapData = { id: object.id, endpoint: 0 }
          }

          object.constraintId = constraint.id
          constraint.snapped = true

          PolyLineHelper.highlightLine(object.id)

          Constraint.canvas.bringToFront(constraint)
          Constraint.canvas.renderAll()
          PolyLineHelper.updateAnswerState(object.options)
        }
      }
    }
  }
}

/**
 * Tries to unsnap constraint from line and reset snap attributes
 * @param {FabicJS Object} constraint Constraint object
 */
Constraint.unsnapFromLine = function (constraint) {
  // If snapped
  if (constraint.snapped) {
    PolyLineHelper.removeLineHighlight(constraint.snapData.id)
    PolyLineHelper.removeConstraint(constraint.snapData.id, constraint.snapData.endpoint)
    constraint.snapData = undefined
    constraint.snapped = false
  }
}

/**
 * Checks if a constraint is near a point
 * The center of the constraint is used
 * @param {FabicJS Object} constraint Constraint object
 * @param {Float} x X coordinate
 * @param {Float} y Y coordinate
 * @param {Float} tolerance Tolerance
 * @returns Boolean, true if within the tolerance, false else
 */
Constraint.isNearPoint = function (constraint, x, y, tolerance) {
  return (
    Math.abs(x - (constraint.left + constraint.width / 2)) < tolerance &&
        Math.abs(y - (constraint.top + constraint.height / 2)) < tolerance
  )
}

/**
 * Gets a constraint given an id
 * @param {Int} constraintId id of constraint
 * @returns Fabric JS constraint object
 */
Constraint.getConstraintById = function (constraintId) {
  if (this.instances === undefined) {
    return undefined
  }
  return this.instances[parseInt(constraintId)]
}

/**
 * Loads snapping attributes from submitted answer data
 * @param  {JSON Object} options contains attribute information
 * @param {FabicJS Object} constraint Constraint object
 */
Constraint.loadSnappingAttributes = function (options, constraint) {
  constraint.snappingPointIndex = options.snappingPointIndex
  constraint.snapData = options.snapData
}

/**
 * Applies default snapping attributes
 * @param  {JSON Object} options contains attribute information
 * @param {FabicJS Object} constraint Constraint object
 */
Constraint.applyDefaultSnappingAttributes = function (options, constraint) {
  constraint.snappingPointIndex = null
  constraint.snapData = null
}

/**
 * Snaps a new Constraint to an existing poly-line.
 * This function is called when the attribute "key-id" is present and set.
 * @param options contains attribute information
 * @param {FabicJS Object} constraint Constraint object
 */
Constraint.attachToLine = function (options, constraint) {
  const objectsOnCanvas = Constraint.canvas.getObjects()
  const key = Key.getKeyById(options.keyID)
  const neighbors = Key.isNextToKey(key)
  const snappingIndex = options.above ? (neighbors === 1 ? 0 : 4) : (neighbors === 0 ? 5 : 1)

  for (let i = 0; i < objectsOnCanvas.length; i++) {
    const object = objectsOnCanvas[i]

    if (object.tag === 'pl-poly-line') {
      const keyId = object.keyID
      // check if this line has our keys
      if (keyId === options.keyID) {
        const snappingPoints = PolyLineHelper.getSnappingPoints(object)
        // Select a snapping point depending on the value of key.above
        const coordinates = snappingPoints[snappingIndex]
        constraint.left = coordinates.x - constraint.width / 3
        if (options.above) {
          constraint.top = coordinates.y
        } else {
          constraint.top = coordinates.y - constraint.height
        }

        constraint.snappingPointIndex = 0
        constraint.setCoords()

        if (object.nextLine === undefined) {
          constraint.snapData = { id: object.id, endpoint: 1 }
        } else {
          constraint.snapData = { id: object.id, endpoint: 0 }
        }

        object.constraintId = constraint.id
        constraint.snapped = true
        i = objectsOnCanvas.length
      }
    }
  }
}

Constraint.delete = function (constraintId) {
  const constraint = Constraint.getConstraintById(constraintId)
  Constraint.unsnapFromLine(constraint)
  Constraint.canvas.remove(constraint)
  Constraint.submittedAnswer.deleteObject(constraintId)
}

PLDrawingApi.registerElements('constraint', {
  'pl-constraint': Constraint
})
