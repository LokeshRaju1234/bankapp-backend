// let myChart = null;
// function updateAccountIdBox() {
//   const box = document.getElementById("userAccountIdBox");
//   const savedId = localStorage.getItem("accountId");

//   if (savedId) {
//     box.style.display = "block";
//     box.innerHTML = `🆔 Your Account ID: ${savedId} 📋 (Click to copy)`;
//     box.setAttribute("data-id", savedId);

//     box.onclick = () => {
//       navigator.clipboard.writeText(savedId);
//       box.innerHTML = `✔ Copied: ${savedId}`;
//       setTimeout(() => {
//         box.innerHTML = `🆔 Your Account ID: ${savedId} 📋 (Click to copy)`;
//       }, 1500);
//     };
//   } else {
//     box.style.display = "none";
//     box.innerHTML = "";
//   }
// }


// function clearErrorOnInput(inputId, errorBoxId) {
//   const input = document.getElementById(inputId);
//   const errorBox = document.getElementById(errorBoxId);

//   if (!input || !errorBox) return;

//   input.addEventListener("input", () => {
//     errorBox.innerHTML = "";
//   });
// }


// document.addEventListener("DOMContentLoaded", () => {
//   updateAccountIdBox();
// });

// /* ---------------- FETCH ACCOUNTS ---------------- */
// function getAccounts() {
//   authFetch("http://localhost:8080/accounts")
//     .then(async (res) => {
//       if (!res.ok) throw new Error(await res.text());
//       return res.json();
//     })
//     .then((data) => {
//       document.getElementById("output").style.color = "black";

//       let table = `
//       <table border="1" cellpadding="8">
//         <tr>
//           <th>Name</th>
//           <th>Account No</th>
//           <th>Balance</th>
//         </tr>`;

//       data.forEach((a) => {
//         table += `
//         <tr>
//           <td>${a.name}</td>
//           <td>${a.accountNo}</td>
//           <td>${a.balance}</td>
//         </tr>`;
//       });

//       table += `</table>`;
//       document.getElementById("output").innerHTML = table;

//       if (myChart) myChart.destroy();
//       myChart = new Chart(document.getElementById("balanceChart"), {
//         type: "bar",
//         data: {
//           labels: data.map((a) => a.name),
//           datasets: [
//             { label: "Account Balance", data: data.map((a) => a.balance) },
//           ],
//         },
//       });
//     })
//     .catch((err) => {
//       document.getElementById("output").style.color = "red";
//       document.getElementById("output").innerHTML =
//         "Error fetching accounts ❌ " + err.message;
//     });
// }

// /* ---------------- CREATE ACCOUNT ---------------- */
// function createAccount() {
//   let name = document.getElementById("newName").value.trim();
//   let accountNumber = document.getElementById("newAccNo").value.trim();
//   let balance = document.getElementById("newBalance").value.trim();
//   let BType = document.getElementById("newType").value.trim();
//   let code = document.getElementById("newIfsc").value.trim();
//   let output = document.getElementById("createOutput");

//   output.style.color = "red";

//   if (name === "") return (output.innerHTML = "❌ Name is required");
//   if (!/^[A-Za-z ]+$/.test(name))
//     return (output.innerHTML = "❌ Name alphabets only");
//   if (accountNumber.length !== 12)
//     return (output.innerHTML = "❌ Account No must be 12 digits");
//   if (balance < 1000) return (output.innerHTML = "❌ Min ₹1000");
//   if (code.length !== 8)
//     return (output.innerHTML = "❌ IFSC must be 8 characters");

//   authFetch("http://localhost:8080/accounts", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       name,
//       accountNo: accountNumber,
//       balance,
//       accountType: BType,
//       ifscCode: code,
//     }),
//   })
//     .then(async (res) => {
//       let data = await res.json();
//       if (!res.ok) throw new Error(data);
//       return data;
//     })
//     .then((data) => {
//       alert("🎉 Account Created!\n🆔 Account ID: " + data.accountId);
//       localStorage.setItem("accountId", data.accountId);
//       updateAccountIdBox();

