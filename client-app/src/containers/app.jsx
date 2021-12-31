import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import Header from './header.jsx';
import GameList from './gamelist.jsx';
import MainPage from './main.jsx';
import Game from './game.jsx';
import Login from './login.jsx'
import Register from './register.jsx'
import Profile from './profile.jsx'

export default class App extends React.Component {
    render() {
        return (
            <div>
                <Header />
                <div className="container-fluid">                   
                    <main role="main" className="pb-3">
                        <Routes>
                            <Route path='/' exact element={<MainPage />} ></Route>
                            <Route path='/Account/Register' element={<Register />} ></Route>
                            <Route path='/Account/Login' element={<Login />} ></Route>
                            <Route path='/GameList' element={<GameList />} ></Route>
                            <Route path='/Game/:gameId' element={<Game />} ></Route>
                            <Route path='/Account/Profile/:userName?' element={<Profile />} ></Route>
                        </Routes>
                    </main>                   
                </div>
            </div>
        );
    }
};