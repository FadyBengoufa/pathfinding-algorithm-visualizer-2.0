import React, { Component } from "react";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import { recursiveDivision } from "../mazes/recursive-division";
import Header from "./Header";
import Node from "./Node";
import "./PathfindingVisualizer.css";

const START_NODE_ROW = 2;
const START_NODE_COL = 3;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 20;
const GRID_ROWS = 20;
const GRID_COLS = 50;

const SPEED = 10;
const SPEED_SHORT_PATH = 50;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      maze_walls: [],
      algorithmsList: [
        { value: "", label: "Algorithms" },
        { value: "Dijkstra's", label: "Dijkstra's Algorithm" },
        { value: "A* Search", label: "A* Search" },
      ],
      selectedAlgorithm: "",
    };
  }

  componentDidMount() {
    document.title = "Pathfinding Visualizer";
    /**
     * Create an empty Board
     */
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  handleMouseDown(e, row, col) {
    if (!e.button) {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }
  }

  handleMouseEnter(row, col) {
    // if mouse isn't pressed don't do anything
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid, mouseIsPressed: true });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  spawnNewFinishPath() {
    const grid = this.state.grid;
    const newGrid = grid.slice();
    const finishNode = newGrid[FINISH_NODE_ROW][FINISH_NODE_COL];

    /**
     * Change Start Node each time we click on spawn new path button.
     */
    const NEW_FINISH_NODE_ROW = Math.floor(Math.random() * GRID_ROWS);
    const NEW_FINISH_NODE_COL = Math.floor(Math.random() * GRID_COLS);

    const newFinishNode = {
      ...finishNode,
      col: NEW_FINISH_NODE_COL,
      row: NEW_FINISH_NODE_ROW,
      isFinish: true,
    };

    /**
     * Update the rest to non start nodes.
     */

    for (const row of newGrid) {
      for (const node of row) {
        node.isFinish = false;
      }
    }

    /**
     * Update the Start Node to the new one.
     */
    newGrid[NEW_FINISH_NODE_ROW][NEW_FINISH_NODE_COL] = newFinishNode;

    this.setState({ grid: newGrid });
  }

  spawnNewStartPath() {
    /**
     * Clear Board when spawning a new start path.
     */
    this.clearBoard();
    const grid = this.state.grid;
    const newGrid = grid.slice();
    const startNode = newGrid[START_NODE_ROW][START_NODE_COL];

    /**
     * Change Start Node each time we click on spawn new path button.
     */
    const NEW_START_NODE_ROW = Math.floor(Math.random() * GRID_ROWS);
    const NEW_START_NODE_COL = Math.floor(Math.random() * GRID_COLS);

    const newStartNode = {
      ...startNode,
      col: NEW_START_NODE_COL,
      row: NEW_START_NODE_ROW,
      isStart: true,
    };

    /**
     * Update the rest to non start nodes.
     */

    for (const row of newGrid) {
      for (const node of row) {
        node.isStart = false;
      }
    }

    /**
     * Update the Start Node to the new one.
     */
    newGrid[NEW_START_NODE_ROW][NEW_START_NODE_COL] = newStartNode;

    this.setState({ grid: newGrid });
  }

  clearBoard() {
    console.log("CLEARING THE BOARD...");
    const newGrid = getInitialGrid();

    this.setState({ grid: newGrid });
    this.setState({ maze_walls: [] });
    /**
     * Remove the styles of the nodes.
     */
    for (const row of newGrid) {
      for (const node of row) {
        const element = document.getElementById(`node-${node.row}-${node.col}`);

        element.classList.remove("node-visited");
        element.classList.remove("node-shortest-path");
        element.classList.remove("node-maze");
      }
    }

    document.getElementById("no-path").style.display = "none";
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    console.log("Animating Dijkstra...");
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, SPEED * i);
        return;
      }

      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        /**
         * Keep the start node style, it's the first element in the visitedNodesInOrder
         * array because it has the lowest distance.
         */
        if (node != visitedNodesInOrder[0])
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";

        document.getElementById(
          `node-${node.row}-${node.col}`
        ).firstChild.innerHTML = node.distance;
      }, SPEED * i);

      const checkIfArrived =
        visitedNodesInOrder[visitedNodesInOrder.length - 1];
      if (!checkIfArrived.isFinish)
        document.getElementById("no-path").style.display = "block";
    }
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    const startNode = getStartNode(grid);
    const finishNode = getFinishNode(grid);
    /**
     * Pass the start node and End node to the Algorithm
     */
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  animateShortestPath(nodesInShortestPathOrder) {
    console.log("Animating Shortest Path...");
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        const startNode = getStartNode(this.state.grid);
        const finishNode = getFinishNode(this.state.grid);
        // document.getElementById(`node-${START_NODE_ROW}-${START_NODE_ROW}`);
        if (startNode.row === node.row && startNode.col === node.col) {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path-start";
        } else {
          if (finishNode.row === node.row && finishNode.col === node.col) {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-shortest-path-end";
          } else {
            document.getElementById(`node-${node.row}-${node.col}`).className =
              "node node-shortest-path";
          }
        }
      }, SPEED_SHORT_PATH * i);
    }
  }

  createRecursiveDivisionMaze() {
    this.clearBoard();
    const { grid } = this.state;
    const startNode = getStartNode(grid);
    const finishNode = getFinishNode(grid);

    const walls = recursiveDivision(grid, startNode, finishNode);
    this.setState({ maze_walls: walls });

    /**
     * Animate the maze
     */
    console.log("ANIMATING THE MAZE...");
    const newGrid = grid.slice();
    for (let i = 0; i < walls.length; i++) {
      setTimeout(() => {
        const wall = walls[i];
        const node = newGrid[wall[0]][wall[1]];

        newGrid[node.row][node.col].isWall = true;

        document.getElementById(`node-${wall[0]}-${wall[1]}`).className =
          "node node-maze";
      }, 10 * i);
    }

    /**
     * To Change the Status of the maze walls to isWall True and Update
     * the state of the maze.
     */
    this.setState({ grid: newGrid });
  }

  // recursiveDivisionTest(numerator, denominator){
  //   let counter = 0;
  //   if(numerator < denominator) return counter;
  //   counter = counter + 1;
  //   console.log(
  //     `${numerator} - ${denominator} = ${numerator - denominator}`
  //   );
  //   return this.recursiveDivisionTest(numerator - denominator, denominator) + counter;
  // }

  handleOnChangelAlgorithm = (e) => {
    console.log(this.state.algorithmsList);
    this.setState({ selectedAlgorithm: e.target.value });
  };

  render() {
    const { grid, mouseIsPressed, selectedAlgorithm, algorithmsList } =
      this.state;
    return (
      <>
        {/* <Header selectedAlgorithm={selectedAlgorithm} /> */}
        <h3>Pathfinding Algorithm</h3>
        <button
          className="visualizer-btn"
          onClick={() => this.visualizeDijkstra()}
        >
          Visualize {selectedAlgorithm}
        </button>
        <select
          className="btn"
          onChange={this.handleOnChangelAlgorithm}
          value={selectedAlgorithm}
        >
          {algorithmsList.map((item, index) => {
            return (
              <option key={index} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </select>
        <button className="btn" onClick={() => this.clearBoard()}>
          Clear Board
        </button>
        <button className="btn" onClick={() => this.spawnNewStartPath()}>
          Spawn New Start Path
        </button>
        <button className="btn" onClick={() => this.spawnNewFinishPath()}>
          Spawn New Finish Path
        </button>
        <button
          className="btn"
          onClick={() => this.createRecursiveDivisionMaze()}
        >
          Recursive Division Maze
        </button>
        <div className="grid">
          <span id="no-path">THE ALGORITHM DIDN'T FIND ANY PATH</span>
          {/* Mapping each Row */}
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx} className="row-grid">
                {/* Mappig each Node of the rows */}
                {row.map((node, nodeIdx) => {
                  const {
                    col,
                    row,
                    isStart,
                    isFinish,
                    isWall,
                    isVisited,
                    distance,
                  } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      row={row}
                      isStart={isStart}
                      isFinish={isFinish}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      isVisited={isVisited}
                      distance={distance}
                      onMouseDown={(e, row, col) =>
                        this.handleMouseDown(e, row, col)
                      }
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < GRID_ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < GRID_COLS; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    isWall: false,
    isVisited: false,
    distance: Infinity,
    previousNode: null,
  };
};

/**
 * Adding walls to grid
 */
const getNewGridWithWallToggled = (grid, row, col) => {
  /**
   * Returns a shallow copy of elements from the original array
   */
  const newGrid = grid.slice();
  /**
   * Get the node clicked
   */
  const node = newGrid[row][col];

  const newNode = {
    ...node,
    isWall: true,
  };

  newGrid[row][col] = newNode;

  return newGrid;
};

const getStartNode = (grid) => {
  for (const row of grid) {
    for (const node of row) {
      if (node.isStart) return node;
    }
  }
};

const getFinishNode = (grid) => {
  for (const row of grid) {
    for (const node of row) {
      if (node.isFinish) return node;
    }
  }
};
