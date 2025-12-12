// Prevent access to dashboard without login
if (!localStorage.getItem("isLoggedIn")) {
    window.location.href = "login.html";
}

/* ----- Logout ----- */
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
