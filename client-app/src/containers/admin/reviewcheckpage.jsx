import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

import api from '../../services/api';

const ReviewCheckPage = (props) => {

    const [reviews, setReviews] = useState({
        data: [],
        isFetching: true
    });

    useEffect(() => {
        api.bng_games_fetch({
            url: '/api/Review/Query?$filter=IsApproved eq false',
            method: 'GET'
        })
        .then(res => setReviews({
            data: res.data,
            isFetching: false
        }))
    }, []);

    const publishHandler = (review) => {
        api.bng_games_fetch({
            url: `/api/Review/${review.id}`,
            method: 'PUT',
            data: {
                id: review.id,
                text: review.text,
                userId: review.userId,
                gameId: review.gameId,
                date: review.date,
                isApproved: true
            }
        })
        .then(res => {
            if (res.status == 200) {
                setReviews({
                    data: reviews.data.filter(r => r !== review),
                    isFetching: false
                })
            }
        });
    }

    const deleteHandler = (review) => {
        api.bng_games_fetch({
            url: `/api/Review/${review.id}`,
            method: 'DELETE'
        })
        .then(res => {
            if (res.status == 200) {
                setReviews({
                    data: reviews.data.filter(r => r !== review),
                    isFetching: false
                })
            }
        });
    }

    if (reviews.isFetching)
        return <div>...Loading</div>;

    return(
        <>
            {reviews.data.map((value, index, array) => {
                return (
                    <div className="list-group-item" key={index}>
                        <p>
                            {value.text}
                        </p>
                        <Button variant='success' onClick={e => publishHandler(value)}>
                            Опубликовать
                        </Button>
                        <Button variant='warning' onClick={e => deleteHandler(value)}>
                            Удалить
                        </Button>
                    </div>
                );
            })}
        </>
    );
}

export default ReviewCheckPage;