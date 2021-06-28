import { Component } from "react";

import styles from "./Sidebar.module.scss";

export default class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.elements = ["button", "input", "textarea", "select", "radio", "checkbox"];
    }

    dragStart(e, data) {
        e.dataTransfer.setData("text/plain", data);
    }

    render() {
        return (
            <div className={styles.sidebar}>
                {this.elements.map((element, index) => (
                    <div key={index} draggable onDragStart={(e) => this.dragStart(e, element)}>
                        {element}
                    </div>
                ))}
            </div>
        );
    }
}
