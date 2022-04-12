import React, { useState, useEffect } from 'react';
import { Rating } from 'react-simple-star-rating';
import api from '../../services/api';

const AverageGameRate = (props) => {

    const [gameRate, setGameRate] = useState({
        rate: 0,
        isFetching: true
    });

    useEffect(() => {
        api.bng_games_fetch({
            url: `/api/GameRate/Average/${props.gameId}`,
            method: 'GET'
        })
        .then(res => setGameRate({
            rate: res.data,
            isFetching: false
        }))
    }, []);

    if (gameRate.isFetching)
        return <div>...Loading</div>;

    return (
        <>
            <div className='col-md-6'>
                <Rating ratingValue={gameRate.rate * 10} allowHalfIcon={true} readonly={true} />
            </div>
            <div className='col-md-6' style={{fontSize: '35px', position: 'relative', top: '-6px'}}>{gameRate.rate}</div>
        </>
    );

};

export default AverageGameRate;