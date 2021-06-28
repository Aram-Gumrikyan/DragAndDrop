import { Component } from "react";

import styles from "./Box.module.scss";

export default class Box extends Component {
    drop(e) {
        e.preventDefault();
        const tegName = e.dataTransfer.getData("text/plain");

        this.props.addFormElem(tegName, this.props.position, this.props.id);
        this.dropOrDragEnds(e);
        this.props.drop(e);
    }

    dragEnter(e) {
        e.preventDefault();
        e.target.style.backgroundColor = "#76FCDE";
        e.target.style.border = "4px dotted #76FCDE";
    }

    dropOrDragEnds(e) {
        e.preventDefault();
        e.target.style.backgroundColor = "transparent";
        e.target.style.border = "4px dotted black";
    }

    render() {
        return (
            <div
                className={`${styles.box} ${this.props.position}`}
                style={this.props.style}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => {
                    this.dragEnter(e);
                }}
                onDragLeave={(e) => {
                    this.dropOrDragEnds(e);
                }}
                onDrop={(e) => this.drop(e)}
            ></div>
        );
    }
}
