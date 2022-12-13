import React, { Component } from "react";
import "./Header.css";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const algorithms = [
  "Dijkstra's Algorithm",
  "A* Search",
  "Swarm Algorithm",
  "Greedy Best-first Search",
];

export default class Header extends Component {
  render() {
    return (
      <nav className="navbar">
        <div className="container">
          <div className="navbar-header">
            <h4>Pathfinding Algorithm</h4>
          </div>
          <div className="navbar-menu">
            <ul className="navbar-nav">
              <li className="navbar-dropdown">
                <a href="#" class="dropdown-toggler" data-dropdown="algorithms">
                  Algorithms <FontAwesomeIcon icon={faSortDown} />
                </a>
                <ul className="dropdown" id="algorithms">
                  {algorithms.map((alg, algIdx) => {
                    return (
                      <li key={algIdx}>
                        <a href="#">{alg}</a>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li>
                <a href="#" className="visualizer-btn">
                  Visualize {this.props.selectedAlgorithm}
                </a>
              </li>
              <li>
                <a href="#">Add Bomb</a>
              </li>
              <li>
                <a href="#">Clear Board</a>
              </li>
              <li>
                <a href="#">Clear Walls</a>
              </li>
              <li>
                <a href="#">Clear Path</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