//       clearInputs("newName", "newAccNo", "newBalance", "newType", "newIfsc");
//       // ✅ clear error text
//       document.getElementById("createOutput").innerHTML = "";
//       // scroll so user can see it
//       document
//         .getElementById("userAccountIdBox")
//         .scrollIntoView({ behavior: "smooth" });

//       getAccounts();
//     })
//     .catch((err) => alert("❌ " + err.message));
// }

// /* ---------------- DELETE ACCOUNT ---------------- */
// function deleteAccount() {
//   let id = document.getElementById("deleteId").value;
//   if (!id) return alert("Enter Account ID");

//   authFetch(`http://localhost:8080/accounts/${id}`, { method: "DELETE" })
//     .then(async (res) => {
//       if (!res.ok) throw new Error(await res.text());
//       alert("✔ Account Deleted");
//       clearInputs("deleteId"); // ✅ clear delete box

//       localStorage.removeItem("accountId");
//       updateAccountIdBox();

//       getAccounts();
//     })
//     .catch((err) => alert("❌ " + "Cannot delete account"));
// }

// /* ---------------- UPDATE ACCOUNT ---------------- */
// function updateAccount() {
//   let id = document.getElementById("updateId").value;
//   if (!id) return alert("Invalid ID");

//   let updated = {
//     name: document.getElementById("updateName").value,
//     accountNo: document.getElementById("updateAccNo").value,
//     balance: Number(document.getElementById("updateBalance").value),
//     accountType: document.getElementById("updateType").value,
//     ifscCode: document.getElementById("updateIfsc").value,
//   };

//   authFetch(`http://localhost:8080/accounts/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(updated),
//   })
//     .then(async (res) => {
//       if (!res.ok) throw new Error(await res.text());
//       alert("✔ Account Updated");
//       clearInputs(
//         "updateId",
//         "updateName",
//         "updateAccNo",
//         "updateBalance",
//         "updateType",
//         "updateIfsc"
//       );
//       getAccounts();
//     })
//     .catch((err) => alert("❌ " + err.message));
// }

// /* ---------------- PATCH ACCOUNT ---------------- */
// function patchAccount() {
//   let id = document.getElementById("patchId").value;
//   if (!id) return alert("Invalid ID");

//   let update = {};
//   let name = document.getElementById("patchName").value;
//   let bal = document.getElementById("patchBalance").value;

//   if (name) update.name = name;
//   if (bal) update.balance = Number(bal);

//   authFetch(`http://localhost:8080/accounts/${id}`, {
//     method: "PATCH",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(update),
//   })
//     .then(async (res) => {
//       if (!res.ok) throw new Error(await res.text());
//       alert("✔ Account Patched");
//       clearInputs("patchId", "patchName", "patchBalance");
//       getAccounts();
//     })
//     .catch((err) => alert("❌ " + err.message));
// }

// /* ---------------- DEPOSIT ---------------- */
// function deposit() {
//   let id = document.getElementById("accountId").value;
//   let amount = document.getElementById("amount").value;

//   authFetch(`http://localhost:8080/accounts/${id}/deposit?amount=${amount}`, {
//     method: "POST",
//   })
//     .then(async (res) => {
//       if (!res.ok) throw new Error(await res.text());
//       alert("✔ Deposit Successful");
//       clearInputs("accountId", "amount"); // ✅
//       getAccounts();
//     })
//     .catch((err) => alert("❌ " + err.message));
// }

// /* ---------------- WITHDRAW ---------------- */
// function withdraw() {
//   let id = document.getElementById("accountId").value;
//   let amount = document.getElementById("amount").value;

//   authFetch(`http://localhost:8080/accounts/${id}/withdraw?amount=${amount}`, {
//     method: "POST",
//   })
//     .then(async (res) => {
//       if (!res.ok) throw new Error(await res.text());
//       alert("✔ Withdraw Successful");
//       clearInputs("accountId", "amount"); // ✅
//       getAccounts();
//     })
//     .catch((err) => alert("❌ " + err.message));
// }

// /* ---------------- TRANSFER ---------------- */
// function transfer() {
//   let fromId = document.getElementById("fromId").value;
//   let toId = document.getElementById("toId").value;
//   let amount = document.getElementById("transferAmount").value;

