import axios from "axios";
import config from './config.json';
import userinfoService from "./userinfo.service";

axios.defaults.headers.common['Content-Type'] = 'application/json'

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
        console.log("api. refreshing token");
        const data = {            
            token: userinfoService.getInfo().refreshToken
        };
        let response = await axios.post(config.Addressees.AccountsAPI + "/api/auth/refresh-token", data);
        console.log("api. refresh token status =", response.status);

        if (response.status == 200) {
            userinfoService.saveInfo(response.data);
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
        const userInfo = userinfoService.getInfo();
        const data = {            
            token: userInfo.refreshToken       
        };
        const axios_config =  {
            withCredentials: true,
            headers: {                
                Authorization: 'Bearer ' + userInfo.jwtToken
            }
        }
        await axios.post(config.Addressees.AccountsAPI + "/api/auth/revoke-token", data, axios_config);
        userinfoService.deleteInfo();
        this._stopRefreshTokenTimer();
    }

    bng_games_fetch(opts) {
        opts.baseURL = config.Addressees.GamesAPI;
        return axios.request(opts);
    }

    bng_accounts_fetch(opts) {
        opts.baseURL = config.Addressees.AccountsAPI;
        return axios.request(opts);
    }

    _refreshTokenTimeout;

    _startRefreshTokenTimer() {

        if (this._refreshTokenTimeout)
            this._stopRefreshTokenTimer();

        const jwtTokenPayload = userinfoService.getTokenPayload();
        // set a timeout to refresh the token a minute before it expires
        const expires = new Date(jwtTokenPayload.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (60 * 1000);

        console.log("api. Starting timeout. ms =", timeout);

        this._refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);
    }

    _stopRefreshTokenTimer() {
        console.log("api. Stopping timeout");
        clearTimeout(this._refreshTokenTimeout);
    }
}

const instance = new Api();

export default instance;