class UmlClass extends PLDrawingBaseElement {
  /**
     * Generates a UML class
     * @param  {Canvas Object} canvas Fabricjs Canvas Object
     * @param  {JSON Object} options contains attribute information
     * @param  {JSON Object} submittedAnswer submitted answer info, parsed
     */
  static generate (canvas, options, submittedAnswer) {
    // Save the options in a seperate object
    const subObj = Object.assign({}, options)
    let umlClass

    // Check if the canvas is the canvas which can be used by the student
    if (typeof canvas._onDrag === 'function') {
      // Save the correct canvas and submitted answers object
      UmlClass.canvas = canvas
      UmlClass.submittedAnswer = submittedAnswer

      UmlClass.canvas.fireRightClick = true
      UmlClass.canvas.stopContextMenu = true

      // Draw the UML class object
      umlClass = UmlClass.drawUmlClass(subObj)
      umlClass.options = subObj

      // Apply the options given from submitted answers or uml_class.py
      UmlClass.applyDefaultOptions(subObj, umlClass)

      // Save this UML class in an object of instances
      if (this.instances === undefined) {
        this.instances = {}
      }
      this.instances[parseInt(umlClass.id)] = umlClass

      // If no line is snapped to this class
      if (subObj.snappedEndpoints === undefined || subObj.snappedEndpoints.length < 1) {
        UmlClass.applyDefaultSnappingAttributes(subObj, umlClass)
      } else {
        UmlClass.loadSnappingAttributes(subObj, umlClass)
      }

      // Update the answer state and attach movement handler
      UmlClass.updateAnswerState(umlClass)
      UmlClass.attachMovementHandler(umlClass)
      umlClass.on('removed', function (event) {
        delete UmlClass.instances[umlClass.id]
        UmlClass.delete(umlClass)
      })
    } else {
      const interactiveCanvas = UmlClass.canvas
      UmlClass.canvas = canvas

      // Draw the UML class object
      umlClass = UmlClass.drawUmlClass(subObj)
      umlClass.options = subObj

      // Apply the options given from submitted answers or uml_class.py
      UmlClass.applyDefaultOptions(subObj, umlClass)

      UmlClass.canvas = interactiveCanvas
    }

    // Add to the object to the canvas
    canvas.add(umlClass)
  }
};

/**
 * Updates the answer state of a umlClass
 * @param {Fabricjs Group} umlClass Scheme object
 */
UmlClass.updateAnswerState = function (umlClass) {
  const answerObject = Object.assign({}, umlClass.options, {
    left: umlClass.left,
    top: umlClass.top,
    snappedEndpoints: umlClass.snappedEndpoints,
    className: umlClass.className,
    startingAttributes: umlClass.startingAttributes,
    userAddedAttributes: umlClass.userAddedAttributes,
    startingMethods: umlClass.startingMethods,
    userAddedMethods: umlClass.userAddedMethods,
    attributes: umlClass.attributes,
    methods: umlClass.methods,
    id: umlClass.id
  })
  // Update the entry in the submitted answers data
  UmlClass.submittedAnswer.updateObject(answerObject)
}

/**
 * Draws uml class from options
 * @param {JSON object} options
 * @returns {Fabricjs Group}
 */
