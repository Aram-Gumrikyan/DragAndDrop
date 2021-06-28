import { Component } from "react";

import Sidebar from "./components/Sidebar";
import FormContainer from "./components/FormConteiner";
import "./App.scss";

export default class App extends Component {
    render() {
        return (
            <div className="App">
                <Sidebar />
                <FormContainer />
            </div>
        );
    }
}
