export function dijkstra(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];

  /**
   * Initialize the start node with distance 0
   */
  startNode.distance = 0;
  const unvisitedNodes = getAllNodes(grid);

  /**
   * Repeat until all nodes are visited
   */
  while (!!unvisitedNodes.length) {
    sortNodesByDistance(unvisitedNodes);

    /**
     * The shift() method removes the first element from an array
     * and returns that removed element. This method changes the length
     * of the array.
     */
    const closestNode = unvisitedNodes.shift();

    /**
     * We skip if the node is a wall.
     */
    if (closestNode.isWall) continue;

    /**
     * If the closest node is at a distance of infinity,
     * we must be trapped and should therefore stop.
     */
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    /**
     * We have visited this node, update isVisited to True.
     */
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    /**
     * If we arrived at the end node stop and return the visited
     * nodes in order.
     */
    if (closestNode === finishNode) return visitedNodesInOrder;

    /**
     * Get the Univisited Neighbors, Update their distance and previous node.
     */
    updateUnvisitedNeighbors(closestNode, grid);
  }
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

/**
 * Update the distance of node's neighbors.
 */
function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  unvisitedNeighbors.forEach((neighbor) => {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  });
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;

  /**
   * Get the vertical & horizontal node neighbors and
   * check if the node is inside the grid because we can't get
   * neighbors of corner node
   */
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  /**
   * The filter() method creates a new array with all elements that pass 
   * the test implemented by the provided function.
   */

  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }

  return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];

  /**
   * We start from the finish Node.
   */
  let currentNode = finishNode;

  /**
   * Start node is set to Null, if it's Null that means there
   * are no previous nodes.
   */
  while (currentNode !== null) {
    /**
     * unshift() method is used to add one or more elements to the beginning of the given array.
     */
    nodesInShortestPathOrder.unshift(currentNode);

    /**
     * Check the Previous Node
     */
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
