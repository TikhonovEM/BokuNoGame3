import config from './config.json'

function bng_games_fetch(address, opts) {
    return fetch(config.Addressees.GamesAPI + address, opts);
}

function bng_accounts_fetch(address, opts) {
    return fetch(config.Addressees.AccountsAPI + address, opts);
}

function logout() {
    bng_accounts_fetch("/api/Account/Logout", {
        method: "POST"
    }).then(response => {
        if (response.status == 200) {
            window.localStorage.removeItem("userInfo");
            window.location.replace("/");
        }
    });
}

export { bng_accounts_fetch, bng_games_fetch, logout };
