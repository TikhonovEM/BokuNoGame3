import React, { useState } from 'react';
import { NavLink, Navigate } from 'react-router-dom';
import './css/login.css';
import api from '../services/api';

const Login = (props) => {
    let [login, setLogin] = useState(null);
    let [password, setPassword] = useState(null);
    let [rememberMe, setRememberMe] = useState(false);
    let [redirect, setRedirect] = useState(false);

    const submitHandler = async (event) => {
        event.preventDefault();
        let result = await api.login(login, password, rememberMe);
        if (result.successful) {
            setRedirect(true);
        }
    }

    if (redirect) {
        document.location = '/';
        //return (<Navigate to='/' replace={true} />);
    }
    return (
        <div id="logreg-forms">
            <div className="card rounded-0">
                <form className="form-signin" onSubmit={submitHandler}>
                    <h1 className="h3 mb-3 font-weight-normal card-header" style={{ textAlign: "center"}}> Вход в учетную запись </h1>

                    <div className="card-body">
                        <input type="text" className="form-control" name="login" placeholder="Логин" required="" onChange={e => setLogin(e.target.value)} />

                        <input type="password" className="form-control" name="password" placeholder="Пароль" required="" onChange={e => setPassword(e.target.value)} />

                        <input type="checkbox" className="form-check-input" name="rememberMe" onChange={e => setRememberMe(e.target.value)} />
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
export default Login;