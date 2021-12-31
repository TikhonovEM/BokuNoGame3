import React from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import './css/login.css';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: null,
            password: null,
            rememberMe: false,
            redirect: false
        };

        this.inputHandler = this.inputHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    inputHandler(event) {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value });
    }

    submitHandler(event) {
        event.preventDefault();
        fetch("/api/Account/Login", {
            method: "POST",
            body: JSON.stringify({
                'login': this.state.login,
                'password': this.state.password,
                'rememberMe': this.state.rememberMe
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.status == 200) {                
                response.json().then(res => {
                    localStorage.setItem("userInfo", JSON.stringify(res));
                    this.setState({ redirect: true });
                })
            }
        });
    }

    render() {
        if (this.state.redirect)
            return (<Navigate push to='/' />);
        return (
            <div id="logreg-forms">
                <div className="card rounded-0">
                    <form className="form-signin" onSubmit={this.submitHandler}>
                        <h1 className="h3 mb-3 font-weight-normal card-header" style={{ textAlign: "center"}}> Вход в учетную запись </h1>

                        <div className="card-body">
                            <input type="text" className="form-control" name="login" placeholder="Логин" required="" onChange={this.inputHandler} />

                            <input type="password" className="form-control" name="password" placeholder="Пароль" required="" onChange={this.inputHandler} />

                            <input type="checkbox" className="form-check-input" name="rememberMe" onChange={this.inputHandler} />
                            <label asp-for="RememberMe" className="form-check-label">Запомнить пароль?</label>

                            <button className="btn btn-success w-100" type="submit"><i className="fas fa-sign-in-alt"></i> Войти</button>
                        </div>
                    </form>
                    <div className="card-footer text-center">
                        <NavLink to="/Account/Register" className="btn btn-info text-decoration-none"><i className="fas fa-user-plus"></i> Создать новую запись</NavLink>
                    </div>
                </div>
            </div>
        );
    }
}