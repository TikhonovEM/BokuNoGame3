import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom';
import api from '../services/api';
import './css/gamelist.css'

let filter = {
    name: "",
    genre: 0,
    publisher: null,
    developer: null,
    releaseYearStart: 1900,
    releaseYearEnd: 2021,
    rating: 0.0,
    ageRating: null
}

const GameList = (props) => {

    useEffect(() => {
        getFilterData();
        getPage(1);
    }, []);

    let [pageState, setPageState] = useState({
        data: {},            
        isFetching: true
    });

    let [filterState, setFilterState] = useState({
        filterData: {},
        isFetching: true
    });

    const getFilterData = () => {
        setFilterState({
            isFetching: true
        })

        api.bng_games_fetch({
            url: 'api/GameList/FilterData',
            method: 'GET'
        })
        .then(res => setFilterState({
            filterData: res.data,
            isFetching: false
        }));
    }

    const getPage = (page) => {
        setPageState({
            isFetching: true
        });

        api.bng_games_fetch({
            url: `/api/GameList/${page}-${JSON.stringify(filter)}`,
            method: 'GET'
        })
        .then(res => {
            setPageState({
                data: res.data,
                isFetching: false
            })
        });
    }

    if (pageState.isFetching || filterState.isFetching)
        return <div>...Loading</div>;
    var pageNumber = pageState.data.pagination.pageNumber;
    return (
        <div className="row">
            <div className="col-md-8 order-md-1">
                <div className="row">
                    <ul className="list-group list-group-horizontal repeat">
                        {pageState.data.games.map(function (value, index, array) {
                            return (
                                <li className="list-group-item btn btn-outline-light" key={index}>
                                    <NavLink to={'/Game/' + value.id}>
                                        <div>
                                            <img src={"data:image;base64," + value.logo} width="80" height="80" />
                                            <div>{value.name}</div>
                                        </div>
                                    </NavLink>
                                </li>
                            );
                        })
                        }
                    </ul>
                </div>
                {pageState.data.pagination.hasPreviousPage &&
                    <button className="btn btn-outline-dark" onClick={e => getPage(pageNumber - 1)}>
                        <i className="glyphicon glyphicon-chevron-left"></i>Назад
                    </button>
                }
                {pageState.data.pagination.hasNextPage &&
                    <button className="btn btn-outline-dark" onClick={e => getPage(pageNumber + 1)}>
                        Вперед<i className="glyphicon glyphicon-chevron-right"></i>
                    </button>
                }
            </div>
            <div className="col-md-4 order-md-2">
                <div className="sticky-top">
                    <form className="card">
                        <div className="card-header">
                            Панель фильтрации
                        </div>
                        <div className="card-body">
                            <div className="form-group list-group-item">
                                <div className="row">
                                    <label className="col-md-3 control-label" htmlFor="name">Название</label>
                                    <div className="col-md-9">
                                        <input className="form-control" type="text" id="name" name="name" defaultValue={filter.name} onInput={e => filter.name = e.target.value} />
                                    </div>
                                </div>
                            </div>
                            <div className="w-100 d-none d-md-block"></div>
                            <div className="form-group list-group-item">
                                <div className="row">
                                    <label className="col-md-3 control-label" htmlFor="genre">Жанр</label>
                                    <div className="col-md-9">
                                        <select className="form-control" id="genre" name="genre" 
                                        onChange={e => filter.genre = parseInt(e.target.value)}
                                        defaultValue={filter.genre}>
                                            {Object.entries(filterState.filterData.genres).map(([key, value]) =>
                                                <option key={key} value={key}>{value}</option>
                                            )
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="w-100 d-none d-md-block"></div>
                            <div className="form-group list-group-item">
                                <div className="row">
                                    <label className="col-md-3 control-label" htmlFor="publisher">Издатель</label>
                                    <div className="col-md-9">
                                        <select className="form-control" id="publisher" name="publisher" 
                                        onChange={e => filter.publisher = e.target.value}
                                        defaultValue={filter.publisher ? filter.publisher : "Выберите издателя"}>
                                            <option key={"Выберите издателя"} value={"Выберите издателя"} disabled>Выберите издателя</option>
                                            {filterState.filterData.publishers.map(function (value, index, array) {
                                                return (
                                                    <option key={value}>{value}</option>
                                                    )
                                            })
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="w-100 d-none d-md-block"></div>
                            <div className="form-group list-group-item">
                                <div className="row">
                                    <label className="col-md-3 control-label" htmlFor="developer">Разработчик</label>
                                    <div className="col-md-9">
                                        <select className="form-control" id="developer" name="developer" 
                                        onChange={e => filter.developer = e.target.value}
                                        defaultValue={filter.developer ? filter.developer : "Выберите разработчика"}>
                                            <option key={"Выберите разработчика"} value={"Выберите разработчика"} disabled>Выберите разработчика</option>
                                            {filterState.filterData.developers.map(function (value, index, array) {
                                                return (
                                                    <option key={value}>{value}</option>
                                                )
                                            })
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="w-100 d-none d-md-block"></div>
                            <div className="form-group list-group-item">
                                <div className="row">
                                    <span className="col-md-3">Дата выхода с </span>
                                    <div className="col-md-9">
                                        <select className="form-control-sm" id="releaseYearStart" name="releaseYearStart" 
                                        onChange={e => filter.releaseYearStart = parseInt(e.target.value)}
                                        defaultValue={filter.releaseYearStart}>
                                            {filterState.filterData.startYears.map(function (value, index, array) {
                                                return (
                                                    <option key={value}>{value}</option>
                                                )
                                            })
                                            }
                                        </select>
                                        <span>по </span>
                                        <select className="form-control-sm" id="releaseYearEnd" name="releaseYearEnd" 
                                        onChange={e => filter.releaseYearEnd = parseInt(e.target.value)}
                                        defaultValue={filter.releaseYearEnd}>
                                            {filterState.filterData.endYears.map(function (value, index, array) {
                                                return (
                                                    <option key={value}>{value}</option>
                                                )
                                            })
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="w-100 d-none d-md-block"></div>
                            <div className="form-group list-group-item">
                                <div className="row">
                                    <label className="col-md-3 control-label" htmlFor="rating">Средний рейтинг</label>
                                    <div className="col-md-9">
                                        <input className="form-control-range" type="range" min="0" max="10" value={filter.rating} id="rating" name="rating" 
                                        onChange={e => filter.rating = parseInt(e.target.value)} />
                                    </div>
                                </div>
                            </div>
                            <div className="w-100 d-none d-md-block"></div>
                            <div className="form-group list-group-item">
                                <div className="row">
                                    <label className="col-md-3 control-label" htmlFor="ageRating">Возрастной рейтинг</label>
                                    <div className="col-md-9">
                                        <select className="form-control" id="ageRating" name="ageRating" 
                                        onChange={e => filter.ageRating = e.target.value}
                                        defaultValue={filter.ageRating ? filter.ageRating : "Выберите возрастной рейтинг"}>
                                            <option key={"Выберите возрастной рейтинг"} defaultValue={"Выберите возрастной рейтинг"} disabled>Выберите возрастной рейтинг</option>
                                            {filterState.filterData.ageRatings.map(function (value, index, array) {
                                                return (
                                                    <option key={value}>{value}</option>
                                                )
                                            })
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-100 d-none d-md-block"></div>
                        <div className="card-footer">
                            <div className="row">
                                <div className="col-md-3">
                                    <button type="submit" className="btn btn-success" onClick={e => getPage(1)}>
                                        Применить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default GameList;