UmlClass.drawUmlClass = function (options) {
  /* Fabric objects that make up a uml class:
    outer rectangle
    top inner rectangle
    lower inner rectangle
    class name
  */
  const outerRect = new fabric.Rect({
    width: options.width,
    height: options.height,
    originX: 'center',
    fill: 'white',
    stroke: 'black'
  })

  const topInnerRect = new fabric.Rect({
    width: options.width,
    height: options.height * 0.18,
    originX: 'center',
    fill: '',
    stroke: 'black'
  })

  const lowerInnerRect = new fabric.Rect({
    width: options.width,
    height: options.height * 0.90,
    originX: 'center',
    fill: '',
    stroke: 'black'
  })

  // Add the class name in the top inner rectangle
  const className = new fabric.IText(options.className, {
    fontSize: 20,
    originX: 'center',
    top: 10,
    type: 'className'
  })

  // Group the objects together
  const umlGroup = new fabric.Group([outerRect, topInnerRect, lowerInnerRect, className], { subTargetCheck: true })

  UmlClass.attachTextHandlers(umlGroup, className)
  umlGroup.hasBorder = umlGroup.hasControls = false

  // Apply given position and class name
  umlGroup.top = options.top
  umlGroup.left = options.left
  umlGroup.className = options.className
  umlGroup.umlTextFont = options.umlTextFont
  umlGroup.minHeight = options.height
  umlGroup.classNameEditable = options.classNameEditable

  umlGroup.startingAttributes = 'startingAttributes' in options ? options.startingAttributes : []
  umlGroup.userAddedAttributes = 'userAddedAttributes' in options ? options.userAddedAttributes : []

  umlGroup.startingMethods = 'startingMethods' in options ? options.startingMethods : []
  umlGroup.userAddedMethods = 'userAddedMethods' in options ? options.userAddedMethods : []

  UmlClass.addAttributes(umlGroup, [])
  UmlClass.addMethods(umlGroup, [])
  UmlClass.renderUmlText(umlGroup)

  return umlGroup
}

/**
 * Applies default attributes
 * @param {JSON Object} options contains attribute information
 * @param {Fabricjs Circle} node Fabric JS Circle
 */
UmlClass.applyDefaultOptions = function (options, umlClass) {
  // Save references to the functions that are invoked by other custom elements
  umlClass.getSnappingPoints = UmlClass.getSnappingPoints
  umlClass.removeSnappedEndpoints = UmlClass.removeSnappedEndpoints
  umlClass.applyLineSnappingIndicator = UmlClass.applyLineSnappingIndicator
  umlClass.removeLineSnappingIndicator = UmlClass.removeLineSnappingIndicator
  umlClass.displaySnappingIndicator = UmlClass.displaySnappingIndicator
  umlClass.removeSnappingIndicator = UmlClass.removeSnappingIndicator

  // Allows a line to be snapped to this element
  umlClass.lineSnappable = true

  // Used by customDeleteButton to delete the correct element
  umlClass.tag = 'pl-uml-class'

  // Used to snap the object to the canvas
  umlClass.gridSize = options.gridSize

  // Used to check if starting attributes or methods are removable
  umlClass.startAttrEditable = options.startAttrEditable
  umlClass.startMthdEditable = options.startMthdEditable

  if (!('id' in options)) {
    umlClass.id = PLDrawingApi.generateID()
  } else {
    umlClass.id = options.id
  }

  umlClass.selectable = options.selectable

  // Removes the ablity to scale the element
  umlClass.lockScalingX = true
  umlClass.lockScalingY = true
}

/**
 * Loads snapping attributes from submitted answer data
 * @param {JSON Object} options contains attribute information
 * @param {Fabricjs Group} umlClass Fabric JS Group
 */
UmlClass.loadSnappingAttributes = function (options, umlClass) {
  umlClass.snappedEndpoints = options.snappedEndpoints
  UmlClass.applyLineSnappingIndicator(umlClass)
}

/**
 * Applies default snapping attributes
 * @param {JSON Object} options contains attribute information
 * @param {Fabricjs Group} uml_class Fabric JS Group
 */
UmlClass.applyDefaultSnappingAttributes = function (options, umlClass) {
  umlClass.snappedEndpoints = []
}

/**
 * Attaches a movement handler for the object
 * @param {Fabricjs Group} uml_class Fabric JS Group
 */
UmlClass.attachMovementHandler = function (umlClass) {
  umlClass.on('moving', function (event) {
    UmlClass.snapToGrid(umlClass)
    UmlClass.moveSnappedEndpoints(umlClass)
    UmlClass.updateAnswerState(umlClass)
  })

  umlClass.on('modified', function (event) {
    UmlClass.updateAnswerState(umlClass)
  })
}

