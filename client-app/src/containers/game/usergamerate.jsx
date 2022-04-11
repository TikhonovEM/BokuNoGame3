import React, { useState, useEffect } from 'react';
import { Rating } from 'react-simple-star-rating';
import api from '../../services/api';
import userinfoService from '../../services/userinfo.service';

const UserGameRate = (props) => {
    const [rating, setRating] = useState(0);

    const [gameRate, setGameRate] = useState({
        data: [],
        isFetching: true
    });

    const userInfo = userinfoService.getInfo();

    useEffect(() => {
        if (userInfo) {
            api.bng_games_fetch({
                url: `/api/GameRate/Query?$filter=gameId eq ${props.gameId} and AuthorId eq '${userInfo.id}'`,
                method: 'GET'
            })
            .then(res => setGameRate({
                data: res.data,
                isFetching: false
            }))
        }
    }, []);

    useEffect(() => {
        if (gameRate.data.length > 0) {
            setRating(gameRate.data[0].rate * 10);
        }
    }, [gameRate])

    const handleRating = (rate) => {
        if (userInfo) {
            const gameRateExists = gameRate.data.length > 0;
            const url = gameRateExists ? `/api/GameRate/${gameRate.data[0].id}` : "/api/GameRate";
            const method = gameRateExists ? 'PUT' : 'POST';
            api.bng_games_fetch({
                url,
                method,
                data : {
                    gameId: props.gameId,
                    rate: rate / 10,
                    authorId: userInfo.id
                }
            })
            .then(res => {
                if (res.status == 200) {
                    alert("Спасибо за оценку!");
                    setRating(rate);
                }
            })
        }
    }

    if (gameRate.isFetching)
        return <div>...Loading</div>;
        
    return (
        <>
            <Rating onClick={handleRating} 
            ratingValue={rating} 
            allowHalfIcon={true} 
            showTooltip={true} 
            tooltipArray={[...Array(10).keys()].map(i => i + 1)} 
            tooltipDefaultText='' 
            />
        </>
    );
}

export default UserGameRate;