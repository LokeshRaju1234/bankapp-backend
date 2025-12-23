// auth.js (login + register) — keep this file included in login.html and signup.html

// document.addEventListener("DOMContentLoaded", () => {
//   const registerBtn = document.getElementById("registerBtn");
//   const loginBtn = document.getElementById("loginBtn");

//   if (registerBtn) {
//     registerBtn.addEventListener("click", async () => {
//       const username = document.getElementById("regUsername").value.trim();
//       const password = document.getElementById("regPassword").value.trim();
//       const confirm = document.getElementById("regConfirmPassword").value.trim();
//       const msg = document.getElementById("registerMsg");

//       if (!username || !password || !confirm) {
//         msg.style.color = "red"; msg.innerText = "All fields required"; return;
//       }
//       if (password !== confirm) {
//         msg.style.color = "red"; msg.innerText = "Passwords do not match"; return;
//       }

//       try {
//         const res = await fetch("http://localhost:8080/auth/register", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ username, password })
//         });
//         const text = await res.text();
//         if (!res.ok) throw new Error(text);
//         alert("Registration successful");
//         window.location.href = "login.html";
//       } catch (err) {
//         msg.style.color = "red"; msg.innerText = err.message;
//       }
//     });
//   }

//   if (loginBtn) {
//     loginBtn.addEventListener("click", async () => {
//       const username = document.getElementById("loginUsername").value.trim();
//       const password = document.getElementById("loginPassword").value.trim();
//       const msg = document.getElementById("loginMsg");

//       if (!username || !password) {
//         msg.style.color = "red"; msg.innerText = "Enter username & password"; return;
//       }

//       try {
//         const res = await fetch("http://localhost:8080/auth/login", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ username, password }),
//           credentials: "include" // important so cookie is set by browser
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(JSON.stringify(data));

//         // store access token in localStorage for use in Authorization header
//         localStorage.setItem("accessToken", data.accessToken);
//         localStorage.setItem("currentUser", username);
//         localStorage.setItem("isLoggedIn", "true");

//         window.location.href = "index.html";
//       } catch (err) {
//         msg.style.color = "red";
//         msg.innerText = typeof err.message === "string" ? err.message : err;
//       }
//     });
//   }
// });


// added new
// auth.js (login + register) — keep this file included in login.html and signup.html

document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById("registerBtn");
  const loginBtn = document.getElementById("loginBtn");

  /* ================= REGISTER ================= */
  if (registerBtn) {
    registerBtn.addEventListener("click", async () => {
      const username = document.getElementById("regUsername").value.trim();
      const password = document.getElementById("regPassword").value.trim();
      const confirm = document.getElementById("regConfirmPassword").value.trim();
      const msg = document.getElementById("registerMsg");

      if (!username || !password || !confirm) {
        msg.style.color = "red";
        msg.innerText = "All fields required";
        return;
      }

      if (password !== confirm) {
        msg.style.color = "red";
        msg.innerText = "Passwords do not match";
        return;
      }

      try {
        showLoader(); // 🔵 START LOADER

        const res = await fetch("http://localhost:8080/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });

        const text = await res.text();
        if (!res.ok) throw new Error(text);

        alert("Registration successful");
        window.location.href = "login.html";

      } catch (err) {
        msg.style.color = "red";
        msg.innerText = err.message;
      } finally {
        hideLoader(); // 🔵 STOP LOADER
      }
    });
  }

  /* ================= LOGIN ================= */
  if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value.trim();
      const msg = document.getElementById("loginMsg");

      if (!username || !password) {
        msg.style.color = "red";
        msg.innerText = "Enter username & password";
        return;
      }

      try {
        showLoader(); // 🔵 START LOADER

        const res = await fetch("http://localhost:8080/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
          credentials: "include" // important so cookie is set by browser
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Login failed");

        // store access token in localStorage
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("currentUser", username);
        localStorage.setItem("isLoggedIn", "true");

        window.location.href = "index.html";

      } catch (err) {
        msg.style.color = "red";
        msg.innerText =
          typeof err.message === "string" ? err.message : "Login error";
      } finally {
        hideLoader(); // 🔵 STOP LOADER
      }
    });
  }
});
