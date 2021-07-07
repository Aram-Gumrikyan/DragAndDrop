import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";

import styles from "./ShowForm.module.scss";

const NOTCREATED = "notCreated";

export default class ShowForm extends Component {
    constructor(props) {
        super(props);
        this.tree = this.props.location.state?.tree || NOTCREATED;
        this.state = {
            form: [],
        };
    }

    componentDidMount() {
        const form = this.tree !== NOTCREATED && this.drow(this.tree);
        this.setState({ form });
    }

    elem(elem) {
        if (elem.tag === "button") {
            return React.createElement(elem.tag, { ...elem, key: "elem" + elem.id }, elem.context);
        }

        if (elem.tag === "select") {
            const values = elem.option.split(" ");

            return React.createElement(
                elem.tag,
                { ...elem, key: "elem" + elem.id },
                values.map((value, index) => {
                    return React.createElement("option", { value: value, key: index }, value);
                })
            );
        }

        if (elem.tag === "radio" || elem.tag === "checkbox") {
            elem.type = elem.tag;
            elem.tag = "input";

            return React.createElement(elem.tag, { ...elem, key: "elem" + elem.id }, null);
        }

        return React.createElement(elem.tag, { ...elem, key: "elem" + elem.id }, null);
    }

    drow(tree) {
        const form = tree.map((elem, index) => {
            if (Array.isArray(elem)) {
                return React.createElement("div", { key: index }, this.drow(elem));
            }

            return [
                React.createElement("label", { key: "label" + elem.id, htmlFor: elem.id }, elem.label),
                this.elem(elem),
            ];
        });

        return form;
    }

    render() {
        return this.tree === NOTCREATED ? (
            <Redirect to="/" />
        ) : (
            <form className={styles.showForm}>
                <Link to="/">
                    <button>Create</button>
                </Link>
                {this.state.form}
            </form>
        );
    }
}