//   authFetch(
//     `http://localhost:8080/accounts/transfer?fromAccountId=${fromId}&toAccountId=${toId}&amount=${amount}`,
//     { method: "POST" }
//   )
//     .then(async (res) => {
//       if (!res.ok) throw new Error(await res.text());
//       alert("✔ Transfer Successful");
//       clearInputs("fromId", "toId", "transferAmount");
//       getAccounts();
//     })
//     .catch((err) => alert("❌ " + err.message));
// }

// /* ---------------- TRANSACTION HISTORY ---------------- */
// function getTransactions() {
//   let id = document.getElementById("transAccountId").value;
//   let box = document.getElementById("transactionOutput");

//   authFetch(`http://localhost:8080/accounts/${id}/transactions`)
//     .then(async (res) => {
//       if (!res.ok) throw new Error(await res.text());
//       return res.json();
//     })
//     .then((list) => {
//       box.innerHTML = list
//         .map(
//           (t) =>
//             `${t.type} — ₹${t.amount} — ${new Date(
//               t.createdAt
//             ).toLocaleString()}`
//         )
//         .join("<br>");
//     })
//     .catch((err) => {
//       box.style.color = "red";
//       box.innerHTML = "❌ " + err.message;
//     });
// }

// document.addEventListener("DOMContentLoaded", () => {
//   updateAccountIdBox();

//   clearErrorOnInput("newName", "createOutput");
//   clearErrorOnInput("newAccNo", "createOutput");
//   clearErrorOnInput("newBalance", "createOutput");
//   clearErrorOnInput("newType", "createOutput");
//   clearErrorOnInput("newIfsc", "createOutput");
// });

// function clearInputs(...ids) {
//   ids.forEach((id) => {
//     const el = document.getElementById(id);
//     if (el) el.value = "";
//   });
// }


let myChart = null;

