import React from 'react';
import { render } from 'react-dom';
import App from './containers/app.jsx';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom';

render(
    <Router>
        <App />
    </Router>,
    document.getElementById('content')
)