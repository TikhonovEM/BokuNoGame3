import React from 'react';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import Header from './header.jsx';
import GameList from './gamelist.jsx';
import MainPage from './main/main.jsx';
import Game from './game/game.jsx';
import Login from './login.jsx';
import Register from './register.jsx';
import Profile from './profile/profile.jsx';
import AdminMainPage from './admin/adminmainpage.jsx';
import ReviewCheckPage from './admin/reviewcheckpage.jsx';
import 'bootstrap-dark-5/dist/css/bootstrap-dark.min.css';

const App = (props) => {
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
                        <Route path='/Profile/:username' element={<Profile />} ></Route>
                        <Route path='/Admin' element={<AdminMainPage />} ></Route>
                        <Route path='/Admin/Reviews' element={<ReviewCheckPage />} ></Route>
                    </Routes>
                </main>                   
            </div>
        </div>
    );
};

export default App;