import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

export default class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            isFetching: true
        };
    }

    /*componentDidUpdate() {
        const s = document.createElement('script');
        s.src = "/js/rateit/scripts/jquery.rateit.min.js";
        document.body.appendChild(s);
    }*/

    componentDidMount() {

        const opts = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Accept-Encoding': 'gzip;q=1.0, compress;q=0.5'
            }
        };
        fetch("/api/Game/" + this.props.match.params.gameId, opts)
            .then(res => res.json())
            .then((result) => this.setState({
                data: result,
                isFetching: false
            }));

        /*$("#user-rateit").bind("rated", function (ev) {
            let url = '@Url.Content("~/")' + "Game/UpdateGameRate";
            let gameId = '@Model.Game.Id';
            let userId = '@userManager.GetUserId(User)';
            $.post(url,
                {
                    gameId: gameId,
                    userId: userId,
                    rate: $(this).rateit('value') * 2
                },
                function (data) {
                    $("#user-rate-value").text(data.rate);
                });
        });*/
    }

    render() {
        if (this.state.isFetching)
            return <div>...Loading</div>;
        return (
            <div className="container">
                <section>
                    <div>
                        <header className="text-center mb-5">
                            <h1>{this.state.data.game.name}</h1>
                        </header>
                        <div className="main-page row">
                            <div className="image img-fluid col-md-4 mx-auto text-center">
                                <img src={"data:image;base64," + this.state.data.game.logo} style={{ maxHeight: "500px", maxWidth: "400px" }} />
                            </div>
                            <div className="info col-md-4">
                                <h4 className="bg-secondary"><b>Информация:</b></h4>
                                <div>
                                    <b>Жанр: </b><span>{this.state.data.game.genre}</span>
                                </div>
                                <div>
                                    <b>Разработчик: </b><span>{this.state.data.game.developer}</span>
                                </div>
                                <div>
                                    <b>Издатель: </b><span>{this.state.data.game.publisher}</span>
                                </div>
                                <div>
                                    <b>Возрастной рейтинг: </b><span>{this.state.data.game.ageRating}</span>
                                </div>
                                <div>
                                    <b>Дата выхода: </b><span>{this.state.data.game.releaseDate}</span>
                                </div>
                            </div>
                            <div className="rating col-md-4">
                                <h4 className="bg-secondary"><b>Рейтинг:</b></h4>
                                <div className="row">
                                    <div className="col-md-5">
                                        <div className="rateit ml-3 mt-1"
                                            data-rateit-value={this.state.data.rate.currentRateStr}
                                            data-rateit-step="0.01"
                                            data-rateit-readonly="true"
                                            data-rateit-mode="font" style={{ fontSize: "40px" }}></div>
                                    </div>
                                    <div className="col-md-7" style={{ fontSize: "35px" }}>{this.state.data.rate.currentRate}</div>
                                </div>
                            </div>
                            <div className="description row">
                                <div className="col-md-4">
                                </div>
                                <div className="col-md-8">
                                    <h4 className="bg-secondary"><b>Описание:</b></h4>
                                    <p dangerouslySetInnerHTML={{ __html: this.state.data.game.description }}></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}