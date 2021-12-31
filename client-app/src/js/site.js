function logout() {
    fetch("/api/Account/Logout", {
        method: "POST"
    }).then(response => {
        if (response.status == 200) {
            window.localStorage.removeItem("userInfo");
            window.location.replace("/");
        }
    });
}
