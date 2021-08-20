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
  let snappingIndex

  if (options.above) {
    snappingIndex = neighbors === 1 ? 0 : 4
  } else {
    snappingIndex = neighbors === 0 ? 5 : 1
  }
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
