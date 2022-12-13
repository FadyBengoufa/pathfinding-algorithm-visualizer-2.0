// https://github.com/rohithaug/pathfinding-visualizer/blob/master/src/mazeAlgorithms/recursiveDivision.js

let walls;
export function recursiveDivision(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) return false;

  /**
   * Vertical = [0, 1, 2, 3, ... 49] an Array of Grid Columns
   * Horizontal = [0, 1, 2, 3, ... 19] an Array of Grid Rows
   */
  let vertical = range(grid[0].length);
  let horizontal = range(grid.length);
  walls = [];

  /**
   * The placement of the wall, as well as its direction, is random.
   * However, in this particular implementation of the algorithm,
   * the decision to build a vertical or horizontal wall is weighted based on
   * the shape of the area being divided.
   */
  getRecursiveWalls(vertical, horizontal, grid, startNode, finishNode);

  return walls;
}

function range(len) {
  let result = [];
  for (let i = 0; i < len; i++) {
    result.push(i);
  }
  return result;
}

//direction === 0 => Horizontal
//direction === 1 => Vertical

function getRecursiveWalls(vertical, horizontal, grid, startNode, finishNode) {
  /**
   * this is the BASE CASE for our recursive division maze funtion.
   * Stopping the function 
   */
  if (vertical.length < 2 || horizontal.length < 2) return;

  let dir;
  let num;
  /**
   * if the area has width w and height h, a random integer from 0 to w+h is chosen.
   * If the value is less than w, the division is vertical.
   * This ensures that a wider area is more likely to be divided by a vertical wall, and a narrow area is more likely to be cut horizontally. This is purely for aesthetics.
   */
  if (vertical.length > horizontal.length) {
    dir = 0;
    /**
     * Generate only odd or pair numbers otherwise it will fill the whole 
     * grid.
     */
    num = generateOddRandomNumber(vertical);
    // console.log("VERTICAL SPLIT NUMBER : ", num);
  }
  if (vertical.length <= horizontal.length) {
    dir = 1;
    num = generateOddRandomNumber(horizontal);
    // console.log("HORIZONTAL SPLIT NUMBER : ", num);
  }
  if (dir === 0) {
    // console.log(vertical.slice(0, vertical.indexOf(num)));
    // console.log(vertical.slice(vertical.indexOf(num) + 1));
    addWall(dir, num, vertical, horizontal, startNode, finishNode);
    getRecursiveWalls(
      /**
       * This returns a copy of the vertical array,
       * Let's say randomly the grid will be split of col 15 (vertically)
       * We call the recursive function with vertical is an array [0... 14] to split the
       * rest of the wall, in this case it will be a horizontal split because
       * height is 20 and width is 15.
       */
      vertical.slice(0, vertical.indexOf(num)),
      horizontal,
      grid,
      startNode,
      finishNode
    );
    /**
     * This will split the other side of the grid
     * [16... 49]
     */
    getRecursiveWalls(
      vertical.slice(vertical.indexOf(num) + 1),
      horizontal,
      grid,
      startNode,
      finishNode
    );
  } else {
    addWall(dir, num, vertical, horizontal, startNode, finishNode);
    getRecursiveWalls(
      vertical,
      horizontal.slice(0, horizontal.indexOf(num)),
      grid,
      startNode,
      finishNode
    );
    getRecursiveWalls(
      vertical,
      horizontal.slice(horizontal.indexOf(num) + 1),
      grid,
      startNode,
      finishNode
    );
  }
}

//dir === 0 => Horizontal
//dir === 1 => Vertical

function addWall(dir, num, vertical, horizontal, startNode, finishNode) {
  let isStartFinish = false;
  let tempWalls = [];
  if (dir === 0) {
    if (horizontal.length === 2) return;
    for (let temp of horizontal) {
      /**
       * We are checking if the split don't block the start or finish node.
       */
      if (
        (temp === startNode.row && num === startNode.col) ||
        (temp === finishNode.row && num === finishNode.col)
      ) {
        isStartFinish = true;
        continue;
      }
      tempWalls.push([temp, num]);
    }
  } else {
    if (vertical.length === 2) return;
    for (let temp of vertical) {
      if (
        (num === startNode.row && temp === startNode.col) ||
        (num === finishNode.row && temp === finishNode.col)
      ) {
        isStartFinish = true;
        continue;
      }
      tempWalls.push([num, temp]);
    }
  }
  if (!isStartFinish) {
    /**
     * Create a Hole in every Wall Created.
     * Splice: changes the array by adding/removing an element.
     * Syntax: splice(start, deleteCount)
     */
    tempWalls.splice(generateRandomNumber(tempWalls.length), 1);
  }
  
  for (let wall of tempWalls) {
    walls.push(wall);
  }
}

/**
 * This function is to generate a random number to create a hole 
 * in every created wall.
 */
function generateRandomNumber(max) {
  let randomNum =
    Math.floor(Math.random() * (max / 2)) +
    Math.floor(Math.random() * (max / 2));
  if (randomNum % 2 !== 0) {
    if (randomNum === max) {
      randomNum -= 1;
    } else {
      randomNum += 1;
    }
  }
  return randomNum;
}

function generateOddRandomNumber(array) {
  let max = array.length - 1;
  let randomNum =
    Math.floor(Math.random() * (max / 2)) +
    Math.floor(Math.random() * (max / 2));
  if (randomNum % 2 === 0) {
    if (randomNum === max) {
      randomNum -= 1;
    } else {
      randomNum += 1;
    }
  }
  return array[randomNum];
}
