import React, { Component } from "react";

import styles from "./Modal.module.scss";

const attributes = {
    button: [
        { name: "formAction", values: "text" },
        { name: "disabled", values: ["", "disabled"] },
        { name: "formEncType", values: ["", "application/x-www-form-urlencoded", "multipart/form-data", "text/plain"] },
        { name: "formMethod", values: ["", "get", "post"] },
        { name: "formNoValidate", values: ["", "formNoValidate"] },
        { name: "formTarget", values: ["", "_blank", "_self", "_parent", "_top"] },
        { name: "type", values: ["", "button", "reset", "submit"] },
        { name: "context", values: "text" },
        { name: "name", values: "text" },
    ],
    input: [
        {
            name: "type",
            values: [
                "button",
                "checkbox",
                "color",
                "date",
                "datetime-local",
                "email",
                "file",
                "hidden",
                "image",
                "month",
                "number",
                "password",
                "radio",
                "range",
                "reset",
                "search",
                "submit",
                "tel",
                "text",
                "time",
                "url",
                "week",
            ],
        },
        {
            name: "autoComplete",
            values: ["", "on", "off"],
        },
        { name: "max", values: "number" },
        { name: "maxLength", values: "number" },
        { name: "min", values: "number" },
        { name: "minLength", values: "number" },
        { name: "placeholder", values: "text" },
        { name: "readOnly", values: ["", "readonly"] },
        { name: "required", values: ["", "required"] },
        { name: "name", values: "text" },
        { name: "label", values: "text" },
    ],
    textarea: [
        { name: "rows", values: "number" },
        { name: "cols", values: "number" },
        { name: "maxLength", values: "number" },
        { name: "placeholder", values: "text" },
        { name: "readOnly", values: ["", "readonly"] },
        { name: "required", values: ["", "required"] },
        { name: "name", values: "text" },
        { name: "label", values: "text" },
    ],
    select: [
        {
            name: "multiple",
            values: ["", "multiple"],
        },
        { name: "required", values: ["", "required"] },
        { name: "option", values: "text" },
        { name: "name", values: "text" },
        { name: "label", values: "text" },
    ],
    radio: [
        { name: "readOnly", values: ["", "readonly"] },
        { name: "required", values: ["", "required"] },
        { name: "value", values: "text" },
        { name: "name", values: "text" },
        { name: "label", values: "text" },
    ],
    checkbox: [
        { name: "readOnly", values: ["", "readonly"] },
        { name: "required", values: ["", "required"] },
        { name: "value", values: "text" },
        { name: "name", values: "text" },
        { name: "label", values: "text" },
    ],
};

export default class Modal extends Component {
    constructor(props) {
        super(props);
        this.attributes = { ...this.props.attributes };
    }

    setAttribute(e) {
        const { name, value } = e.target;
        this.attributes[name] = value;
    }

    sendAttributes(e) {
        e?.preventDefault();
        this.props.setAttributes(this.props.id, this.attributes);
    }

    componentWillUnmount() {
        this.sendAttributes();
    }

    render() {
        const { tag } = this.props;
        return (
            <div className={styles.modal}>
                <form onSubmit={(e) => this.sendAttributes(e)}>
                    {attributes[tag].map((attribute, index) => {
                        const { name, values } = attribute;

                        return (
                            <React.Fragment key={index}>
                                <label htmlFor={name}>{name}</label>
                                {values === "text" || values === "number" ? (
                                    <input
                                        type={values}
                                        name={name}
                                        id={name}
                                        onChange={(e) => this.setAttribute(e)}
                                        defaultValue={this.attributes[name]}
                                    ></input>
                                ) : (
                                    <select
                                        name={name}
                                        id={name}
                                        onChange={(e) => this.setAttribute(e)}
                                        defaultValue={this.attributes[name]}
                                    >
                                        {values.map((value, index) => {
                                            return (
                                                <option key={index} value={value}>
                                                    {value}
                                                </option>
                                            );
                                        })}
                                    </select>
                                )}
                            </React.Fragment>
                        );
                    })}
                    <button type="submit">Save</button>
                </form>
            </div>
        );
    }
}
