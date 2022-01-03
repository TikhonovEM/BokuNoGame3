import React, { useEffect, useState } from 'react';
import { bng_games_fetch } from '../js/site';

const LocalNews = (props) => {
    const [localNews, setLocalNews] = useState(
        {
            data: {},
            isFetching: true
        });

    const getNews = () => {
        bng_games_fetch("/api/News/Query?$filter=isLocal eq true", {method: "GET"})
        .then(res => res.json())
        .then((result) => setLocalNews({
            data: result,
            isFetching: false
        }));
    };

    useEffect(() => getNews(), []);

    if (localNews.isFetching)
        return <div>...Loading</div>;
    return (
        <section>
        <div className="row">
            <div className="col-md-12 text-center bg-primary">
                <h3>Новости сервиса</h3>
            </div>
            <ul className="list-group">
                {localNews.data.map(function (value, index, array) {
                    return (
                        <li className="list-group-item" key={index}>
                            <article className="card">
                                {
                                    !value.reference ?
                                        <div>
                                            <h4 className="card-header text-center">
                                                {value.title}
                                            </h4>
                                            <div className="card-body">
                                                <p className="card-text">{value.text}</p>
                                            </div>
                                            {value.authorId &&
                                                <div className="card-footer text-muted">
                                                    {"От " + value.authorId}
                                                </div>
                                            }
                                        </div>
                                        : <div>
                                            <h4 className="card-header">
                                                <a href={value.reference}>
                                                    {value.title}
                                                </a>
                                            </h4>
                                        </div>
                                }
                            </article>
                        </li>
                    );
                })
                }
            </ul>
        </div>
    </section>
    )
}

export default LocalNews;