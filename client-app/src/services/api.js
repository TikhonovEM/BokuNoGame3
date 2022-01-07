import axios from "axios";
import config from './config.json';
import userinfoService from "./userinfo.service";

class Api {
    async login(login, password, rememberMe) {
        let result = {};
        let response = await axios.request({
            url: config.Addressees.AccountsAPI + "/api/auth/authenticate",
            method: "POST",
            data: {
                login,
                password
            }
        });
        if (response.status == 200) {
            result = {
                successful: true
            };
            userinfoService.saveInfo(response.data);
            this._startRefreshTokenTimer();
        } 
        else {
            result = {
                successful: false,
                errors: response.statusText
            };
        }
        return result;
    }
    
    async refreshToken() {
        console.log("start refresh");
        let response = await axios.post(config.Addressees.AccountsAPI + "/api/auth/refresh-token", {
            withCredentials: true
        });

        if (response.status == 200) {
            this._startRefreshTokenTimer();
        }
        else {
            await this.logout();
        }
    }

    async register(login, password) {
        let result = undefined;
        let response  = await axios.request({
            url: config.Addressees.AccountsAPI + "/api/auth/register",
            method: "POST",
            data: {
                login,
                password
            }
        });
        if (response.status == 200) {
            result = {
                successful: true
            };
            userinfoService.saveInfo(response.data);
            this._startRefreshTokenTimer();
        } 
        else {
            result = {
                successful: false,
                errors: response.data.errors
            };
        }
        return result;
    }

    async logout() {
        let response = await axios.post(config.Addressees.AccountsAPI + "/api/auth/revoke-token", {
            withCredentials: true
        });
        if (response.status == 200) {
            userinfoService.deleteInfo();
            this._stopRefreshTokenTimer();
        }
    }

    bng_games_fetch(opts) {
        opts.baseURL = config.Addressees.GamesAPI;
        return axios.request(opts);
    }

    _refreshTokenTimeout;

    _startRefreshTokenTimer() {
        const jwtTokenPayload = userinfoService.getTokenPayload();
        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtTokenPayload.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);

        this._refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);
    }

    _stopRefreshTokenTimer() {
        clearTimeout(this._refreshTokenTimeout);
    }
}

const instance = new Api();

export default instance;