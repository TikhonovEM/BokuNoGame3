import React from 'react';
import GlobalNews from './globalnews';
import LocalNews from './localnews';
import TopGames from './topgames';

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