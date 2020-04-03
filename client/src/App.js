import React from 'react';
import { BrowserRouter as Router, Switch, Link, Route } from 'react-router-dom';
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/" component={LandingPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
            </Switch>
        </Router>
    );
}

export default App;
