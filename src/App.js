import { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import CreateForm from "./components/CreateForm";
import ShowForm from "./components/ShowForm";
import "./App.scss";

export default class App extends Component {
    render() {
        return (
            <div className="App">
                <Router>
                    <Switch>
                        <Route path="/" exact component={CreateForm} />
                        <Route path="/watch" component={ShowForm} />
                        <Route exact path="/*">
                            <Redirect to="/" />
                        </Route>
                    </Switch>
                </Router>
            </div>
        );
    }
}
