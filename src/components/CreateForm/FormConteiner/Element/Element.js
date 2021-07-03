import { Component } from "react";

import styles from "./Element.module.scss";

export default class Element extends Component {
    render() {
        const { tag, id } = this.props;
        return (
            <div id={id} className={styles.element}>
                {tag}
                <button className={styles.modalBut} onClick={(e) => this.props.toggleModel(tag, id)}>
                    <i className="fas fa-lightbulb fa-1x"></i>
                </button>
            </div>
        );
    }
}
