import React from 'react';
import { Navigate } from 'react-router-dom';
import './css/register.css';
import { bng_accounts_fetch } from '../js/site';

export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: null,
            password: null,
            confirmPassword: null,
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
        const validation = document.getElementById("validation");

        if (this.state.password !== this.state.confirmPassword) {
            validation.innerText = "Введенные пароли не совпадают!";
            return;
        }

        bng_accounts_fetch("/api/Account/Register", {
            method: "POST",
            body: JSON.stringify({
                'login': this.state.login,
                'password': this.state.password
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
            else {               
                response.json().then(res => {
                    validation.innerText = res.errors.join('\n');
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
                    <form className="form-signin" method="post" onSubmit={this.submitHandler}>
                        <div id="validation"></div>
                        <h1 className="h3 mb-3 font-weight-normal card-header" style={{ textAlign: "center"}}> Регистрация </h1>

                        <div className="card-body">
                            <input type="text" name="login" className="form-control" placeholder="Логин" required="" autoFocus="" onChange={this.inputHandler} />

                            <input type="password" name="password" className="form-control" placeholder="Пароль" required="" onChange={this.inputHandler} />

                            <input type="password" name="confirmPassword" className="form-control" placeholder="Повторите пароль" required="" onChange={this.inputHandler} />

                            <button className="btn btn-success w-100" type="submit"><i className="fas fa-sign-in-alt"></i> Зарегистрироваться</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}