import React, { Component } from "react";
import Radium from "radium";
import { observer } from 'mobx-react'
// Only old-style imports for react-icons seem to work with gulp
const FaExpand = require("react-icons/lib/fa/expand");
const FaInfoCircle = require("react-icons/lib/fa/info-circle");
const SaveBtn = require("react-icons/lib/fa/floppy-o");

const steps = 100; // Slider steps

function makeStyles(primary) {
  return {
    controls: {
      position: "absolute",
      bottom: "30px",
      left: "15px",
      zIndex: 100
    },
    sliderWrapper: {
      backgroundColor: "white",
      color: primary,
      border: "solid 1px lightgray",
      padding: "6.5px",
      marginRight: "15px"
    },
    slider: {
      position: "relative",
      top: 3,
      marginLeft: 5,
      marginRight: 5
    },
    button: {
      backgroundColor: "white",
      color: primary,
      border: "solid 1px lightgray",
      outline: "none",
      position: "absolute",
      width: 31,
      height: 31,
      top: -3
    },
    saveButton: {
      color: primary,
      border: "solid 1px lightgray",
      outline: "none",
      position: "absolute",
      right: -10,
      width: 31,
      height: 31,
      top: -3
    }
  };
}



class GraphControls extends Component {

  constructor(props) {
    super(props);
    this.state = {
      styles: makeStyles(props.primary)
    };
  }

  // Convert slider val (0-steps) to original zoom value range
  sliderToZoom(val) {
    return ((val) * (this.props.maxZoom - this.props.minZoom) / steps) + this.props.minZoom;
  }

  // Convert zoom val (minZoom-maxZoom) to slider range
  zoomToSlider(val) {
    return (val - this.props.minZoom) * steps / (this.props.maxZoom - this.props.minZoom);
  }

  // Center graph-view on contents of svg > view
  zoomToFit() {
    this.props.zoomToFit();
  }

  // Modify current zoom of graph-view
  zoom(e) {
    let sliderVal = e.target.value;
    let zoomLevelNext = this.sliderToZoom(sliderVal);
    let delta = zoomLevelNext - this.props.zoomLevel;

    if (zoomLevelNext <= this.props.maxZoom && zoomLevelNext >= this.props.minZoom) {
      this.props.modifyZoom(delta);
    }
  }

  render() {
    const styles = this.state.styles;

    return (
      <div style={styles.controls} id="GraphControls">
        <span style={styles.sliderWrapper}>
          -
          <input
            id="typeinp"
            type="range"
            style={styles.slider}
            min={this.zoomToSlider(this.props.minZoom)}
            max={this.zoomToSlider(this.props.maxZoom)}
            value={this.zoomToSlider(this.props.zoomLevel)}
            onChange={this.zoom.bind(this)}
            step="1" />
          +
        </span>
        <button style={styles.button} onMouseDown={this.props.zoomToFit}>
          <SaveBtn />
        </button>
      </div>
    );
  }
}

GraphControls.propTypes = {
  primary: React.PropTypes.string,
  minZoom: React.PropTypes.number,
  maxZoom: React.PropTypes.number,
  zoomLevel: React.PropTypes.number.isRequired,
  zoomToFit: React.PropTypes.func.isRequired,
  modifyZoom: React.PropTypes.func.isRequired
};

GraphControls.defaultProps = {
  primary: "dodgerblue",
  minZoom: 0.15,
  maxZoom: 1.5
};

export default observer(Radium(GraphControls));
