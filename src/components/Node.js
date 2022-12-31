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
      f_cost,
      g_cost,
      h_cost,
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
        {/* <span className="distance">
          {Infinity ? <FontAwesomeIcon icon={faInfinity} /> : distance}
        </span> */}
        {/* <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            fontSize: "0.85rem",
          }}
        >
          <span>F = {f_cost}</span>
          <span>G = {g_cost}</span>
          <span>H = {h_cost}</span>
          <span>
            {col},{row}
          </span>
        </div> */}
      </div>
    );
  }
}
