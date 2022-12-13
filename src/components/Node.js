import { faInfinity } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Component } from "react";
import "./Node.css";

export default class Node extends Component {
  render() {
    const {
      col,
      row,
      isStart,
      isFinish,
      isWall,
      onMouseDown,
      onMouseUp,
      onMouseEnter,
      distance,
    } = this.props;

    const extraClassName = isFinish
      ? "node-finish"
      : isStart
      ? "node-start"
      : isWall
      ? "node-wall"
      : "";

    // const [distance, setDistance] = useState(this.props.distance);

    return (
      <div
        id={`node-${row}-${col}`}
        className={`node ${extraClassName}`}
        /**
         * Passing Synthetic Base Event
         */
        onMouseDown={(e) => onMouseDown(e, row, col)}
        onMouseEnter={() => onMouseEnter(row, col)}
        onMouseUp={() => onMouseUp()}
      >
        <span className="distance">
          {Infinity ? <FontAwesomeIcon icon={faInfinity} /> : distance}
        </span>
      </div>
    );
  }
}
