import { Component } from "react";
import classNames from "classnames";

import styles from "./Box.module.scss";

export default class Box extends Component {
    drop(e) {
        e.preventDefault();
        const elements = ["button", "input", "textarea", "select", "radio", "checkbox"];
        const tegName = e.dataTransfer.getData("text/plain");

        ~elements.indexOf(tegName) && this.props.addFormElem(tegName, this.props.position, this.props.id);

        this.leaveOrDrop(e);
        this.props.drop(e);
    }

    dragEnter(e) {
        e.preventDefault();
        e.target.classList.add(styles.dragEnter);
    }

    leaveOrDrop(e) {
        e.preventDefault();
        e.target.classList.remove(styles.dragEnter);
    }

    render() {
        const divClass = classNames(styles.box, this.props.position);

        return (
            <div
                className={divClass}
                style={this.props.style}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => {
                    this.dragEnter(e);
                }}
                onDragLeave={(e) => {
                    this.leaveOrDrop(e);
                }}
                onDrop={(e) => this.drop(e)}
            ></div>
        );
    }
}
