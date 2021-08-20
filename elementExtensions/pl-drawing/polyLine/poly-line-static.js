/**
 * This function connects the endpoints of the poly-line to those keys and inserts intermediate nodes into the line.
 * It is called when the attribute "key-ids" is present.
 * @param options contains attribute information
 * @returns {*[]} a list of nodes that define the poly-line
 */
PolyLineHelper.connectKeys = function (options) {
  const endNodes = []
  const endNodeAbove = []
  // retrieve each key
  const keyIDs = options.keyIDs
  const keys = [Key.getKeyById(keyIDs[0]), Key.getKeyById(keyIDs[1])]
  // find the necessary coordinates
  for (let i = 0; i < keys.length; i++) {
    const snappingPoints = keys[i].getSnappingPoints(this.canvas)
    const point = snappingPoints[snappingPoints.length - 1]
    const endNode = { left: point.x, top: point.y }
    // determine if the line connected to the top of a key or the bottom
    // this will effect placement of intermediate nodes
    if (keys[i].top === endNode.top) {
      endNodeAbove.push(true)
    } else {
      endNodeAbove.push(false)
    }
    endNodes.push(endNode)
  }
  const nodes = PolyLineHelper.shapeLine(endNodes, endNodeAbove, options)
  return nodes
}

/**
 * This function checks if a position on the canvas is clear,
 * in this case we can draw the line on this position.
 * @param coordinate a node object (with "left" and "top" members) denoting a position on the canvas
 * @param grid the size of the grid
 * @returns {boolean} true if the position specified by coordinate is clear
 */
PolyLineHelper.isClear = function (coordinate, grid) {
  let clear = true
  const objectsOnCanvas = PolyLineHelper.canvas.getObjects()
  // loop through objects, check if any other object is over coordinate
  for (let i = 0; i < objectsOnCanvas.length; i++) {
    const object = objectsOnCanvas[i]
    if ('tag' in object || 'text' in object) {
      const coords = object.aCoords
      // if the coordinate is within than a 1/4 grid to the object then it is not clear
      const tolerance = grid * 0.25
      if (coordinate.left <= coords.tr.x + tolerance && coordinate.left >= coords.tl.x - tolerance) {
        if (coordinate.top <= coords.bl.y + tolerance && coordinate.top >= coords.tl.y - tolerance) {
          clear = false
        }
      }
    }
  }
  return clear
}

/**
 * This function examines a vertices that this line might occupy and uses a heuristic to sort the candidates
 * in a reverse order (so that the next node can popped from the array by caller).
 * @param currentPosition a node object denoting current position
 * @param candidates a list of node objects that might be next position in the line
 * @param endPosition the point that the line is working toward
 * @param currentDirection a node object denoting the direction of travel
 * @returns {*[]} an array of node objects, the last one
 */
PolyLineHelper.calculateHeuristic = function (currentPosition, candidates, endPosition, currentDirection) {
  const orderedCandidates = []
  const scores = []
  let lowestScore = 0
  let tieExists = false
  for (let i = 0; i < candidates.length; i++) {
    const score = Math.abs(endPosition.left - candidates[i].left) + Math.abs(endPosition.top - candidates[i].top)
    scores.push(score)
    tieExists = score === lowestScore
    lowestScore = score < lowestScore || lowestScore === 0 ? score : lowestScore
    orderedCandidates.push(candidates[i])
  }

  // order candidates by score with insertion sort
  for (let i = 1; i < orderedCandidates.length; i++) {
    const currentElement = scores[i]
    const currentCandidate = orderedCandidates[i]
    let j = i - 1
    while (j >= 0 && scores[j] < scores[i]) {
      // move the j index one forward
      scores[j + 1] = scores[j]
      orderedCandidates[j + 1] = orderedCandidates[j]
      j = j - 1
    }
    scores[j + 1] = currentElement
    orderedCandidates[j + 1] = currentCandidate
  }

  // check for ties, if one exists take the highest scoring candidate that continues in the current direction and move it to the head of the array
  if (tieExists) {
    for (let i = orderedCandidates.length - 2; i > 0; i--) {
      if (scores[i] === lowestScore) {
        // Apply tiebreaker to the straight line path
        if (currentPosition.left + currentDirection.left === orderedCandidates[i].left && currentPosition.top + currentDirection.top === orderedCandidates[i].top) { // FIXME don't use currentDirection
          const nextVertex = orderedCandidates[i]
          const temp = orderedCandidates[orderedCandidates.length]
          orderedCandidates[i] = temp
          orderedCandidates[orderedCandidates.length] = nextVertex
        }
      }
    }
  }

  return orderedCandidates
}

