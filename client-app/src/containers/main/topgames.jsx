import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { NavLink } from 'react-router-dom';

const TopGames = (props) => {
    const [games, setGames] = useState(
        {
            data: {},
            isFetching: true
        });

    useEffect(() => {
        api.bng_games_fetch({
            url: "/api/Game/MostPopular?top=8",
            method: "GET"
        })
        .then(res => setGames({
                data: res.data,
                isFetching: false
        }));
    }, []);

    if (games.isFetching)
        return <div>...Loading</div>;
    return (
        <div>
            <h3 className="bg-secondary text-left">Популярно среди пользователей сайта:</h3>
            <ul className="list-inline text-center">
                {games.data.map(function (value, index, array) {
                    return (
                        <li className="d-inline-block" style={{ width: "11%" }} key={index}>
                            <NavLink to={"/Game/" + value.id} className="social-icon">
                                <div>
                                    <img src={"data:image;base64," + value.logo} style={{ width: "9rem", height: "12em" }} />
                                </div>
                                <span className="d-inline-block text-truncate" style={{ maxWidth: "9rem" }}>{value.name}</span>
                            </NavLink>
                        </li>
                    );
                })
                }
            </ul>
        </div>
    )
}

export default TopGames;