class UmlText extends PLDrawingBaseElement {
  /**
  * Generates a relation-umlClass-umlText that can be appended to a umlClass
  * @param  {Canvas Object} canvas Fabricjs Canvas Object
  * @param  {JSON Object} options contains umlText information
  * @param  {JSON Object} submittedAnswer submitted answer info, parsed
  */
  static generate (canvas, options, submittedAnswer) {
    const umlText = UmlText.createUmlText(options)
    umlText.left = options.coordinates[0]
    umlText.top = options.coordinates[1]
    umlText.setCoords()
    umlText.options = options

    UmlText.canvas = canvas

    canvas.add(umlText)

    UmlText.attachMovementHandler(umlText)
    UmlText.attachModifiedHandler(umlText)

    return umlText
  }

  /**
  * gets button tool tip when user hovers over button
  * @param  {JSON Object} options contains umlText information
  * @return {String} string to display
  */
  static get_button_tooltip (options) {
    return 'Add ' + options.textType
  }

  static get_button_icon (options) {
    return 'uml-'+ options.textType +'.svg'
  }
}

/**
 * Creates an umlText that is modifable
 * @param  {JSON Object} options contains umlText information
 * @returns Fabricjs group
 */
UmlText.createUmlText = function (options) {
  // Modifiable text
  return new fabric.IText(options.startingText, {
    fontSize: options.fontSize,
    originX: 'center',
    originY: 'center',
    id: options.id,
    originX: 'left',
    originY: 'center',
    left: options.coordinates[0],
    top: options.coordinates[1],
    textType: options.textType,
    lockScalingX: true,
    lockScalingY: true,
    hasControls: false,
    hasBorders: false,
    hasRotatingPoint: false,
    tag: 'umlText',
    umlClassId: null,
    displaySnappingIndicator: UmlText.displaySnappingIndicator,
    removeSnappingIndicator: UmlText.removeSnappingIndicator,
  })
}


/**
 * Saves the data of a uml class the umlText is hovering over
 * @param {Fabricjs Group} umlText umlText object
 */
UmlText.snapToUmlClass = function (umlText, event) {
  if (UmlClass.instances !== undefined) {
    Object.values(UmlClass.instances).forEach(umlClass => {
      // Get the umlClass's snapping point for umlTexts
      // If near the snapping point
      if (umlClass.intersectsWithObject(umlText)) {
        umlText.umlClassId = umlClass.id

        umlText.displaySnappingIndicator()
        umlClass.displaySnappingIndicator()
      }
  })
  }
}

/**
 * Attaches movement handler
 * @param {Fabricjs Group} umlText umlText object
 */
UmlText.attachMovementHandler = function (umlText) {
  umlText.on('moving', function (event) {
    // If umlText was hovering over a uml class
    const umlClass = UmlClass.getUmlClassById(umlText.umlClassId)
    if (umlClass !== null && umlClass !== undefined ) {
      umlClass.removeSnappingIndicator()
    }

    umlText.removeSnappingIndicator()
    umlText.umlClassId = null
    // Tries to snap to umlClass
    UmlText.snapToUmlClass(umlText, event)
  })
}

/**
 * Attaches a modify handler, used for after the umlText is snapped
 * Fires when done moving
 * @param {Fabricjs Group} umlText umlText object
 */
UmlText.attachModifiedHandler = function (umlText) {
  umlText.on('modified', function () {
    UmlText.addumlTextToUmlClass(umlText)
  })
}

/**
 * Tries to add umlText to a umlClass
 * @param {Fabricjs Group} umlText umlText object
 */
UmlText.addumlTextToUmlClass = function (umlText) {
  var umlClass = UmlClass.getUmlClassById(umlText.umlClassId)
  if (umlClass !== undefined) {
    if (umlText.textType === 'attribute') {
      UmlClass.addAttributes(umlClass, umlText.text)
    } else if (umlText.textType === 'method'){
      UmlClass.addMethods(umlClass, umlText.text)
    }
    UmlClass.renderUmlText(umlClass)
    UmlText.canvas.remove(umlText)
    delete umlText
  }
}


/**
 * Checks if a umlText is near a point
 * Check from the midpoint
 * @param {Fabricjs Group} umlText umlText object
 * @param {float} x x coord of point
 * @param {float} y y coord of point
 * @param {float} tolerance tolerance used (range)
 * @returns True if near point, False otherwise
 */
UmlText.isNearPoint = function (umlText, x, y, tolerance) {
  return (
    Math.abs(x - (umlText.left + umlText.width / 2)) < tolerance &&
        Math.abs(y - (umlText.top + umlText.height / 2)) < tolerance
  )
}

/**
 * Removes the umlText from the canvas
 * Updates the list of umlTexts on canvas as well
 * @param {Fabricjs Group} umlText umlText object
 */
UmlText.delete = function (umlText) {
  UmlText.canvas.remove(umlText)
}

/**
 * Displays snapping indicator
 */
UmlText.displaySnappingIndicator = function () {
  this.set('fill', '#007BFF')
}

/**
 * Removes snapping indicator
 */
UmlText.removeSnappingIndicator = function () {
  this.set('fill', 'black')
}

PLDrawingApi.registerElements('umlText', {
  'pl-uml-text': UmlText
})