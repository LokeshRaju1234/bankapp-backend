/* ---------------- REGISTER ---------------- */

document.addEventListener("DOMContentLoaded", () => {

    const registerBtn = document.getElementById("registerBtn");
    const loginBtn = document.getElementById("loginBtn");

    /* ----- Register Logic ----- */
    if (registerBtn) {
        registerBtn.addEventListener("click", () => {
            let username = document.getElementById("regUsername").value.trim();
            let password = document.getElementById("regPassword").value.trim();
            let confirm = document.getElementById("regConfirmPassword").value.trim();
            let msg = document.getElementById("registerMsg");

            if (username === "" || password === "" || confirm === "") {
                msg.style.color = "red";
                msg.innerHTML = "All fields required";
                return;
            }
            if (password !== confirm) {
                msg.style.color = "red";
                msg.innerHTML = "Passwords do not match";
                return;
            }

            fetch("http://localhost:8080/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password})
            })
            .then(async res => {
                let text = await res.text();
                if (!res.ok) throw new Error(text);
                return text;
            })
            .then(() => {
                alert("Registration successful!");
                window.location.href = "login.html";
            })
            .catch(err => {
                msg.style.color = "red";
                msg.innerHTML = err.message;
            });
        });
    }


    /* ---------------- LOGIN ---------------- */

    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            let username = document.getElementById("loginUsername").value.trim();
            let password = document.getElementById("loginPassword").value.trim();
            let msg = document.getElementById("loginMsg");

            if (username === "" || password === "") {
                msg.style.color = "red";
                msg.innerHTML = "Enter username & password";
                return;
            }

            fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password})
            })
            .then(async res => {
                let text = await res.text();
                if (!res.ok) throw new Error(text);
                return text;
            })
            .then(() => {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("currentUser", username);
                window.location.href = "index.html";
            })
            .catch(err => {
                msg.style.color = "red";
                msg.innerHTML = err.message;
            });
        });
    }
});
