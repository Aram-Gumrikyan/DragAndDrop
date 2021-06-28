import React, { Component } from "react";

import Box from "./Box";
import Modal from "./Modal";
import styles from "./FormContainer.module.scss";

export default class FormComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: {
                opened: false,
            },
            dragOver: false,
            form: [
                <Box
                    key={1}
                    style={{ width: "100%", height: "100%", display: "block" }}
                    addFormElem={(elem, position, id) => this.addFormElem(elem, position, id)}
                    drop={(e) => this.drop(e)}
                    position="top"
                />,
            ],
        };
    }

    addElemTopOrBottom(element) {
        return [
            <Box
                addFormElem={(elem, position, id) => this.addFormElem(elem, position, id)}
                position="top"
                id={element.props.id}
                drop={(e) => this.drop(e)}
            />,
            <div name="row">{this.addElemLeftOrRigth(element)}</div>,
            <Box
                addFormElem={(elem, position, id) => this.addFormElem(elem, position, id)}
                position="bottom"
                id={element.props.id}
                drop={(e) => this.drop(e)}
            />,
        ];
    }

    addElemLeftOrRigth(element) {
        return [
            <Box
                addFormElem={(elem, position, id) => this.addFormElem(elem, position, id)}
                position="left"
                id={element.props.id}
                drop={(e) => this.drop(e)}
            />,
            element,
            // hear will added Modal button
            <Box
                addFormElem={(elem, position, id) => this.addFormElem(elem, position, id)}
                position="right"
                id={element.props.id}
                drop={(e) => this.drop(e)}
            />,
        ];
    }

    searchById(form, id) {
        let elIndex = {};
        let find = false;
        console.log(id);
        form.forEach((item, index) => {
            if (item.type === "div") {
                const { recIndex, recFind } = this.searchById(item.props.children, id);
                if (recFind) {
                    find = recFind;
                    elIndex = { ...recIndex, inForm: index };
                }
            } else if (typeof item.type === "string" && item.props.id === id) {
                elIndex.inDiv = index;
                find = true;
            }
        });
        return { recIndex: elIndex, recFind: find };
    }

    addFormElem(elem, position, id) {
        const element =
            elem === "checkbox" || elem === "radio"
                ? React.createElement("input", { type: elem, id: Date.now() }, null)
                : React.createElement(elem, { id: Date.now() }, null);

        const form = [...this.state.form];

        if (this.state.form.length === 1) {
            form.splice(0, 1, ...this.addElemTopOrBottom(element));

            this.setState({ form: form });
            return;
        }

        const { recIndex } = this.searchById(this.state.form, id);
        const index = recIndex;
        switch (position) {
            case "top": {
                form.splice(index.inForm - 1, 0, ...this.addElemTopOrBottom(element));
                break;
            }
            case "bottom": {
                form.splice(index.inForm + 2, 0, ...this.addElemTopOrBottom(element));
                break;
            }
            case "left": {
                const oldDiv = form[index.inForm];
                const childs = [...oldDiv.props.children];
                const startDivs = childs.slice(0, index.inDiv - 1);
                const endDivs = childs.slice(index.inDiv - 1);
                const newDiv = <div name="row">{[...startDivs, ...this.addElemLeftOrRigth(element), ...endDivs]}</div>;
                form[index.inForm] = newDiv;
                break;
            }
            case "right": {
                const oldDiv = form[index.inForm];
                const childs = [...oldDiv.props.children];
                const startDivs = childs.slice(0, index.inDiv + 2);
                const endDivs = childs.slice(index.inDiv + 2);
                const newDiv = <div name="row">{[...startDivs, ...this.addElemLeftOrRigth(element), ...endDivs]}</div>;
                form[index.inForm] = newDiv;
                break;
            }
            default:
        }

        this.setState({ form: form });
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
        const positions = ["top", "bottom", "left", "right", "false", "dragOver"];

        const name = elem.getAttribute("name");
        const id = elem.getAttribute("id");
        if (positions.includes(elem?.classList[1]) === false && name !== "row" && !id) {
            this.setState({ dragOver: false });
        }
    }

    render() {
        return (
            <>
                <div
                    className={`${styles.formComponent} ${this.state.dragOver && "dragOver"}`}
                    onDragOver={(e) => e.preventDefault(e)}
                    onDragEnter={(e) => this.dragEnter(e)}
                    onDragLeave={(e) => this.dragLeave(e)}
                    onDrop={(e) => this.drop(e)}
                >
                    {this.state.form}
                    {this.state.modal.opened && <Modal />}
                </div>
            </>
        );
    }
}