/**
 * Attaches listeners for text hovering, editing, and removing
 * @param {Fabricjs Group} umlClass Fabric JS Group
 * @param {Fabricjs IText} textObj Editable text
 */
UmlClass.attachTextHandlers = function (umlClass, textObj) {
  const canvas = UmlClass.canvas
  textObj.on('mouseover', function (_event) {
    textObj.set('fill', '#007BFF')
    canvas.requestRenderAll()
  })

  textObj.on('mouseout', function (_event) {
    textObj.set('fill', 'black')
    canvas.requestRenderAll()
  })

  // Edit on left double click
  textObj.on('mousedblclick', function (_event) {
    let editingExitedFunction
    if (textObj.type === 'method' || textObj.type === 'attribute') {
      const editableTextArray = UmlClass.getEditableTextArray(umlClass, textObj)
      editingExitedFunction = function (userEnteredString) {
        // Add the new text in the correct index
        editableTextArray.splice(textObj.index, 0, userEnteredString)
        UmlClass.renderUmlText(umlClass)
      }

      console.log(editableTextArray.length)
      if (editableTextArray.length !== 0) {
        UmlClass.editText(umlClass, textObj, editingExitedFunction)
      }
    } else {
      editingExitedFunction = function (userEnteredString) {
        textObj.text = userEnteredString
        umlClass.addWithUpdate(textObj)
        umlClass.className = userEnteredString
        UmlClass.renderUmlText(umlClass)
      }

      if (umlClass.classNameEditable) {
        UmlClass.editText(umlClass, textObj, editingExitedFunction)
      } else {
        alert('Editing this class name is disabled.')
      }
    }
  })

  // Remove on right click, only works on non class name text
  textObj.on('mousedown', function (event) {
    if (event.button === 3) {
      UmlClass.removeText(umlClass, textObj)
      UmlClass.renderUmlText(umlClass)
    }
  })
}

/**
 * Tries to remove text if editable
 * @param {Fabricjs Group} uml_class Fabric JS Group
 * @param {Fabricjs IText} textObj Editable text
 */
UmlClass.removeText = function (umlClass, textObj) {
  UmlClass.getEditableTextArray(umlClass, textObj).splice(textObj.index, 1)
}

/**
 * Gets the array that a text object is in if the object can be edited
 * If not editable an alert will be issued to the user
 * @param {Fabricjs Group} umlClass Fabric JS Group
 * @param {Fabricjs IText} textObj Editable text
 * @returns Array of editable text
 */
UmlClass.getEditableTextArray = function (umlClass, text) {
  let nonEditableMessage = false
  let editableTextArray = []

  if (text.type === 'attribute') {
    if (text.starting && umlClass.startAttrEditable) {
      editableTextArray = umlClass.startingAttributes
    } else if (!text.starting) {
      editableTextArray = umlClass.userAddedAttributes
    } else {
      nonEditableMessage = true
    }
  } else if (text.type === 'method') {
    if (text.starting && umlClass.startMthdEditable) {
      editableTextArray = umlClass.startingMethods
    } else if (!text.starting) {
      editableTextArray = umlClass.userAddedMethods
    } else {
      nonEditableMessage = true
    }
  }

  if (nonEditableMessage) {
    alert('Editing starting ' + text.type + 's from "' + umlClass.className + '" is disabled')
  }

  return editableTextArray
}

/**
 * Edits text, adds a new temp Itext, edits it, and calls editExitFnc with the user text as a param
 * @param {Fabricjs Group} uml_class Fabric JS Group
 * @param {Fabricjs IText} textObj Editable text
 * @param {function} editExitFnc
 */
