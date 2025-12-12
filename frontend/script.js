let myChart = null;
// Show saved Account ID on refresh
document.addEventListener("DOMContentLoaded", () => {
  let savedId = localStorage.getItem("accountId");
  if (savedId) {
    let box = document.getElementById("userAccountIdBox");
    box.style.display = "block";
    box.innerHTML = `🆔 Your Account ID: ${savedId} 📋 (Click to copy)`;
    box.setAttribute("data-id", savedId);

    box.onclick = () => {
      navigator.clipboard.writeText(savedId);
      box.innerHTML = `✔ Copied: ${savedId}`;
      setTimeout(() => {
        box.innerHTML = `🆔 Your Account ID: ${savedId} 📋 (Click to copy)`;
      }, 1500);
    };
  }
  //  getAccounts(); 
});

/* ---------------- FETCH ACCOUNTS ---------------- */
function getAccounts() {
  fetch("http://localhost:8080/accounts")
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("output").style.color = "black";

      let table = `
      <table border="1" cellpadding="8">
        <tr>
          <th>Name</th>
          <th>Account No</th>
          <th>Balance</th>
        </tr>`;

      data.forEach((a) => {
        table += `
        <tr>
          <td>${a.name}</td>
          <td>${a.accountNo}</td>
          <td>${a.balance}</td>
        </tr>`;
      });
      table += `</table>`;
      document.getElementById("output").innerHTML = table;

      if (myChart != null) myChart.destroy();
      myChart = new Chart(document.getElementById("balanceChart"), {
        type: "bar",
        data: {
          labels: data.map((a) => a.name),
          datasets: [
            { label: "Account Balance", data: data.map((a) => a.balance) },
          ],
        },
      });
    })
    .catch(() => {
      document.getElementById("output").style.color = "red";
      document.getElementById("output").innerHTML =
        "Error fetching accounts ❌";
    });
}

/* ---------------- CREATE ACCOUNT ---------------- */
function createAccount() {
  let name = document.getElementById("newName").value.trim();
  let accountNumber = document.getElementById("newAccNo").value.trim();
  let balance = document.getElementById("newBalance").value.trim();
  let BType = document.getElementById("newType").value.trim();
  let code = document.getElementById("newIfsc").value.trim();
  let output = document.getElementById("createOutput");

  output.style.color = "red";

  if (name === "") return (output.innerHTML = "❌ Name is required");
  if (!/^[A-Za-z ]+$/.test(name))
    return (output.innerHTML = "❌ Name alphabets only");

  if (accountNumber === "")
    return (output.innerHTML = "❌ Account number required");
  if (!/^[0-9]+$/.test(accountNumber))
    return (output.innerHTML = "❌ Digits only");
  if (accountNumber.length !== 12)
    return (output.innerHTML = "❌ Must be 12 digits");

  if (balance === "") return (output.innerHTML = "❌ Balance required");
  if (!/^[0-9]+$/.test(balance))
    return (output.innerHTML = "❌ Balance must be number");
  if (Number(balance) < 1000) return (output.innerHTML = "❌ Min ₹1000");

  if (BType === "") return (output.innerHTML = "❌ Type required");
  if (!/^[A-Za-z ]+$/.test(BType))
    return (output.innerHTML = "❌ Alphabets only");

  if (code === "") return (output.innerHTML = "❌ IFSC required");
  if (!/^[A-Za-z0-9]+$/.test(code))
    return (output.innerHTML = "❌ Letters & digits only");
  if (code.length !== 8) return (output.innerHTML = "❌ Must be 8 characters");

  fetch("http://localhost:8080/accounts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      accountNo: accountNumber,
      balance,
      accountType: BType,
      ifscCode: code,
    }),
  })
    .then(async (res) => {
      let data = await res.json();
      if (!res.ok) throw new Error(data);
      return data;
    })
    .then((data) => {
      alert(
        "🎉 Account Created Successfully!\n🆔 Your Account ID: " +
          data.accountId
      );

      let box = document.getElementById("userAccountIdBox");
      box.style.display = "block";
      box.innerHTML = `🆔 Your Account ID: ${data.accountId} 📋 (Click to copy)`;
      box.setAttribute("data-id", data.accountId);
      // store in localStorage
      localStorage.setItem("accountId", data.accountId);

      box.onclick = () => {
        navigator.clipboard.writeText(box.getAttribute("data-id"));
        box.innerHTML = `✔ Copied: ${data.accountId}`;
        setTimeout(() => {
          box.innerHTML = `🆔 Your Account ID: ${data.accountId} 📋 (Click to copy)`;
        }, 1500);
      };

      output.innerHTML = "";
      document.getElementById("newName").value = "";
      document.getElementById("newAccNo").value = "";
      document.getElementById("newBalance").value = "";
      document.getElementById("newType").value = "";
      document.getElementById("newIfsc").value = "";

      getAccounts();
    })
    .catch((err) => alert("❌ " + err.message));
}

/* ---------------- DELETE ACCOUNT ---------------- */
function deleteAccount() {
  let account_id = document.getElementById("deleteId").value.trim();
  let output = document.getElementById("deleteOutput");

  output.style.color = "red";
  if (account_id === "") return (output.innerHTML = "❌ ID required");
  if (!/^[0-9]+$/.test(account_id))
    return (output.innerHTML = "❌ Digits only");

  fetch(`http://localhost:8080/accounts/${account_id}`, { method: "DELETE" })
    .then(async (res) => {
      let msg = await res.text();
      if (!res.ok) throw new Error(msg);
      return msg;
    })
    .then(() => {
      output.style.color = "green";
      alert("✔ Account Deleted Successfully");
      localStorage.removeItem("accountId");
      document.getElementById("userAccountIdBox").style.display = "none";
      document.getElementById("deleteId").value = "";
      getAccounts();
    })
    .catch((err) => alert("❌ " + err.message));
}

