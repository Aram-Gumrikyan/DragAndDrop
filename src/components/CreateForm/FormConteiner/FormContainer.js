import React, { Component } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";

import Box from "./Box";
import Modal from "./Modal";
import Element from "./Element";
import styles from "./FormContainer.module.scss";

export default class FormComponent extends Component {
    constructor(props) {
        super(props);

        this.dropArea = (position, id, style = {}) => {
            return (
                <Box
                    addFormElem={(elem, position, id) => this.addFormElem(elem, position, id)}
                    position={position}
                    id={id}
                    drop={(e) => this.drop(e)}
                    style={style}
                    key={"box" + id + position}
                />
            );
        };

        this.state = {
            modal: {},
            modalOpened: false,
            dragOver: false,
            form: [this.dropArea("top", null, { width: "100%", height: "100%", display: "block" })],
        };
    }

    addDropAreasRightOrLeft(element, position) {
        const id = element.props.id;

        switch (position) {
            case "left": {
                return [this.dropArea("left", id), element];
            }
            case "right": {
                return [element, this.dropArea("right", id)];
            }
            default: {
                return [this.dropArea("left", id), element, this.dropArea("right", id)];
            }
        }
    }

    addDropAreasTopAndBottom(element, position) {
        const id = element.props.id;
        const data = [
            <div className={styles.row} name="row" key={"row" + id}>
                {this.addDropAreasRightOrLeft(element)}
            </div>,
        ];

        switch (position) {
            case "top": {
                data.unshift(this.dropArea("top", id));
                break;
            }
            case "bottom": {
                data.push(this.dropArea("bottom", id));
                break;
            }
            default: {
                data.unshift(this.dropArea("top", id));
                data.push(this.dropArea("bottom", id));
            }
        }

        return data;
    }

    searchById(form, id) {
        const elIndex = {};

        const find = form.some((item, index) => {
            if (item.type === "div") {
                const { inDiv, find } = this.searchById(item.props.children, id);

                if (find) {
                    elIndex.inDiv = inDiv;
                    elIndex.inForm = index;

                    return true;
                }
            } else if (item.props.role === "element" && item.props.id === id) {
                elIndex.inDiv = index;
                return true;
            }

            return false;
        });

        elIndex.find = find;

        return elIndex;
    }

    addFormElem(elem, position, id) {
        const element = (
            <Element
                id={Date.now()}
                key={Date.now()}
                tag={elem}
                role="element"
                toggleModel={(tag, id) => this.toggleModel(tag, id)}
            />
        );

        const form = [...this.state.form];

        if (this.state.form.length === 1) {
            form.splice(0, 1, ...this.addDropAreasTopAndBottom(element));
            this.setState({ form: form });
            return;
        }

        const index = this.searchById(this.state.form, id);

        if (position === "top" || position === "bottom") {
            const positions = [null, null, "bottom"];
            const amount = positions.indexOf(position);

            form.splice(index.inForm + amount, 0, ...this.addDropAreasTopAndBottom(element, position));
        } else {
            const positions = [null, null, "right"];
            const amount = positions.indexOf(position);
            const oldDiv = form[index.inForm];
            const childs = [...oldDiv.props.children];

            const startDivs = childs.slice(0, index.inDiv + amount);
            const endDivs = childs.slice(index.inDiv + amount);

            const newDiv = (
                <div className={styles.row} name="row" key={"row" + id}>
                    {[...startDivs, ...this.addDropAreasRightOrLeft(element, position), ...endDivs]}
                </div>
            );

            form[index.inForm] = newDiv;
        }

        this.setState({ form: form });
    }

    toggleModel(tag, id) {
        const index = this.searchById(this.state.form, id);
        const attributes = { ...this.state.form[index.inForm].props.children[index.inDiv].props };

        this.setState({ modalOpened: !this.state.modalOpened, modal: { tag, id, attributes } });
    }

    setAttributes(id, attributes) {
        const element = <Element {...attributes} />;

        const index = this.searchById(this.state.form, id);
        const form = [...this.state.form];
        const oldDiv = form[index.inForm];
        const childrens = [...oldDiv.props.children];
        childrens[index.inDiv] = element;

        const div = (
            <div className={styles.row} name="row" key={"row" + id}>
                {[...childrens]}
            </div>
        );
        form[index.inForm] = div;

        this.setState({ form });
    }

    drop(e) {
        this.setState({ dragOver: false });
    }

    dragEnter(e) {
        e.preventDefault();
        this.setState({ dragOver: true });
    }

    dragLeave(e) {
        const x = e.clientX;
        const y = e.clientY;
        const elem = document.elementFromPoint(x, y);

        if (!elem) {
            return;
        }

        const permissibleClasses = ["top", "bottom", "left", "right", "false", "dragOver"];
        const name = elem.getAttribute("name");
        const id = elem.getAttribute("id");
        if (permissibleClasses.includes(elem?.classList[1]) === false && name !== "row" && !id) {
            this.setState({ dragOver: false });
        }
    }

    generateTree() {
        const tree = [];

        this.state.form.forEach((row) => {
            if (row.type === "div") {
                const treeLength = tree.length;
                tree[treeLength] = [];

                row.props.children.forEach((children) => {
                    if (children.props.role === "element") {
                        const props = { ...children.props };
                        delete props.toggleModel;
                        tree[treeLength].push(props);
                    }
                });
            }
        });

        return tree;
    }

    render() {
        const className = classNames(styles.formComponent, { dragOver: this.state.dragOver });

        return (
            <div
                className={className}
                onDragOver={(e) => e.preventDefault(e)}
                onDragEnter={(e) => this.dragEnter(e)}
                onDragLeave={(e) => this.dragLeave(e)}
                onDrop={(e) => this.drop(e)}
            >
                {this.state.form}
                {this.state.modalOpened ? (
                    <Modal
                        tag={this.state.modal.tag}
                        id={this.state.modal.id}
                        attributes={this.state.modal.attributes}
                        setAttributes={(id, attributes) => this.setAttributes(id, attributes)}
                    />
                ) : (
                    <Link to={{ pathname: "/watch", state: { tree: this.generateTree() } }}>
                        <button>generate</button>
                    </Link>
                )}
            </div>
        );
    }
}
