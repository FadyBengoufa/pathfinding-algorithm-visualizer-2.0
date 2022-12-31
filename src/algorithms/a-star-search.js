/**
 * https://gist.githubusercontent.com/RanjanSushant/4dd689b7c95cb7ccf56c41dcfc8db22e/raw/5e6494ba7f83d327137742fbb50685793f8ec1b8/Astar.js
 */
export function a_star(grid, startNode, finishNode) {
  /**
   * A* Algorithm works by computing the lowest cost path from
   * the START NODE to the end END NODE.
   *
   * A* is an heuristic function.
   * F is the cost of one node to another -> f(n)=g(n)+h(n)
   *
   * f(n) = total estimated cost of path through node n
   * g(n)g(n) = cost so far to reach node n
   * h(n) = estimated cost from nn to goal. This is the heuristic part of the cost function, so it is like a guess.
   */

  // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
  startNode.g_cost = 0;
  startNode.h_cost = manhattan_distance(
    startNode.col,
    startNode.row,
    finishNode.col,
    finishNode.row
  );
  // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
  // how cheap a path could be from start to finish if it goes through n.
  startNode.f_cost = startNode.h_cost;

  let openList = [];
  let closedList = [];

  openList.push(startNode);

  // const visitedNodesInOrder = [];

  while (!openList.length == 0) {
    /**
     * Get the node with the lowest f_score
     */
    let lowestIndex = 0;
    for (let i = 0; i < openList.length; i++) {
      if (openList[i].f_score < openList[lowestIndex].f_score) {
        lowestIndex = i;
      }
    }

    let currentNode = openList[lowestIndex];

    currentNode.isVisited = true;

    let shortestPathNodes = [];
    if (currentNode.isFinish) {
      let temp = currentNode;
      shortestPathNodes.push(temp);
      while (temp.previousNode) {
        shortestPathNodes.push(temp.previousNode);
        temp = temp.previousNode;
      }
      console.log("DONE!");
      return shortestPathNodes;
    }

    const currentNodeUnvisitedNeighbors = getUnvisitedNeighbors(
      currentNode,
      grid
    );

    openList.splice(lowestIndex, 1);
    closedList.push(currentNode);
    const BreakError = {};
    /**
     * Try Catch BLOCK added to avoid the error
     * of https://bobbyhadz.com/blog/typescript-jump-target-cannot-cross-function-boundary
     */
    try {
      currentNodeUnvisitedNeighbors.forEach((neighbor) => {
        /**
         * SKIP the neighbor if it's a WALL.
         */
        if (!neighbor.isWall) {
          if (
            !closedList.some(
              (node) => node.col === neighbor.col && node.row === neighbor.row
            )
          ) {
            /**
             * the distance from neighbor to current is incremented
             * every time by +1
             */
            let possibleG = currentNode.g_cost + 1;
            if (
              !openList.some(
                (node) => node.col === neighbor.col && node.row === neighbor.row
              )
            ) {
              openList.push(neighbor);
            } else if (possibleG >= neighbor.g_cost) throw BreakError;

            neighbor.g_cost = possibleG;
            /**
             * Computing the h(n) which is the manhattan distance (the total number of squares horizontally and vertically to reach the END NODE from the current NODE)
             *
             */
            neighbor.h_cost = manhattan_distance(
              neighbor.col,
              neighbor.row,
              finishNode.col,
              finishNode.row
            );
            neighbor.f_cost = neighbor.g_cost + neighbor.h_cost;
            neighbor.isVisited = true;
            neighbor.previousNode = currentNode;

            // visitedNodesInOrder.push(neighbor);
          }
        }
      });
    } catch (error) {
      if (error !== BreakError) throw error;
    }
  }

  return [];
}

function getUnvisitedNeighbors(node, grid) {
  const { col, row } = node;
  const neighbors = [];

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

export function manhattan_distance(
  node_col,
  node_row,
  finishNodeCol,
  finishNodeRow
) {
  return (
    Math.abs(node_row - finishNodeRow) + Math.abs(node_col - finishNodeCol)
  );
}

export function euclidean_distance(
  node_col,
  node_row,
  finishNodeCol,
  finishNodeRow
) {
  return Math.sqrt(
    Math.pow(node_row - finishNodeRow) + Math.pow(node_col - finishNodeCol)
  );
}