/**
 *  Checks if the direction of travel has changed.
 * @param next the next position the line will occupy
 * @param last the last position the line will occupy
 * @returns {boolean} true if the direction of travel has changed
 */
PolyLineHelper.hasChangedDirection = function (next, last) {
  let directionChange = false
  const run = next.left - last.left
  // Any slope other than 0 or undefined indicate a turn will occur
  if (run !== 0) {
    const rise = next.top - last.top
    if (rise / run !== 0) {
      directionChange = true
    }
  }
  return directionChange
}

/**
 * Checks if a given position has been visited already by the line.
 * @param visited an array of positions that have been visited already
 * @param coordinate the coordinate we are checking for in the array of visited positions
 * @returns {boolean} true if the coordinate has been visited
 */
PolyLineHelper.hasBeenVisited = function (visited, coordinate) {
  if (coordinate.left in visited) {
    if (coordinate.top in visited[coordinate.left]) {
      if (visited[coordinate.left][coordinate.top]) {
        return true
      }
    }
  } else {
    return false
  }
}

/**
 * Adds a coordinate to an array of visited nodes.
 * @param visited an array
 * @param coordinate a node object
 * @returns {*} the array visited, updated with coordinate
 */
PolyLineHelper.addToVisited = function (visited, coordinate) {
  if (coordinate.left in visited) {
    visited[coordinate.left][coordinate.top] = true
  } else {
    visited[coordinate.left] = {}
    visited[coordinate.left][coordinate.top] = true
  }
  return visited
}

/**
 * Given a position, determine what adjacent positions might serve as the next position in a line.
 * @param lastVertex the last vertex visited
 * @param currentVertex the current position
 * @param endVertex the goal state the line is working toward
 * @param grid the size of the grid
 * @returns {*[]} a list of node objects
 */
PolyLineHelper.findAdjacentVertices = function (lastVertex, currentVertex, endVertex, grid) {
  // for top and left: is the end vertex closer than one grid?
  const leftDifference = Math.abs(endVertex.left - currentVertex.left)
  const topDifference = Math.abs(endVertex.top - currentVertex.top)
  let stepSize
  if (leftDifference < grid) {
    stepSize = leftDifference > 1 ? leftDifference : 1
  } else if (topDifference < grid && topDifference < leftDifference) {
    stepSize = topDifference > 1 ? topDifference : 1
  } else {
    stepSize = grid
  }

  const adjacentVertices = [
    { left: currentVertex.left, top: currentVertex.top - stepSize }, // move up
    { left: currentVertex.left + stepSize, top: currentVertex.top }, // move right
    { left: currentVertex.left, top: currentVertex.top + stepSize }, // move down
    { left: currentVertex.left - stepSize, top: currentVertex.top } // move left
  ]
  // From the adjacent vertices determine which ones are available
  const availableVertices = []
  for (let i = 0; i < adjacentVertices.length; i++) {
    // Check that vertex hasn't been visited previously
    if (Math.abs(adjacentVertices[i].left - lastVertex.left) >= stepSize || Math.abs(adjacentVertices[i].top - lastVertex.top) >= stepSize) {
      if (PolyLineHelper.isClear(adjacentVertices[i], grid)) {
        availableVertices.push(adjacentVertices[i])
      }
    }
  }

  return availableVertices
}

/**
 * Given two node objects, determine the intermediate nodes needed to connect the nodes with only right angles.
 * @param existingNodes a list of existing nodes in the line
 * @param startPosition the first 'end' node
 * @param endPosition the second 'end' node
 * @param visitedVertices vertices that have been visited by the line
 * @param grid the size of the grid
 * @param direction the initial direction of travel
 * @returns {*[]} an array of intermediate nodes
 */
