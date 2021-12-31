import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, NavLink } from 'react-router-dom';

export default class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: {},
            isFetching: true,
            nickname: null,
            fullName: null,
            email: null,
            birthDate: null
        };

        this.submitHandler = this.submitHandler.bind(this);
        this.inputHandler = this.inputHandler.bind(this);
        this.exportLibraries = this.exportLibraries.bind(this);
        this.importLibraries = this.importLibraries.bind(this);
        this.loadPhoto = this.loadPhoto.bind(this);
    }

    exportLibraries(event) {
        alert("Coming Soon...");
    }

    importLibraries(event) {
        alert("Coming Soon...");
    }

    loadPhoto(event) {
        var formData = new FormData();
        var photo = document.getElementById("profile-photo-file").files[0];
        formData.append("file", photo);
        fetch("/api/Account/LoadPhoto", {
            method: "POST",
            body: formData
        }).then(response => {
            if (response.status == 200) {
                response.json().then(res => {
                    this.setState({
                        data: res
                    })
                });
            }
        });

    }

    inputHandler(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value });
    }

    submitHandler(event) {
        event.preventDefault();
        fetch("/api/Account/EditProfile", {
            method: "POST",
            body: JSON.stringify({
                "nickname": this.state.nickname,
                "fullName": this.state.fullName,
                "email": this.state.email,
                "birthDate": this.state.birthDate === "" ? null : this.state.birthDate
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status == 200) {
                response.json().then(res => {
                    alert("Профиль обновлен!");
                    this.setState({
                        data: res
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
        fetch("/api/Account/Profile/" + this.props.match.params.userName, opts)
            .then(res => res.json())
            .then((result) => this.setState({
                data: result,
                isFetching: false
            }));
    }

    render() {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (this.state.isFetching)
            return <div>...Loading</div>;
        return (
            <div className="container emp-profile">
                <div className="row">
                    <div className="col-md-4">
                        <div className="profile-img">
                            {
                                (userInfo != null && userInfo.userId === this.state.data.user.id)
                                    ? <form id="profile-photo" asp-controller="Account" asp-action="LoadPhoto" enctype="multipart/form-data" method="post">
                                        <div className="file">
                                            <label>
                                                <input type="file" id="profile-photo-file" name="file" accept="image/*" style={{ display: "none" }} onChange={this.loadPhoto} />
                                                <img src={"data:image;base64," + this.state.data.user.photo} alt="" style={{ maxWidth: "300px", maxHeight: "400px" }} />
                                            </label>
                                        </div>
                                    </form>
                                    : <img src={"data:image;base64," + this.state.data.user.photo} alt="" style={{ maxWidth: "300px", maxHeight: "400px" }} />
                            }
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="profile-head">
                            <h5>
                                {this.state.data.user.nickname}
                            </h5>
                            <h6>
                                Профиль
                            </h6>
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item">
                                    <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Основная информация</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Дополнительно</a>
                                </li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <div className="tab-content profile-tab" id="myTabContent">
                                    <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>User Id</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{this.state.data.user.userName}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Полное имя</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{this.state.data.user.fullName} </p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Email</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{this.state.data.user.email}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Дата рождения</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{new Date(this.state.data.user.birthDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>С нами с </label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{new Date(this.state.data.user.registrationDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Игр в библиотеке</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>{this.state.data.gameSummaries.length}</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label>Оставлено отзывов</label>
                                            </div>
                                            <div className="col-md-6">
                                                <p>230</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {(userInfo != null && userInfo.userId === this.state.data.user.id) &&
                        <div className="col-md-2">
                            <button type="button" className="btn btn-info w-100" data-toggle="modal" data-target="#exampleModal">
                                Изменить профиль
                            </button>
                            <button className="btn btn-info" onClick={this.exportLibraries}>
                                Экспортировать библиотеку
                            </button>
                            <form className="form-inline" method="post" enctype="multipart/form-data" id="import-lib">
                                <div className="import">
                                    <label>
                                        <input className="btn btn-info" type="file" id="jsonfile" name="jsonfile" style={{ display: "none" }} onChange={this.importLibraries} />
                                        <span className="btn btn-info">Импортировать библиотеку</span>
                                    </label>
                                </div>
                            </form>
                            <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Данные профиля</h5>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <form method="post">
                                            <div className="modal-body">
                                                <div className="form-group row">
                                                    <label for="nickname" className="col-sm-4 col-form-label">Никнейм</label>
                                                    <div className="col-sm-3">
                                                        <input type="text" id="nickname" name="nickname" size="35" onInput={this.inputHandler} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label for="fullName" className="col-sm-4 col-form-label">Полное имя</label>
                                                    <div className="col-sm-3">
                                                        <input type="text" id="fullName" name="fullName" size="35" onInput={this.inputHandler} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label for="email" className="col-sm-4 col-form-label">Email</label>
                                                    <div className="col-sm-3">
                                                        <input type="email" id="email" name="email" size="35" onInput={this.inputHandler} />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label for="birthDate" className="col-sm-4 col-form-label">Дата рождения</label>
                                                    <div className="col-sm-3">
                                                        <input type="date" name="birthDate" name="birthDate" onInput={this.inputHandler} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                                                <button type="submit" className="btn btn-primary" data-dismiss="modal" onClick={this.submitHandler}>Обновить</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>

                <br />
                <ul className="nav nav-tabs nav-fill" id="listTab" role="tablist">
                    {this.state.data.catalogs.map(function (value, index, array) {
                        return (
                            (value.id == 2)
                                ? <li className="nav-item" key={index}>
                                    <a className="nav-link active" id={value.id + "-tab"} data-toggle="tab" href={"#" + value.id} role="tab" aria-controls={value.id} aria-selected="true" onClick={e => alert("")}>{value.name}</a>
                                </li>
                                : <li className="nav-item" key={index}>
                                    <a className="nav-link" id={value.id + "-tab"} data-toggle="tab" href={"#" + value.id} role="tab" aria-controls={value.id} aria-selected="true" onClick={e => alert("")}>{value.name}</a>
                                </li>
                        );
                    })
                    }
                </ul>
                <div style={{ width: "90%", margin: "0 auto" }}>
                    <table id="userGameSummaries" className="table table-striped table-bordered dt-responsive nowrap" width="100%" cellSpacing="0">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>GameId</th>
                                <th>GameName</th>
                                <th>Genre</th>
                                <th>Rate</th>
                                <th>Open</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                    </table>
                </div>

            </div >
        );
    }
}