UmlClass.editText = function (umlClass, textObj, editExitFnc) {
  umlClass.removeWithUpdate(textObj)
  textObj.setCoords()

  // Make new temp IText
  const tempText = new fabric.IText('', {
    top: textObj.aCoords.tr.y,
    left: umlClass.left + 4,
    fontSize: textObj.fontSize,
    originX: 'left'
  })

  // Add the temp text to the canvas
  umlClass.canvas.add(tempText)

  tempText.on('editing:entered', function (_event) {
    // Sets the active object as the temp text so it is drawn on top
    umlClass.canvas.setActiveObject(tempText)
    // render everything
    UmlClass.removeText(umlClass, textObj)
    umlClass.canvas.renderAll()
  })

  // Invoke text edit
  tempText.enterEditing()

  tempText.on('editing:exited', function (_event) {
    // Remove temp text
    umlClass.canvas.remove(tempText)

    // If user enters nothing revert the text
    if (tempText.text === '') {
      tempText.text = textObj.text
    }

    const userEnteredString = tempText.text
    editExitFnc(userEnteredString)
  })
}

/**
 * Gets a list of points an object can snap to
 * Currently only works fully with gridSize enabled
 * @param  {Canvas Object} canvas Fabricjs Canvas Object
 * @returns list of objects {x: , y: }
 */
UmlClass.getSnappingPoints = function (canvas) {
  const points = []
  const umlClass = this
  let iterationsAcross = 0 // Points accross the horizontal
  const y = umlClass.top
  let x = umlClass.left

  if (umlClass.gridSize !== 0) {
    iterationsAcross = umlClass.width / umlClass.gridSize
    const gridpointsVertical = umlClass.height / umlClass.gridSize

    for (let i = 1; i < gridpointsVertical; i++) {
      const gridPoint = umlClass.top + umlClass.gridSize * i
      points.push({ x: umlClass.left, y: gridPoint })
      points.push({ x: umlClass.left + umlClass.width, y: gridPoint })
    }
  } else {
    // Add two points to the left and right of the endpoint
    const midY = umlClass.top + umlClass.height / 2
    points.push({ x: umlClass.left, y: midY })
    points.push({ x: umlClass.left + umlClass.width, y: midY })
  }

  // Add points on top of the endpoint and the bottom
  for (let i = 0; i < iterationsAcross; i++) {
    points.push({ x: x, y: y })
    points.push({ x: x, y: y + umlClass.height })
    x += umlClass.gridSize // TODO: Change this to work without gridsize
  }

  return points
}

/**
 * Moves snapped endpoint to the new snapped point
 * @param {Fabricjs Group} umlClass Fabric JS Group
 */
UmlClass.moveSnappedEndpoints = function (umlClass) {
  // Loop through each endpoint snapped to umlClass and move it
  umlClass.snappedEndpoints.forEach(endpointPair => {
    // Find the new snapping point
    const endpoint = PolyLineHelper.getEndpointById(endpointPair.id, endpointPair.side)
    if (endpoint !== undefined) {
      const snappingPointIndex = endpoint.snappingPointIndex
      const snappingPoint = umlClass.getSnappingPoints(UmlClass.canvas)[snappingPointIndex]

      // Update coordinates
      PolyLineHelper.tipTransforms[endpoint.type](endpoint, snappingPoint)
      PolyLineHelper.rotationHandler(endpoint)
      endpoint.setCoords()

      endpoint.fire('moving')
    } else {
      const endpointIndex = umlClass.snappedEndpoints.indexOf(endpointPair)
      umlClass.snappedEndpoints.splice(endpointIndex, 1)
    }
  })
}

/**
 * Removes a list of snapped endpoints given pairs of lineId and side
 * @param {Fabricjs Group} umlClass Fabric JS Group
 * @param {Array} lineIds Id of the line to remove
 * @param {Array} endpointSides Sides to remove
 */
