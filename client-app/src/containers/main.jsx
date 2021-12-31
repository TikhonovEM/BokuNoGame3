import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom';

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetchingGames: true,
            isFetchingLocalNews: true,
            isFetchingGlobalNews: true,
            games: {},
            localNews: {},
            globalNews: {},
            title: null,
            text: null,
            reference: null
        };

        this.inputHandler = this.inputHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    inputHandler(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value });
    }

    submitHandler(event, isLocal) {
        event.preventDefault();
        var opts = {
            method: "POST",
            body: JSON.stringify({
                title: this.state.title,
                text: this.state.text,
                reference: this.state.reference,
                isLocal: isLocal
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch("/api/Game/CreateNews", opts).then(response => {
            if (response.status == 200) {
                response.json().then(res => {
                    this.setState({
                        [res.sourceName]: res.data
                    })
                });
            }
        });
    }

    componentDidMount() {

        const opts = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip;q=1.0, compress;q=0.5'
            }
        };
        fetch("/api/Game/GetTopMostPopularGames?top=8", opts)
            .then(res => res.json())
            .then((result) => this.setState({
                games: result,
                isFetchingGames: false
            }));

        fetch("/api/Game/GetNews?isLocal=false", opts)
            .then(res => res.json())
            .then((result) => this.setState({
                globalNews: result,
                isFetchingGlobalNews: false
            }));

        fetch("/api/Game/GetNews?isLocal=true", opts)
            .then(res => res.json())
            .then((result) => this.setState({
                localNews: result,
                isFetchingLocalNews: false
            }));
        
    }


    render() {
        if (this.state.isFetchingGames || this.state.isFetchingGlobalNews || this.state.isFetchingLocalNews)
            return <div>...Loading</div>;
        return (
            <div>
                <div className="text-center">
                    <h1 className="display-4">Добро пожаловать в NGNL</h1>
                </div>
                <div>
                    <h3 className="bg-secondary text-left">Популярно среди пользователей сайта:</h3>
                    <ul className="list-inline text-center">
                        {this.state.games.map(function (value, index, array) {
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
                <div className="row">
                    <div className="col-md-9 order-md-1" style={{ padding: "0px" }}>
                        <section>
                            <div className="row">
                                <div className="col-md-9 text-center bg-danger">
                                    <h3>Новости игрового мира</h3>
                                </div>
                                <button type="button" className="btn btn-danger rounded-0 col-md-3" data-toggle="modal" data-target="#exampleModal">
                                    Предложить новость
                                </button>
                                <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog mw-100 w-50" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Новая новость</h5>
                                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <form asp-action="CreateNews" method="post">
                                                <div className="modal-body">
                                                    <div className="form-group row">
                                                        <label htmlFor="title" className="col-sm-2 col-form-label">Заголовок</label>
                                                        <div className="col-sm-10">
                                                            <input className="form-control" id="title" name="title" type="text" size="35" onInput={this.inputHandler} />
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label htmlFor="text" className="col-sm-2 col-form-label">Текст</label>
                                                        <div className="col-sm-10">
                                                            <textarea className="form-control" id="text" name="text" rows="5" cols="60" onChange={this.inputHandler}></textarea>
                                                        </div>
                                                    </div>
                                                    <div className="form-group row">
                                                        <label htmlFor="reference" className="col-sm-2 col-form-label">Ссылка</label>
                                                        <div className="col-sm-10">
                                                            <input className="form-control" id="reference" name="reference" type="text" size="35" onInput={this.inputHandler} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                                                    <button type="submit" className="btn btn-primary" data-dismiss="modal" onClick={e => this.submitHandler(e, false)}>Опубликовать</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ul className="list-group">
                                {this.state.globalNews.map(function (value, index, array) {
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
                                                            {value.authorName &&
                                                                <div className="card-footer text-muted">
                                                                    {"От " + value.authorName}
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
                        </section>
                    </div>
                    <div className="col-md-3 order-md-2">
                        <section>
                            <div className="row">
                                <div className="col-md-12 text-center bg-primary">
                                    <h3>Новости сервиса</h3>
                                </div>
                                <ul className="list-group">
                                    {this.state.localNews.map(function (value, index, array) {
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
                                                                {value.authorName &&
                                                                    <div className="card-footer text-muted">
                                                                        {"От " + value.authorName}
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
                    </div>
                </div>
            </div>
        );
    }
}