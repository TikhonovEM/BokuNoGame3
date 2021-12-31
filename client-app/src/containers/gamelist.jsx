import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom';
import './css/gamelist.css'

export default class GameList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            isFetching: true
        };
        this.getPage = this.getPage.bind(this);
    }

    filter = {
        name: null,
        genre: 0,
        publisher: null,
        developer: null,
        releaseYearStart: 1900,
        releaseYearEnd: 2021,
        rating: 0.0,
        ageRating: null
    }

    getPage(page) {
        this.setState({
            isFetching: true
        })
        const opts = {
            method: 'POST',
            body: JSON.stringify(this.filter),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        console.log(opts.body);

        const uri = '/api/Game/GameList/' + page;
        fetch(uri, opts)
            .then(res => res.json())
            .then(result => this.setState({
                data: result,
                isFetching: false
            }));
    }

    componentDidMount() {
        this.getPage(1);
    }

    render() {
        if (this.state.isFetching)
            return <div>...Loading</div>;
        var pageNumber = this.state.data.pagination.pageNumber;
        return (
            <div className="row">
                <div className="col-md-8 order-md-1">
                    <div className="row">
                        <ul className="list-group list-group-horizontal repeat">
                            {this.state.data.games.map(function (value, index, array) {
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
                    {this.state.data.pagination.hasPreviousPage &&
                        <button className="btn btn-outline-dark" onClick={this.getPage.bind(this, pageNumber - 1)}>
                            <i className="glyphicon glyphicon-chevron-left"></i>Назад
                        </button>
                    }
                    {this.state.data.pagination.hasNextPage &&
                        <button className="btn btn-outline-dark" onClick={this.getPage.bind(this, pageNumber + 1)}>
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
                                            <input className="form-control" type="text" id="name" name="name" value={this.filter.name} onInput={e => this.filter.name = e.target.value} />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-100 d-none d-md-block"></div>
                                <div className="form-group list-group-item">
                                    <div className="row">
                                        <label className="col-md-3 control-label" htmlFor="genre">Жанр</label>
                                        <div className="col-md-9">
                                            <select className="form-control" id="genre" name="genre" onChange={e => this.filter.genre = parseInt(e.target.value)}>
                                                {Object.entries(this.state.data.filterData.genres).map(([key, value]) =>
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
                                            <select className="form-control" id="publisher" name="publisher" onChange={e => this.filter.publisher = e.target.value}>
                                                {this.filter.publisher ?
                                                    <option key={this.filter.publisher} selected>{this.filter.publisher}</option>
                                                    : <option key={"Выберите издателя"} selected disabled>Выберите издателя</option>
                                                }
                                                {this.state.data.filterData.publishers.map(function (value, index, array) {
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
                                            <select className="form-control" id="developer" name="developer" onChange={e => this.filter.developer = e.target.value}>
                                                {this.filter.developer ?
                                                    <option key={this.filter.developer} selected>{this.filter.developer}</option>
                                                    : <option key={"Выберите разработчика"} selected disabled>Выберите разработчика</option>
                                                }
                                                {this.state.data.filterData.developers.map(function (value, index, array) {
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
                                            <select className="form-control-sm" id="releaseYearStart" name="releaseYearStart" onChange={e => this.filter.releaseYearStart = parseInt(e.target.value)}>
                                                {this.filter.releaseYearStart ?
                                                    <option key={this.filter.releaseYearStart} selected>{this.filter.releaseYearStart}</option>
                                                    : <option key={"Год выхода старт"} selected disabled>Год выхода</option>
                                                }
                                                {this.state.data.filterData.startYears.map(function (value, index, array) {
                                                    return (
                                                        <option key={value}>{value}</option>
                                                    )
                                                })
                                                }
                                            </select>
                                            <span>по </span>
                                            <select className="form-control-sm" id="releaseYearEnd" name="releaseYearEnd" onChange={e => this.filter.releaseYearEnd = parseInt(e.target.value)}>
                                                {this.filter.releaseYearEnd ?
                                                    <option key={this.filter.releaseYearEnd} selected>{this.filter.releaseYearEnd}</option>
                                                    : <option key={"год выхода конец"} selected disabled>Год выхода</option>
                                                }
                                                {this.state.data.filterData.endYears.map(function (value, index, array) {
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
                                            <input className="form-control-range" type="range" min="0" max="10" value={this.filter.rating} id="rating" name="rating" onChange={e => this.filter.rating = parseInt(e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-100 d-none d-md-block"></div>
                                <div className="form-group list-group-item">
                                    <div className="row">
                                        <label className="col-md-3 control-label" htmlFor="ageRating">Возрастной рейтинг</label>
                                        <div className="col-md-9">
                                            <select className="form-control" id="ageRating" name="ageRating" onChange={e => this.filter.ageRating = e.target.value}>
                                                {this.filter.ageRating ?
                                                    <option key={this.filter.ageRating} selected>{this.filter.ageRating}</option>
                                                    : <option key={"Выберите возрастной рейтинг"} selected disabled>Выберите возрастной рейтинг</option>
                                                }
                                                {this.state.data.filterData.ageRatings.map(function (value, index, array) {
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
                                        <button type="submit" className="btn btn-success" onClick={this.getPage.bind(this, 1)}>
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
}