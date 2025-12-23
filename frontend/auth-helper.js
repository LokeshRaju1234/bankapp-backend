// auth-helper.js

// Get stored access token
function getAccessToken() {
  return localStorage.getItem("accessToken");
}

function setAccessToken(token) {
  if (token) localStorage.setItem("accessToken", token);
  else localStorage.removeItem("accessToken");
}

async function tryRefreshToken() {
  try {
    const res = await fetch("http://localhost:8080/auth/refresh", {
      method: "POST",
      credentials: "include", // send HttpOnly refresh cookie
    });
    if (!res.ok) return false;
    const data = await res.json();
    setAccessToken(data.accessToken);
    return true;
  } catch (e) {
    return false;
  }
}

// authFetch: use for protected endpoints. Usage: authFetch(url, options)
// async function authFetch(url, options = {}) {
//   if (!options.headers) options.headers = {};

//   const token = getAccessToken();
//   if (token) {
//     options.headers["Authorization"] = "Bearer " + token;
//   }

//   // 🔴 ALWAYS send cookies (no condition)
//   // options.credentials = "include";
//   if (!("credentials" in options)) options.credentials = "include";


//   let res = await fetch(url, options);

//   if (res.status === 401 || res.status === 403) {
//     console.log("🔐 Access token expired → trying refresh");

//     const ok = await tryRefreshToken();

//     if (!ok) {
//       console.log("⛔ Refresh token expired → logout");
//       logout();
//       throw new Error("Session expired. Please login again.");
//     }

//     console.log("🔄 Refresh success → retrying request");

//     const newToken = getAccessToken();
//     if (newToken) {
//       options.headers["Authorization"] = "Bearer " + newToken;
//     }

//     res = await fetch(url, options);
//   }

//   return res;
// }

// added new 
async function authFetch(url, options = {}) {
  showLoader(); // START LOADER

  if (!options.headers) options.headers = {};

  const token = getAccessToken();
  if (token) {
    options.headers["Authorization"] = "Bearer " + token;
  }

  if (!("credentials" in options)) {
    options.credentials = "include";
  }

  try {
    let res = await fetch(url, options);

    if (res.status === 401 || res.status === 403) {
      const ok = await tryRefreshToken();
      if (!ok) {
        logout();
        throw new Error("Session expired");
      }

      options.headers["Authorization"] =
        "Bearer " + getAccessToken();

      res = await fetch(url, options);
    }

    return res;
  } finally {
    hideLoader(); // STOP LOADER
  }
}


// function logout() {
//   const username = localStorage.getItem("currentUser") || "";
//   // request server to clear refresh token cookie
//   fetch("http://localhost:8080/auth/logout", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ username }),
//     credentials: "include",
//   }).finally(() => {
//     localStorage.clear();
//     window.location.href = "login.html";
//   });
// }

function logout() {
  showLoader(); // 🔵 SHOW LOADER IMMEDIATELY

  const username = localStorage.getItem("currentUser") || "";

  fetch("http://localhost:8080/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
    credentials: "include",
  })
  .catch(() => {
    // ignore errors, still logout locally
  })
  .finally(() => {
    localStorage.clear();

    // 🔵 small delay so loader is visible
    setTimeout(() => {
      window.location.href = "login.html";
    }, 300);
  });
}