UmlClass.removeSnappedEndpoints = function (umlClass, lineIds, endpointSides) {
  // Find the index
  const endpointIndexies = []
  let i = 0
  // Loop through each pair
  umlClass.snappedEndpoints.forEach(endpointPair => {
    // If the snapped endpoint is in the pair to be removed
    if (lineIds.includes(endpointPair.id) && endpointSides.includes(endpointPair.side)) {
      endpointIndexies.push(i)
    }
    i++
  })

  // Removed the marked pairs
  endpointIndexies.forEach(index => {
    const snappedEndpoint = umlClass.snappedEndpoints[index]
    const endpoint = PolyLineHelper.getEndpointById(snappedEndpoint.id, snappedEndpoint.side)
    umlClass.snappedEndpoints.splice(index, 1)
    if (endpoint !== undefined) {
      endpoint.objectSnapped = null
    }
  })

  if (umlClass.snappedEndpoints.length < 1) {
    UmlClass.removeLineSnappingIndicator(umlClass)
  }
}

UmlClass.delete = function (umlClass) {
  const lineIds = umlClass.snappedEndpoints.map(x => x.id)
  const sides = umlClass.snappedEndpoints.map(x => x.side)

  UmlClass.removeSnappedEndpoints(umlClass, lineIds, sides)
}

/**
 * Snaps the uml class to the nearest grid corner
 * @param {Fabricjs Group} umlClass Fabric JS Group
 */
UmlClass.snapToGrid = function (umlClass) {
  if (umlClass.gridSize > 0) {
    const gridSize = umlClass.gridSize
    umlClass.top = Math.round(umlClass.top / gridSize) * gridSize
    umlClass.left = Math.round(umlClass.left / gridSize) * gridSize
  }
}

/**
 * Apply snapping indicator to the umlClass
 * @param {Fabricjs Group} umlClass Fabric JS Group
 */
UmlClass.applyLineSnappingIndicator = function (umlClass) {
  // Bold the border
  umlClass.getObjects()[0].set('strokeWidth', 2)
}

/**
 * Removes the line snapping indicator from the umlClass
 * @param {Fabricjs Group} umlClass Fabric JS Group
 */
UmlClass.removeLineSnappingIndicator = function (umlClass) {
  // Remove the bold the border
  umlClass.getObjects()[0].set('strokeWidth', 1)
}

/**
 * Displays snapping indicator, used when a UmlText object is hovered over the uml class
 */
UmlClass.displaySnappingIndicator = function () {
  this.set('strokeWidth', 3)
  this.set('stroke', '#007BFF')
}

/**
 * Removes snapping indicator, used when a UmlText object no longer hovers over uml clas
 */
UmlClass.removeSnappingIndicator = function () {
  this.set('strokeWidth', 1)
  this.set('stroke', 'black')
}

/**
 * Adds a list of attributes to the uml class attributes list
 * @param {Fabricjs Group} umlClass Fabric JS Group
 * @param {Array} attributesToAdd Array of strings
 */
UmlClass.addAttributes = function (umlClass, attributesToAdd) {
  const attributeTexts = umlClass.startingAttributes.concat(umlClass.userAddedAttributes).concat(attributesToAdd)
  umlClass.userAddedAttributes = umlClass.userAddedAttributes.concat(attributesToAdd)

  umlClass.attributes = attributeTexts
}

/**
 * Adds a list of methods to the uml class methods list
 * @param {Fabricjs Group} umlClass Fabric JS Group
 * @param {Array} methodsToAdd Arrray of strings
 */
UmlClass.addMethods = function (umlClass, methodsToAdd) {
  const methodTexts = umlClass.startingMethods.concat(umlClass.userAddedMethods).concat(methodsToAdd)
  umlClass.userAddedMethods = umlClass.userAddedMethods.concat(methodsToAdd)

  umlClass.methods = methodTexts
}

/**
 * Redraws the uml class on the canvas set in {UmlClass}
 * @param {Fabricjs Group} umlClass Fabric JS Group
 */
