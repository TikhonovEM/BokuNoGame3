import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import userinfoService from '../../services/userinfo.service';
import UserGameRate from './usergamerate';
import Reviews from './reviews';
import UserLibraryInfo from './userlibraryinfo';

const Game = (props) => {

    let [gameState, setGameState] = useState(
        {
            game: {},
            isFetching: true
        });
    
    let params = useParams();

    useEffect(() => {
        api.bng_games_fetch({
            url: "/api/Game/" + params.gameId,
            method: 'GET'
        })
        .then(res => setGameState({
            game: res.data,
            isFetching: false
        }));
    }, []);

    const userInfo = userinfoService.getInfo();

    if (gameState.isFetching)
        return <div>...Loading</div>;
    return (
        <div className="container">
            <section>
                <div>
                    <header className="text-center mb-5">
                        <h1>{gameState.game.name}</h1>
                    </header>
                    <div className="main-page row">
                        <div className="image img-fluid col-md-4 mx-auto text-center">
                            <img src={"data:image;base64," + gameState.game.logo} style={{ maxHeight: "500px", maxWidth: "400px" }} />
                        </div>
                        <div className="info col-md-4">
                            <h4 className="bg-secondary"><b>Информация:</b></h4>
                            <div>
                                <b>Жанр: </b><span>{gameState.game.genre}</span>
                            </div>
                            <div>
                                <b>Разработчик: </b><span>{gameState.game.developer}</span>
                            </div>
                            <div>
                                <b>Издатель: </b><span>{gameState.game.publisher}</span>
                            </div>
                            <div>
                                <b>Возрастной рейтинг: </b><span>{gameState.game.ageRating}</span>
                            </div>
                            <div>
                                <b>Дата выхода: </b><span>{gameState.game.releaseDate}</span>
                            </div>
                        </div>
                        <div className="rating col-md-4">
                            <h4 className="bg-secondary"><b>Рейтинг:</b></h4>
                            <div className="row">
                                <div className="col-md-5">
                                    <div className="rateit ml-3 mt-1"
                                        data-rateit-value="5"//TODO FIX STUB {gameState.data.rate.currentRateStr}
                                        data-rateit-step="0.01"
                                        data-rateit-readonly="true"
                                        data-rateit-mode="font" style={{ fontSize: "40px" }}></div>
                                </div>
                                <div className="col-md-7" style={{ fontSize: "35px" }}>10</div>
                            </div>
                        </div>
                        <div className="description row">
                            <div className="col-md-4">                                
                                {userInfo &&
                                    <section>
                                        <UserLibraryInfo game={gameState.game}/>
                                        <UserGameRate gameId={params.gameId}/>
                                    </section>
                                }                                
                            </div>
                            <div className="col-md-8">
                                <h4 className="bg-secondary"><b>Описание:</b></h4>
                                <p dangerouslySetInnerHTML={{ __html: gameState.game.description }}></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Reviews gameId={params.gameId}/>
        </div>
    );
}

export default Game;