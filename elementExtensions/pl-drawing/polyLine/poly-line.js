/*
 This class represnts a Poly Line
 It uses PolyLineHelper heavily to create a base splitable Poly Line
 This class takes a base poly line and adds different endpoint according to "options"
 You can think of this class as a setup class for the many functions in PolyLineHelper

 A line object is essentially it's options needed to be drawn and a reference to it's head and tail node
 Each node in the line has a reference to it's neighbor nodes, nodes are the verts
 The line object can not directly access a node at a specific index, one must loop through the nodes
*/
class PolyLine extends PLDrawingBaseElement {
  /**
     * Generates a UML Line element
     * @param  {Canvas Object} canvas Fabricjs Canvas Object
     * @param  {JSON Object} options contains attribute information
     * @param  {JSON Object} submittedAnswer submitted answer info
     */
  static generate (canvas, options, submittedAnswer) {
    const subObj = Object.assign({}, options)

    if (!('id' in subObj)) {
      subObj.id = PLDrawingApi.generateID()
    }

    PolyLine.canvas = canvas

    // If on a user interactable canvas
    if (canvasHelper.isCanvasInteractable(canvas)) {
      PolyLineHelper.canvas = canvas
      PolyLineHelper.submittedAnswer = submittedAnswer
      const line = PolyLine.generateDrawing(canvas, subObj, submittedAnswer)
      PolyLine.saveInstances(line)
    } else {
      const interactableCanvas = PolyLineHelper.canvas
      PolyLineHelper.canvas = canvas
      if ('keyIDs' in subObj) {
        subObj.nodes = PolyLineHelper.connectKeys(subObj)
      }
      PolyLine.generateDrawing(canvas, subObj, submittedAnswer)
      PolyLineHelper.canvas = interactableCanvas
    }
  }

  static get_button_icon (options) {
    return 'poly-line.svg'
  }

  static get_button_tooltip (options) {
    return 'Add ' + options.umlLineType + ' line.'
  }
}

/**
 * Creates endpoints given a base line
 * @param {JSON Object} line base line, this must the object returned from PolyLineHelper.generateBaseLine
 * @param {JSON Object} options options coming from html or submitted answers
 */
PolyLine.createEndpoints = function (line, options) {
  if (line.end1Shape !== 'circle') {
    // Create the endpoint given the line options
    const end1 = PolyLineHelper.shapeFnc[line.end1Shape](line, [line.end1.left, line.end1.top], fill = line.end1Fill)
    PolyLine.replaceEnd(line.end1, end1)

    const p1 = { x: end1.nextLine.x2, y: end1.nextLine.y2 }
    const p2 = { x: end1.nextLine.x1, y: end1.nextLine.y1 }

    PolyLineHelper.applyLineAngle(end1, p1, p2)
  }

  if (line.end2Shape !== 'circle') {
    // Create the endpoint given the line options
    const end2 = PolyLineHelper.shapeFnc[line.end2Shape](line, [line.end2.left, line.end2.top], fill = line.end2Fill)
    PolyLine.replaceEnd(line.end2, end2)

    const p1 = { x: end2.prevLine.x1, y: end2.prevLine.y1 }
    const p2 = { x: end2.prevLine.x2, y: end2.prevLine.y2 }

    PolyLineHelper.applyLineAngle(end2, p1, p2)
  }

  PolyLine.endPointSetUp(line.end1, options.end1)
  PolyLine.endPointSetUp(line.end2, options.end2)
}

/**
 * Sets up the endpoint with it's handlers
 * @param {Fabricjs Object} endpoint An endpoint of a line
 * @param {Fabricjs Object} optionsForEndpoint Specific options for endpoint
 */
PolyLine.endPointSetUp = function (endpoint, optionsForEndpoint) {
  // This applies the submitted answers coordinates
  if (optionsForEndpoint !== undefined) {
    endpoint.left = optionsForEndpoint.left
    endpoint.top = optionsForEndpoint.top
  }
  PolyLineHelper.rotationHandler(endpoint)
  PolyLineHelper.attachRotationHandler(endpoint)
  PolyLineHelper.attachSnapHandler(endpoint)
}

/**
 * Generates a base line and modifies endpoints if necessary
 * @param  {Canvas Object} canvas Fabricjs Canvas Object
 * @param  {JSON Object} options contains attribute information
 * @param  {JSON Object} submittedAnswer submitted answer info
 * @returns {JSON Object} line object including end1 and end2
 */
PolyLine.generateDrawing = function (canvas, options, submittedAnswer) {
  const line = PolyLineHelper.generateBaseLine(canvas, options, submittedAnswer)
  PolyLine.createEndpoints(line, options)
  canvas.renderAll()
  return line
}

/**
 * Saves the endpoints in a dict for other objects to access
 * @param {JSON Object} line base line, this must the object returned from PolyLineHelper.generateBaseLine
 */
PolyLine.saveInstances = function (line) {
  if (PolyLine.instances === undefined) {
    PolyLine.instances = {}
  }
  const idString = parseInt(line.id)
  PolyLine.instances[idString] = [line.end1, line.end2]
}

PLDrawingApi.registerElements('polyLine', {
  'pl-poly-line': PolyLine
})
