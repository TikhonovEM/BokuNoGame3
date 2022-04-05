﻿import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import userinfoService from '../services/userinfo.service';
import './css/review.css';

const Game = (props) => {

    let [gameState, setGameState] = useState(
        {
            game: {},
            isFetching: true
        });
    let [reviewsState, setReviewsState] = useState(
        {
            reviews: {},
            isFetching: true
        });
    let [userInfoState, setUserInfoState] = useState(
        {
            data: {},
            isFetching: true
        });
    let [reviewText, setReviewText] = useState("");
    
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

        api.bng_games_fetch({
            url: `/api/Review/Query?$filter=gameid eq ${params.gameId} and isapproved eq true`,
            method: 'GET'
        })
        .then(res => setReviewsState({
            reviews: res.data,
            isFetching: false
        }));
    }, []);    

    useEffect(() => {
        if (Object.keys(reviewsState.reviews).length !== 0 && reviewsState.reviews.constructor !== Object) {   
            let userInfos = {};
            reviewsState.reviews.map(function (review, i, arr) {
                api.bng_accounts_fetch({
                    url: 'api/Profile/UserInfo/' + review.userId,
                    method: 'GET'
                })
                .then(res => {
                    userInfos[review.id] = res.data;
                    if (Object.keys(userInfos).length === reviewsState.reviews.length) {
                        setUserInfoState({
                            data: userInfos,
                            isFetching: false
                        });
                    }
                });
            })
        }
    }, [reviewsState]);

    const userInfo = userinfoService.getInfo();

    const submitHandler = (event) => {
        event.preventDefault();

        const opts = {
            url: "/api/Review",
            method: "POST",
            data: {
                text: reviewText,
                userId: userInfo.id,
                gameId: params.gameId,
                date: new Date().toJSON(),
                isApproved: false
            }
        }
        api.bng_games_fetch(opts)
        .then(res => {
            if (res.status == 200) {
                alert("Ваш отзыв отправлен! Он появится в списке, когда администраторы проверять его на запрещенную лексику.");
            }
        })

    };    

    if (gameState.isFetching || reviewsState.isFetching || userInfoState.isFetching)
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
                            </div>
                            <div className="col-md-8">
                                <h4 className="bg-secondary"><b>Описание:</b></h4>
                                <p dangerouslySetInnerHTML={{ __html: gameState.game.description }}></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div>
                    {(userInfo != null) &&                        
                        <form method="post">
                            <h4 className="bg-secondary"><b>Твой отзыв:</b></h4>
                            <div className="row">
                                <div className="col-sm-11" style={{paddingRight: '0px'}}>
                                    <textarea className="form-control" placeholder="Введите текст отзыва..." 
                                    name="text" rows={2} maxLength={1000} onInput={e => setReviewText(e.target.value)}></textarea>                            
                                </div>
                                <div className="col-sm-1" style={{paddingLeft: '0px'}}>
                                    <button className="btn btn-outline-success h-100 w-100" type="submit" onClick={e => submitHandler(e)}>
                                        <i className="fa fa-paper-plane" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    }

                    {reviewsState.reviews.map(function (value, index, array) {
                        const info = userInfoState.data[value.id];
                        return (
                            <div className="review" key={index}>
                                <img src={"data:image;base64," + info.photo} />
                                <span>{info.nickname ?? info.userName}</span>{new Date(value.date).toLocaleString()}
                                <p>
                                    {value.text}
                                </p>
                            </div>
                        );
                    })
                    }
                </div>
            </section>
        </div>
    );
}

export default Game;