PolyLineHelper.findPath = function (existingNodes, startPosition, endPosition, visitedVertices, grid, direction) {
  const pathVertices = []
  let visited = visitedVertices
  const unvisited = []
  let currentPosition = startPosition
  let lastPosition = existingNodes[0]
  const currentDirection = direction
  const maxIterations = 100
  let count = 0
  // check that we are not at our destination
  // while (currentPosition !== endPosition && count < maxIterations) {
  while ((Math.abs(currentPosition.left - endPosition.left) > grid || Math.abs(currentPosition.top - endPosition.top) > grid) && count < maxIterations) {
    count = count + 1
    const vertices = PolyLineHelper.findAdjacentVertices(lastPosition, currentPosition, endPosition, grid)
    for (let i = vertices.length - 1; i >= 0; i--) {
      if (PolyLineHelper.hasBeenVisited(visited, vertices[i])) {
        vertices.splice(i, 1)
      }
    }
    // FIXME solve for case where no adjacent vertices exist (pop from unvisited)
    // create list ordered by heuristic score: the first element of list is the least best option, the last is the best
    const scoredVertices = PolyLineHelper.calculateHeuristic(currentPosition, vertices, endPosition, currentDirection)
    if (scoredVertices.length === 0) {
      // debugger;
    }
    const nextVertex = scoredVertices.pop()
    if (nextVertex !== undefined) {
      // if direction has changed, record a new node, then change the currentDirection
      if (PolyLineHelper.hasChangedDirection(nextVertex, lastPosition)) {
        // debugger;
        if ((currentPosition.left !== startPosition.left) || (currentPosition.top !== startPosition.top)) {
          pathVertices.push(currentPosition)
        }
        currentDirection.left = nextVertex.left - currentPosition.left
        currentDirection.top = nextVertex.top - currentPosition.top
      }
      lastPosition = currentPosition
      currentPosition = nextVertex
      visited = PolyLineHelper.addToVisited(visited, currentPosition)
      // extend unvisited with the rest
      unvisited.concat(scoredVertices) // FIXME might remove
    }
  }

  return pathVertices
}

/**
 * Given the end nodes of a PolyLineHelper, connect the line with neat right angles.
 * @param endNodes an array of nodes
 * @param above a boolean indicating if the line starts above a scheme
 * @param options contains attribute information
 * @returns {*[]} a list of nodes that define the poly-line
 */
PolyLineHelper.shapeLine = function (endNodes, above, options) {
  const nodes = [endNodes[0]]
  const unit = 2 * options.gridSize // FIXME
  // Define two nodes roughly 1-2 grids away from endNodes
  // These are to ensure legibility
  for (let i = 0; i < endNodes.length; i++) {
    let newNode
    if (above[i]) {
      // If above the key: draw a node one grid below
      newNode = { left: endNodes[i].left, top: endNodes[i].top - unit }
    } else {
      // If below: draw a node one grid above
      newNode = { left: endNodes[i].left, top: endNodes[i].top + unit }
    }
    // the newNode is not on a horizontal grid line then adjust it to on one
    if (newNode.top % options.gridSize > 1) {
      if (newNode.top > endNodes[i].top) {
        newNode.top = newNode.top + Math.floor(options.gridSize / 2)
      } else {
        newNode.top = newNode.top + Math.floor(options.gridSize / 2)
      }
    }
    nodes.push(newNode)
  }
  // Add final node in path to list
  nodes.push(endNodes[1])

  // record vertices crossed by existing segments of this line as having been visited
  const visited = {}
  // first line segment: nodes[1] to nodes[0]
  PolyLineHelper.addToVisited(visited, nodes[1])
  let direction = nodes[1].top > nodes[0].top ? options.gridSize : (-1 * options.gridSize)
  let currentLeft = nodes[1].left
  let currentTop = nodes[1].top
  let verticesToVisit = Math.abs(nodes[1].top - nodes[0].top) / options.gridSize
  while (verticesToVisit >= 1) {
    currentTop = currentTop + direction
    PolyLineHelper.addToVisited(visited,
      {
        left: currentLeft,
        top: currentTop
      })
    verticesToVisit--
  }
  // second line segment: nodes[2] to nodes[3]
  PolyLineHelper.addToVisited(visited, nodes[2])
  direction = nodes[2].top < nodes[3].top ? options.gridSize : (-1 * options.gridSize)
  currentLeft = nodes[2].left
  currentTop = nodes[2].top
  verticesToVisit = Math.abs(nodes[2].top - nodes[3].top) / options.gridSize
  while (verticesToVisit >= 1) {
    currentTop = currentTop + direction
    PolyLineHelper.addToVisited(visited,
      {
        left: currentLeft,
        top: currentTop
      })
    verticesToVisit--
  }

  // Define start and end nodes
  const start = nodes[1]
  const end = nodes[2]
  let starting_direction
  // Determine initial direction
  if (nodes[0].top < nodes[1].top) {
    starting_direction = { left: 0, top: options.gridSize }
  } else {
    starting_direction = { left: 0, top: options.gridSize * -1 }
  }
  // Determine intermediate nodes for poly-line
  const intermediateNodes = PolyLineHelper.findPath(nodes, start, end, visited, options.gridSize, starting_direction)
  // Add intermediate nodes to list of nodes
  nodes.splice(2, 0, ...intermediateNodes)

  return nodes
}