/* ---------------- UPDATE ACCOUNT (PUT) ---------------- */
function updateAccount() {
  let id = document.getElementById("updateId").value;
  if (id === "" || isNaN(id)) return alert("Invalid ID ❌");

  let updated = {
    name: document.getElementById("updateName").value,
    accountNo: document.getElementById("updateAccNo").value,
    balance: Number(document.getElementById("updateBalance").value),
    accountType: document.getElementById("updateType").value,
    ifscCode: document.getElementById("updateIfsc").value,
  };

  fetch(`http://localhost:8080/accounts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  })
    .then(async (res) => {
      let msg = await res.text();
      if (!res.ok) throw new Error(msg);
      return msg;
    })
    .then(() => {
      alert("✔ Account Updated");
      getAccounts();
    })
    .catch((err) => alert(err.message));
}

/* ---------------- PATCH ACCOUNT ---------------- */
function patchAccount() {
  let id = document.getElementById("patchId").value;
  if (id === "" || isNaN(id)) return alert("Invalid ID ❌");

  let update = {};
  let name = document.getElementById("patchName").value;
  let bal = document.getElementById("patchBalance").value;

  if (name) {
    if (!/^[A-Za-z ]+$/.test(name)) return alert("Name alphabets only ❌");
    update.name = name;
  }
  if (bal) {
    bal = Number(bal);
    if (isNaN(bal) || bal <= 1000) return alert("Balance > 1000 ❌");
    update.balance = bal;
  }

  if (Object.keys(update).length === 0)
    return alert("Enter at least one field ❌");

  fetch(`http://localhost:8080/accounts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(update),
  })
    .then(async (res) => {
      let msg = await res.text();
      if (!res.ok) throw new Error(msg);
      return msg;
    })
    .then(() => {
      alert("✔ Account Patched");
      getAccounts();
    })
    .catch((err) => alert(err.message));
}

/* ---------------- DEPOSIT ---------------- */
function deposit() {
  let id = document.getElementById("accountId").value;
  let amount = document.getElementById("amount").value;
  if (id === "" || amount === "" || isNaN(id) || isNaN(amount))
    return alert("Invalid input ❌");

  fetch(`http://localhost:8080/accounts/${id}/deposit?amount=${amount}`, {
    method: "POST",
  })
    .then(async (res) => {
      let msg = await res.text();
      if (!res.ok) throw new Error(msg);
      return msg;
    })
    .then(() => {
      alert("✔ Deposit Successful");
      getAccounts();
    })
    .catch((err) => alert(err.message));
}

/* ---------------- WITHDRAW ---------------- */
function withdraw() {
  let id = document.getElementById("accountId").value;
  let amount = document.getElementById("amount").value;
  if (id === "" || amount === "" || isNaN(id) || isNaN(amount))
    return alert("Invalid input ❌");

  fetch(`http://localhost:8080/accounts/${id}/withdraw?amount=${amount}`, {
    method: "POST",
  })
    .then(async (res) => {
      let msg = await res.text();
      if (!res.ok) throw new Error(msg);
      return msg;
    })
    .then(() => {
      alert("✔ Withdraw Successful");
      getAccounts();
    })
    .catch((err) => alert(err.message));
}

/* ---------------- TRANSFER ---------------- */
function transfer() {
  let fromId = document.getElementById("fromId").value;
  let toId = document.getElementById("toId").value;
  let amount = document.getElementById("transferAmount").value;
  if (fromId === "" || toId === "" || amount === "")
    return alert("Invalid input ❌");

  fetch(
    `http://localhost:8080/accounts/transfer?fromAccountId=${fromId}&toAccountId=${toId}&amount=${amount}`,
    { method: "POST" }
  )
    .then(async (res) => {
      let msg = await res.text();
      if (!res.ok) throw new Error(msg);
      return msg;
    })
    .then(() => {
      alert("✔ Transfer Successful");
      getAccounts();
    })
    .catch((err) => alert(err.message));
}

/* ---------------- TRANSACTIONS HISTORY ---------------- */
function getTransactions() {
  let id = document.getElementById("transAccountId").value;
  let box = document.getElementById("transactionOutput");

  if (id === "" || isNaN(id)) return alert("Enter valid Account ID ❌");

  fetch(`http://localhost:8080/accounts/${id}/transactions`)
    .then(async (res) => {
      let msg = await res.text();
      if (!res.ok) throw new Error(msg);
      return JSON.parse(msg);
    })
    .then((list) => {
      if (list.length === 0) {
        box.style.color = "red";
        box.innerHTML = "No Transactions Found ❌";
        return;
      }

      box.style.color = "black";
      let output = `<h3>Transaction History</h3>`;
      list.forEach((t) => {
        let time = new Date(t.createdAt).toLocaleString();
        output += `${t.type} — ₹${t.amount} — ${time}<br>`;
      });
      box.innerHTML = output;
    })
    .catch((err) => {
      box.style.color = "red";
      box.innerHTML = "❌ " + err.message;
    });
}
