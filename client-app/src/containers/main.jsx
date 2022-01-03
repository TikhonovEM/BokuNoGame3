import React from 'react';
import ReactDOM from 'react-dom';
import { NavLink } from 'react-router-dom';
import { bng_games_fetch } from '../js/site';
import GlobalNews from './globalnews';
import LocalNews from './localnews';
import TopGames from './topgames';
import 'bootstrap-dark-5/dist/css/bootstrap-dark.min.css'

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="text-center">
                    <h1 className="display-4">Добро пожаловать в NGNL</h1>
                </div>
                <TopGames />
                <div className="row">
                    <div className="col-md-9 order-md-1" style={{ padding: "0px" }}>
                        <GlobalNews />
                    </div>
                    <div className="col-md-3 order-md-2">
                        <LocalNews />
                    </div>
                </div>
            </div>
        );
    }
}