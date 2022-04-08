import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import userinfoService from '../../services/userinfo.service';
import '../css/review.css';

const Reviews = (props) => {
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
    
    useEffect(() => {
            console.log("started");
            api.bng_games_fetch({
                url: `/api/Review/Query?$filter=gameid eq ${props.gameId} and isapproved eq true`,
                method: 'GET'
            })
            .then(res => setReviewsState({
                reviews: res.data,
                isFetching: false
            }));
            console.log("finished");
        }, []);

    useEffect(() => {
        if (Object.keys(reviewsState.reviews).length !== 0 && reviewsState.reviews.constructor !== Object) {   
            let userInfos = {};
            reviewsState.reviews.map(function (review, i, arr) {
                console.log("userinfo started");
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
                console.log("userinfo finished");
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
                gameId: props.gameId,
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

    if (reviewsState.isFetching || userInfoState.isFetching)
        return <div>...Loading</div>;
    return (
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
    );
}

export default Reviews;