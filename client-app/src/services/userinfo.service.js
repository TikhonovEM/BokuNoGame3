import {Buffer} from 'buffer';

class UserinfoService {

    saveInfo(info) {
        if (localStorage.getItem("userinfo") != null) {
            localStorage.removeItem("userinfo");
        }
        localStorage.setItem("userinfo", Buffer.from(JSON.stringify(info)).toString('base64'));
    }

    getInfo() {
        let userInfoBase64 = localStorage.getItem("userinfo");
        if (userInfoBase64 == null) {
            return null;
        }
        return JSON.parse(Buffer.from(userInfoBase64, 'base64'));
    }

    deleteInfo() {
        localStorage.removeItem("userinfo");
    }

    getTokenPayload() {
        let userInfoBase64 = localStorage.getItem("userinfo");
        if (userInfoBase64 == null) {
            return null;
        }
        let userInfo = JSON.parse(Buffer.from(userInfoBase64, 'base64'));
        return JSON.parse(Buffer.from(userInfo.jwtToken.split(".")[1], 'base64'));
    }
}

export default new UserinfoService();