UmlClass.renderUmlText = function (umlClass) {
  // Refresh list of attributes and methods
  UmlClass.addAttributes(umlClass, [])
  UmlClass.addMethods(umlClass, [])

  const umlClassObjects = umlClass.getObjects()
  const outerRect = umlClassObjects[0]
  const upperRect = umlClassObjects[1]
  const lowerInnerRect = umlClassObjects[2]

  // Class name can be either the third index or the last index
  const classIndex = umlClassObjects[3].type === 'className' ? 3 : umlClassObjects.length - 1
  const className = umlClassObjects[classIndex]

  const numOfStartingAttributes = umlClass.startingAttributes.length

  // remove all the current objects in group
  UmlClass.removeAllObjects(umlClass)

  const leftPad = 4
  const centerOffset = (-1 * outerRect.width / 2)

  const textInUml = []
  const attribHeight = umlClass.umlTextFont * 1.6

  upperRect.height = className.height + 10

  // Reset the height for both attributes
  lowerInnerRect.height = upperRect.height
  outerRect.height = lowerInnerRect.height + attribHeight

  let attribTop = className.top + className.height + umlClass.umlTextFont

  // Make new attribute objects and move the height for each rectangles
  let i = 0
  umlClass.attributes.forEach(attributeText => {
    const newAttribute = new fabric.IText(attributeText, {
      originX: 'left',
      originY: 'center',
      top: attribTop,
      left: outerRect.left + centerOffset + leftPad,
      fontSize: umlClass.umlTextFont,
      type: 'attribute'
    })
    newAttribute.starting = i < numOfStartingAttributes
    newAttribute.index = newAttribute.starting ? i : numOfStartingAttributes - i
    i++

    textInUml.push(newAttribute)
    UmlClass.attachTextHandlers(umlClass, newAttribute)

    attribTop += attribHeight
    outerRect.height += attribHeight
    lowerInnerRect.height += attribHeight
  })

  if (umlClass.attributes.length < 1) {
    outerRect.height += attribHeight * 1.8
    lowerInnerRect.height += attribHeight * 1.8
  }

  const methodHeight = umlClass.umlTextFont * 1.6
  const numOfStartingMethods = umlClass.startingMethods.length

  i = 0
  let methodTop = lowerInnerRect.top + lowerInnerRect.height + umlClass.umlTextFont
  umlClass.methods.forEach(methodText => {
    const newMethod = new fabric.Text(methodText, {
      originX: 'left',
      originY: 'center',
      top: methodTop,
      left: outerRect.left + centerOffset + leftPad,
      fontSize: umlClass.umlTextFont,
      type: 'method'
    })
    newMethod.starting = i < numOfStartingMethods
    newMethod.index = newMethod.starting ? i : numOfStartingMethods - i
    i++

    textInUml.push(newMethod)
    UmlClass.attachTextHandlers(umlClass, newMethod)

    methodTop += methodHeight
    outerRect.height += methodHeight
  })

  if (umlClass.methods.length < 1) {
    outerRect.height += umlClass.height * 0.90
  }

  // Add them all back with update
  umlClass.add(outerRect)
  umlClass.add(upperRect)
  umlClass.add(lowerInnerRect)
  umlClass.add(className)

  textInUml.forEach(attribute => {
    umlClass.add(attribute)
  })

  umlClass.addWithUpdate()

  umlClass.fire('modified')
}

/**
 * Removes all objects from the uml class group
 * @param {Fabricjs Group} umlClass Fabric JS Group
 */
UmlClass.removeAllObjects = function (umlClass) {
  const umlClassObjects = umlClass.getObjects()
  umlClassObjects.forEach(umlClassObject => {
    umlClass.removeWithUpdate(umlClassObject)
  })
}

/**
 * Get the uml class by ID only works on non static diagrams
 * @param {Int} umlClassId id of umlClass
 * @returns {Fabricjs Group} umlClass Fabric JS Group
 */
UmlClass.getUmlClassById = function (umlClassId) {
  if (UmlClass.instances !== undefined) {
    return UmlClass.instances[parseInt(umlClassId)]
  }
  return undefined
}

// Register the element with PL
PLDrawingApi.registerElements('UmlClass', {
  'pl-uml-class': UmlClass
})
