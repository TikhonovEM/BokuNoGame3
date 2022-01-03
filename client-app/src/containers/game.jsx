import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, useParams } from 'react-router-dom';
import { bng_games_fetch } from '../js/site'

const Game = (props) => {

    let [pageState, setPageState] = useState(
        {
            game: {},
            isFetching: true
        });
    let params = useParams();

    useEffect(() => {
        const opts = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip;q=1.0, compress;q=0.5'
            }
        };
        bng_games_fetch("/api/Game/" + params.gameId, opts)
            .then(res => res.json())
            .then((result) => setPageState(
                {
                    game: result,
                    isFetching: false
                }));
    }, []);

    if (pageState.isFetching)
        return <div>...Loading</div>;
    return (
        <div className="container">
            <section>
                <div>
                    <header className="text-center mb-5">
                        <h1>{pageState.game.name}</h1>
                    </header>
                    <div className="main-page row">
                        <div className="image img-fluid col-md-4 mx-auto text-center">
                            <img src={"data:image;base64," + pageState.game.logo} style={{ maxHeight: "500px", maxWidth: "400px" }} />
                        </div>
                        <div className="info col-md-4">
                            <h4 className="bg-secondary"><b>Информация:</b></h4>
                            <div>
                                <b>Жанр: </b><span>{pageState.game.genre}</span>
                            </div>
                            <div>
                                <b>Разработчик: </b><span>{pageState.game.developer}</span>
                            </div>
                            <div>
                                <b>Издатель: </b><span>{pageState.game.publisher}</span>
                            </div>
                            <div>
                                <b>Возрастной рейтинг: </b><span>{pageState.game.ageRating}</span>
                            </div>
                            <div>
                                <b>Дата выхода: </b><span>{pageState.game.releaseDate}</span>
                            </div>
                        </div>
                        <div className="rating col-md-4">
                            <h4 className="bg-secondary"><b>Рейтинг:</b></h4>
                            <div className="row">
                                <div className="col-md-5">
                                    <div className="rateit ml-3 mt-1"
                                        data-rateit-value="5"//TODO FIX STUB {pageState.data.rate.currentRateStr}
                                        data-rateit-step="0.01"
                                        data-rateit-readonly="true"
                                        data-rateit-mode="font" style={{ fontSize: "40px" }}></div>
                                </div>
                                <div className="col-md-7" style={{ fontSize: "35px" }}>10</div>
                            </div>
                        </div>
                        <div className="description row">
                            <div className="col-md-4">
                            </div>
                            <div className="col-md-8">
                                <h4 className="bg-secondary"><b>Описание:</b></h4>
                                <p dangerouslySetInnerHTML={{ __html: pageState.game.description }}></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Game;