/* ================= TOAST SYSTEM ================= */
function showToast(message, type = "info") {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(40px)";
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* ================= ACCOUNT ID BOX ================= */
function updateAccountIdBox() {
  const box = document.getElementById("userAccountIdBox");
  const savedId = localStorage.getItem("accountId");

  if (savedId) {
    box.style.display = "block";
    box.innerHTML = `🆔 Your Account ID: ${savedId} 📋 (Click to copy)`;
    box.onclick = () => {
      navigator.clipboard.writeText(savedId);
      showToast("Account ID copied", "success");
    };
  } else {
    box.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", updateAccountIdBox);

/* ================= FETCH ACCOUNTS ================= */
function getAccounts() {
  authFetch("http://localhost:8080/accounts")
    .then(async res => {
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    })
    .then(data => {
      const output = document.getElementById("output");
      output.innerHTML = "";

      data.forEach(a => {
        const card = document.createElement("div");
        card.className = "account-card";
        card.innerHTML = `
          <span class="badge">${a.accountType}</span>
          <h3>${a.name}</h3>
          <div class="acc-no">**** **** ${a.accountNo.slice(-4)}</div>
          <div class="balance">₹ ${a.balance.toLocaleString()}</div>
        `;
        output.appendChild(card);
      });

      showToast("Accounts loaded", "success");

      if (myChart) myChart.destroy();
      myChart = new Chart(document.getElementById("balanceChart"), {
        type: "bar",
        data: {
          labels: data.map(a => a.name),
          datasets: [{ label: "Balance", data: data.map(a => a.balance) }]
        }
      });
    })
    .catch(() => showToast("Failed to fetch accounts", "error"));
}

/* ================= CREATE ACCOUNT ================= */
function createAccount() {
  const name = newName.value.trim();
  const accountNo = newAccNo.value.trim();
  const balance = Number(newBalance.value);
  const type = newType.value.trim();
  const ifsc = newIfsc.value.trim();

  if (!name || accountNo.length !== 12 || ifsc.length !== 8 || balance < 1000) {
    showToast("Invalid account details", "error");
    return;
  }

  authFetch("http://localhost:8080/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, accountNo, balance, accountType: type, ifscCode: ifsc })
  })
    .then(async res => {
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    })
    .then(data => {
      localStorage.setItem("accountId", data.accountId);
      updateAccountIdBox();
      clearInputs("newName", "newAccNo", "newBalance", "newType", "newIfsc");
      showToast("Account created successfully", "success");
      getAccounts();
    })
    .catch(async (err) => showToast("Account already exists with this Account No and IFSC", "error"));
}

/* ================= DELETE ACCOUNT ================= */
function deleteAccount() {
  const id = deleteId.value;
  if (!id) return showToast("Enter account ID", "info");

  authFetch(`http://localhost:8080/accounts/${id}`, { method: "DELETE" })
    .then(res => {
      if (!res.ok) throw new Error();
      localStorage.removeItem("accountId");
      updateAccountIdBox();
      clearInputs("deleteId");
      showToast("Account deleted", "success");
      getAccounts();
    })
    .catch(() => showToast("Cannot delete account", "error"));
}

/* ================= UPDATE ACCOUNT (PUT) ================= */
function updateAccount() {
  const id = updateId.value;
  if (!id) return showToast("Account ID required", "error");

  const updated = {
    name: updateName.value.trim(),
    accountNo: updateAccNo.value.trim(),
    balance: Number(updateBalance.value),
    accountType: updateType.value.trim(),
    ifscCode: updateIfsc.value.trim()
  };

  authFetch(`http://localhost:8080/accounts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated)
  })
    .then(res => {
      if (!res.ok) throw new Error();
      clearInputs("updateId","updateName","updateAccNo","updateBalance","updateType","updateIfsc");
      showToast("Account updated", "success");
      getAccounts();
    })
    .catch(() => showToast("Update failed", "error"));
}

/* ================= PATCH ACCOUNT ================= */
function patchAccount() {
  const id = patchId.value;
  if (!id) return showToast("Account ID required", "error");

  const payload = {};
  if (patchName.value) payload.name = patchName.value;
  if (patchBalance.value) payload.balance = Number(patchBalance.value);

  if (Object.keys(payload).length === 0) {
    showToast("Nothing to update", "info");
    return;
  }

  authFetch(`http://localhost:8080/accounts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error();
      clearInputs("patchId","patchName","patchBalance");
      showToast("Account patched", "success");
      getAccounts();
    })
    .catch(() => showToast("Patch failed", "error"));
}

/* ================= DEPOSIT ================= */
function deposit() {
  authFetch(`http://localhost:8080/accounts/${accountId.value}/deposit?amount=${amount.value}`, { method: "POST" })
    .then(res => {
      if (!res.ok) throw new Error();
      clearInputs("accountId","amount");
      showToast("Deposit successful", "success");
      getAccounts();
    })
    .catch(() => showToast("Deposit failed", "error"));
}

/* ================= WITHDRAW ================= */
function withdraw() {
  authFetch(`http://localhost:8080/accounts/${accountId.value}/withdraw?amount=${amount.value}`, { method: "POST" })
    .then(res => {
      if (!res.ok) throw new Error();
      clearInputs("accountId","amount");
      showToast("Withdraw successful", "success");
      getAccounts();
    })
    .catch(() => showToast("Withdraw failed", "error"));
}

/* ================= TRANSFER ================= */
function transfer() {
  if (!fromId.value || !toId.value || !transferAmount.value) {
    showToast("Enter transfer details", "info");
    return;
  }

  authFetch(
    `http://localhost:8080/accounts/transfer?fromAccountId=${fromId.value}&toAccountId=${toId.value}&amount=${transferAmount.value}`,
    { method: "POST" }
  )
    .then(res => {
      if (!res.ok) throw new Error();
      clearInputs("fromId","toId","transferAmount");
      showToast("Transfer successful", "success");
      getAccounts();
    })
    .catch(() => showToast("Transfer failed", "error"));
}

/* ================= TRANSACTION HISTORY ================= */
function getTransactions() {
  authFetch(`http://localhost:8080/accounts/${transAccountId.value}/transactions`)
    .then(res => res.json())
    .then(list => {
      transactionOutput.innerHTML = list
        .map(t => `💳 ${t.type} — ₹${t.amount} — ${new Date(t.createdAt).toLocaleString()}`)
        .join("<br>");
      showToast("Transaction history loaded", "info");
    })
    .catch(() => showToast("Failed to load transactions", "error"));
}

/* ================= UTILITY ================= */
function clearInputs(...ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}
