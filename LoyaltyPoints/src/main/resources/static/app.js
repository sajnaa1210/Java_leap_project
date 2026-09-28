const API = "/api";

let customers = [];
let transactions = [];

/* =====================================
   INITIAL LOAD
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    setupForms();
    loadAllData();

});


async function loadAllData() {

    await loadCustomers();

    updateDashboard();
    populateCustomerSelects();

    const transactionSelect =
        document.getElementById("transactionCustomer");

    if (
        transactionSelect &&
        transactionSelect.value
    ) {
        await loadTransactions();
    }

}


/* =====================================
   NAVIGATION
===================================== */

function showSection(sectionId, button) {

    document
        .querySelectorAll(".page-section")
        .forEach(section => {
            section.classList.remove("active-section");
        });

    document
        .getElementById(sectionId)
        .classList.add("active-section");


    document
        .querySelectorAll(".nav-item")
        .forEach(item => {
            item.classList.remove("active");
        });


    if (button) {
        button.classList.add("active");
    }


    const titles = {
        dashboard: "Dashboard",
        customers: "Customers",
        earn: "Earn Points",
        redeem: "Redeem Points",
        adjust: "Adjust Points",
        transactions: "Transactions"
    };

    document.getElementById("pageTitle").textContent =
        titles[sectionId] || "LoyaltyPoints";


    if (sectionId === "transactions") {
        loadTransactions();
    }

}


function openSection(sectionId) {

    const buttons =
        document.querySelectorAll(".nav-item");

    const sectionOrder = [
        "dashboard",
        "customers",
        "earn",
        "redeem",
        "adjust",
        "transactions"
    ];

    const index =
        sectionOrder.indexOf(sectionId);

    showSection(
        sectionId,
        index >= 0 ? buttons[index] : null
    );

}


/* =====================================
   API HELPER
===================================== */

async function apiRequest(url, options = {}) {

    const config = {
        headers: {
            "Content-Type": "application/json"
        },
        ...options
    };

    try {

        const response =
            await fetch(url, config);

        let data = null;

        const contentType =
            response.headers.get("content-type");

        if (
            contentType &&
            contentType.includes("application/json")
        ) {
            data = await response.json();
        }
        else {
            const text = await response.text();

            if (text) {
                data = text;
            }
        }


        if (!response.ok) {

            let message =
                "Something went wrong.";

            if (typeof data === "string") {
                message = data;
            }
            else if (data?.message) {
                message = data.message;
            }
            else if (data?.error) {
                message = data.error;
            }

            throw new Error(message);
        }

        return data;

    }
    catch (error) {

        showToast(
            "Error",
            error.message ||
            "Unable to connect to the server.",
            false
        );

        throw error;
    }

}


/* =====================================
   CUSTOMER
===================================== */

async function loadCustomers() {

    try {

        const data =
            await apiRequest(`${API}/customers`);

        customers =
            Array.isArray(data) ? data : [];

        renderCustomers();

    }
    catch (error) {

        customers = [];
        renderCustomers();

    }

}


function renderCustomers() {

    const body =
        document.getElementById("customerTableBody");

    if (!body) return;


    const search =
        (
            document.getElementById("customerSearch")
                ?.value || ""
        ).toLowerCase();


    const filtered =
        customers.filter(customer => {

            return (
                (customer.name || "")
                    .toLowerCase()
                    .includes(search) ||

                (customer.email || "")
                    .toLowerCase()
                    .includes(search) ||

                (customer.phone || "")
                    .toLowerCase()
                    .includes(search)
            );

        });


    document.getElementById(
        "customerCountLabel"
    ).textContent =
        `${filtered.length} customer${filtered.length === 1 ? "" : "s"}`;


    if (filtered.length === 0) {

        body.innerHTML = `

            <tr>
                <td colspan="6">

                    <div class="empty-state">

                        <div>♙</div>

                        <h4>No customers found</h4>

                        <p>
                            Register a customer to start
                            the loyalty program.
                        </p>

                    </div>

                </td>
            </tr>
        `;

        return;
    }


    body.innerHTML =
        filtered.map(customer => {

            const tier =
                customer.tier || "BRONZE";

            const balance =
                customer.pointsBalance ?? 0;

            const lifetime =
                customer.lifetimePoints ?? 0;

            return `

                <tr>

                    <td>

                        <div class="table-user">

                            <div class="customer-avatar">
                                ${initials(customer.name)}
                            </div>

                            <div>
                                <strong>
                                    ${escapeHtml(customer.name)}
                                </strong>

                                <span>
                                    ID #${customer.id}
                                </span>
                            </div>

                        </div>

                    </td>


                    <td>

                        <strong>
                            ${escapeHtml(customer.email || "—")}
                        </strong>

                        <br>

                        <span style="
                            color:#8c8994;
                            font-size:9px;
                        ">
                            ${escapeHtml(customer.phone || "No phone")}
                        </span>

                    </td>


                    <td class="points-number">
                        ${formatNumber(balance)} pts
                    </td>


                    <td>
                        ${formatNumber(lifetime)} pts
                    </td>


                    <td>
                        <span class="tier-label ${tier}">
                            ${tier}
                        </span>
                    </td>


                    <td>

                        <div class="action-buttons">

                            <button
                                class="action-btn"
                                onclick="editCustomer(${customer.id})">
                                Edit
                            </button>

                            <button
                                class="action-btn"
                                onclick="quickEarn(${customer.id})">
                                + Points
                            </button>

                            <button
                                class="action-btn delete"
                                onclick="deleteCustomer(${customer.id})">
                                Delete
                            </button>

                        </div>

                    </td>

                </tr>
            `;

        }).join("");

}


function toggleCustomerForm() {

    const card =
        document.getElementById("customerFormCard");

    card.classList.toggle("hidden");


    if (card.classList.contains("hidden")) {

        document
            .getElementById("customerForm")
            .reset();

        document
            .getElementById("editCustomerId")
            .value = "";

    }

}


function editCustomer(id) {

    const customer =
        customers.find(c => Number(c.id) === Number(id));

    if (!customer) return;


    document
        .getElementById("customerFormCard")
        .classList.remove("hidden");


    document.getElementById("editCustomerId").value =
        customer.id;

    document.getElementById("customerName").value =
        customer.name || "";

    document.getElementById("customerEmail").value =
        customer.email || "";

    document.getElementById("customerPhone").value =
        customer.phone || "";


    document
        .getElementById("customerFormCard")
        .scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

}


async function deleteCustomer(id) {

    const customer =
        customers.find(c => Number(c.id) === Number(id));

    if (!customer) return;


    const confirmed =
        confirm(
            `Delete ${customer.name}?\n\n` +
            `Customers with transaction history ` +
            `may be protected from deletion.`
        );

    if (!confirmed) return;


    try {

        await apiRequest(
            `${API}/customers/${id}`,
            {
                method: "DELETE"
            }
        );


        showToast(
            "Customer Deleted",
            `${customer.name} was removed successfully.`
        );


        await loadAllData();

    }
    catch (error) {
        // apiRequest already displays error.
    }

}


/* =====================================
   FORMS
===================================== */

function setupForms() {

    const customerForm =
        document.getElementById("customerForm");

    const earnForm =
        document.getElementById("earnForm");

    const redeemForm =
        document.getElementById("redeemForm");

    const adjustForm =
        document.getElementById("adjustForm");


    customerForm?.addEventListener(
        "submit",
        handleCustomerSubmit
    );

    earnForm?.addEventListener(
        "submit",
        handleEarnSubmit
    );

    redeemForm?.addEventListener(
        "submit",
        handleRedeemSubmit
    );

    adjustForm?.addEventListener(
        "submit",
        handleAdjustmentSubmit
    );

}


async function handleCustomerSubmit(event) {

    event.preventDefault();


    const id =
        document.getElementById("editCustomerId").value;

    const payload = {

        name:
            document
                .getElementById("customerName")
                .value
                .trim(),

        email:
            document
                .getElementById("customerEmail")
                .value
                .trim(),

        phone:
            document
                .getElementById("customerPhone")
                .value
                .trim()
    };


    try {

        if (id) {

            await apiRequest(
                `${API}/customers/${id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(payload)
                }
            );


            showToast(
                "Customer Updated",
                "Customer information was updated."
            );

        }
        else {

            await apiRequest(
                `${API}/customers`,
                {
                    method: "POST",
                    body: JSON.stringify(payload)
                }
            );


            showToast(
                "Customer Added",
                "New loyalty member registered successfully."
            );

        }


        document
            .getElementById("customerForm")
            .reset();

        document
            .getElementById("editCustomerId")
            .value = "";

        document
            .getElementById("customerFormCard")
            .classList.add("hidden");


        await loadAllData();

    }
    catch (error) {
        // Error already shown.
    }

}


/* =====================================
   EARN
===================================== */

async function handleEarnSubmit(event) {

    event.preventDefault();


    const customerId =
        document.getElementById("earnCustomer").value;

    const amount =
        Number(
            document.getElementById("purchaseAmount").value
        );

    const note =
        document.getElementById("earnNote").value.trim();


    if (!customerId) {

        showToast(
            "Select Customer",
            "Please select a customer first.",
            false
        );

        return;
    }


    if (amount <= 0) {

        showToast(
            "Invalid Amount",
            "Purchase amount must be greater than zero.",
            false
        );

        return;
    }


    const payload = {
        purchaseAmount: amount,
        note: note
    };


    try {

        const result =
            await apiRequest(
                `${API}/customers/${customerId}/earn`,
                {
                    method: "POST",
                    body: JSON.stringify(payload)
                }
            );


        let message =
            "Purchase recorded and loyalty points awarded.";

        if (result?.pointsEarned !== undefined) {

            message =
                `${result.pointsEarned} points awarded successfully.`;

        }


        showToast(
            "Points Awarded",
            message
        );


        document
            .getElementById("earnForm")
            .reset();


        await loadAllData();

    }
    catch (error) {
        // Error already displayed.
    }

}


function quickEarn(customerId) {

    openSection("earn");

    setTimeout(() => {

        document.getElementById(
            "earnCustomer"
        ).value = customerId;

        document.getElementById(
            "purchaseAmount"
        ).focus();

    }, 50);

}


/* =====================================
   REDEEM
===================================== */

async function handleRedeemSubmit(event) {

    event.preventDefault();


    const customerId =
        document.getElementById(
            "redeemCustomer"
        ).value;

    const points =
        Number(
            document.getElementById(
                "redeemPoints"
            ).value
        );

    const note =
        document.getElementById(
            "redeemNote"
        ).value.trim();


    if (!customerId || points <= 0) {

        showToast(
            "Invalid Redemption",
            "Select a customer and enter valid points.",
            false
        );

        return;
    }


    const payload = {
        points: points,
        note: note
    };


    try {

        await apiRequest(
            `${API}/customers/${customerId}/redeem`,
            {
                method: "POST",
                body: JSON.stringify(payload)
            }
        );


        showToast(
            "Points Redeemed",
            `${formatNumber(points)} points redeemed successfully.`
        );


        document
            .getElementById("redeemForm")
            .reset();


        await loadAllData();

        updateRedeemBalance();

    }
    catch (error) {
        // Error already displayed.
    }

}


function updateRedeemBalance() {

    const id =
        Number(
            document.getElementById(
                "redeemCustomer"
            )?.value
        );

    const customer =
        customers.find(
            c => Number(c.id) === id
        );


    document.getElementById(
        "redeemBalance"
    ).textContent =
        formatNumber(
            customer?.pointsBalance ?? 0
        );

}


/* =====================================
   ADJUSTMENT
===================================== */

async function handleAdjustmentSubmit(event) {

    event.preventDefault();


    const customerId =
        document.getElementById(
            "adjustCustomer"
        ).value;

    const points =
        Number(
            document.getElementById(
                "adjustPoints"
            ).value
        );

    const note =
        document.getElementById(
            "adjustNote"
        ).value.trim();


    if (!customerId || points === 0) {

        showToast(
            "Invalid Adjustment",
            "Enter a non-zero point adjustment.",
            false
        );

        return;
    }


    const payload = {
        points: points,
        note: note
    };


    try {

        await apiRequest(
            `${API}/customers/${customerId}/adjust`,
            {
                method: "POST",
                body: JSON.stringify(payload)
            }
        );


        showToast(
            "Points Adjusted",
            `${points > 0 ? "+" : ""}${points} points applied.`
        );


        document
            .getElementById("adjustForm")
            .reset();


        await loadAllData();

    }
    catch (error) {
        // Error already displayed.
    }

}


/* =====================================
   TRANSACTIONS
===================================== */

async function loadTransactions() {

    const select =
        document.getElementById(
            "transactionCustomer"
        );

    const body =
        document.getElementById(
            "transactionTableBody"
        );


    if (!select || !body) return;


    const customerId =
        select.value;


    if (!customerId) {

        transactions = [];

        body.innerHTML = `

            <tr>
                <td colspan="6">

                    <div class="empty-state">

                        <div>↕</div>

                        <h4>Select a customer</h4>

                        <p>
                            Choose a customer to view
                            their transaction history.
                        </p>

                    </div>

                </td>
            </tr>
        `;

        updateDashboard();

        return;
    }


    try {

        const data =
            await apiRequest(
                `${API}/customers/${customerId}/transactions`
            );


        transactions =
            Array.isArray(data) ? data : [];


        renderTransactions();

        updateDashboard();

    }
    catch (error) {

        transactions = [];
        renderTransactions();

    }

}


function renderTransactions() {

    const body =
        document.getElementById(
            "transactionTableBody"
        );


    if (!body) return;


    if (transactions.length === 0) {

        body.innerHTML = `

            <tr>
                <td colspan="6">

                    <div class="empty-state">

                        <div>↕</div>

                        <h4>No transactions</h4>

                        <p>
                            This customer has no loyalty
                            activity yet.
                        </p>

                    </div>

                </td>
            </tr>
        `;

        return;
    }


    body.innerHTML =
        transactions.map(tx => {

            const type =
                tx.type ||
                tx.transactionType ||
                "ADJUSTMENT";

            const points =
                Number(tx.points ?? 0);

            const customer =
                customers.find(
                    c =>
                        Number(c.id) ===
                        Number(
                            tx.customer?.id ??
                            tx.customerId
                        )
                );


            return `

                <tr>

                    <td>
                        #${tx.id ?? "—"}
                    </td>


                    <td>
                        ${escapeHtml(
                            customer?.name ||
                            tx.customer?.name ||
                            "Customer"
                        )}
                    </td>


                    <td>

                        <span class="transaction-type ${type}">
                            ${type}
                        </span>

                    </td>


                    <td class="
                        ${points >= 0
                            ? "positive"
                            : "negative"}
                    ">

                        ${points > 0 ? "+" : ""}
                        ${formatNumber(points)}

                    </td>


                    <td>
                        ${escapeHtml(
                            tx.note ||
                            tx.description ||
                            "—"
                        )}
                    </td>


                    <td>
                        ${formatDate(
                            tx.createdAt ||
                            tx.date
                        )}
                    </td>

                </tr>
            `;

        }).join("");

}


/* =====================================
   SELECTS
===================================== */

function populateCustomerSelects() {

    const ids = [
        "earnCustomer",
        "redeemCustomer",
        "adjustCustomer"
    ];


    ids.forEach(id => {

        const select =
            document.getElementById(id);

        if (!select) return;


        const previousValue =
            select.value;


        select.innerHTML =
            `<option value="">
                Select a customer
            </option>` +

            customers.map(customer => `

                <option value="${customer.id}">

                    ${escapeHtml(customer.name)}
                    — ${formatNumber(
                        customer.pointsBalance ?? 0
                    )} pts

                </option>

            `).join("");


        if (
            customers.some(
                c =>
                    String(c.id) ===
                    String(previousValue)
            )
        ) {
            select.value = previousValue;
        }

    });


    const transactionSelect =
        document.getElementById(
            "transactionCustomer"
        );


    if (transactionSelect) {

        const previous =
            transactionSelect.value;


        transactionSelect.innerHTML =
            `<option value="">
                Select a customer
            </option>` +

            customers.map(customer => `

                <option value="${customer.id}">
                    ${escapeHtml(customer.name)}
                </option>

            `).join("");


        if (
            customers.some(
                c =>
                    String(c.id) ===
                    String(previous)
            )
        ) {
            transactionSelect.value =
                previous;
        }

    }


    updateRedeemBalance();

}


/* =====================================
   DASHBOARD
===================================== */

function updateDashboard() {

    const totalCustomers =
        customers.length;


    const totalPoints =
        customers.reduce(
            (sum, customer) =>
                sum +
                Number(
                    customer.pointsBalance ?? 0
                ),
            0
        );


    const premiumMembers =
        customers.filter(customer => {

            const tier =
                String(
                    customer.tier || ""
                ).toUpperCase();

            return (
                tier === "GOLD" ||
                tier === "PLATINUM"
            );

        }).length;


    setText(
        "totalCustomers",
        formatNumber(totalCustomers)
    );

    setText(
        "totalPoints",
        formatNumber(totalPoints)
    );

    setText(
        "premiumMembers",
        formatNumber(premiumMembers)
    );

    setText(
        "transactionCount",
        formatNumber(transactions.length)
    );


    renderRecentCustomers();

}


function renderRecentCustomers() {

    const container =
        document.getElementById(
            "recentCustomers"
        );


    if (!container) return;


    if (customers.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div>♙</div>

                <h4>No customers yet</h4>

                <p>
                    Register your first loyalty member.
                </p>

            </div>
        `;

        return;
    }


    const recent =
        [...customers]
            .reverse()
            .slice(0, 5);


    container.innerHTML =
        recent.map(customer => `

            <div class="recent-customer">

                <div class="customer-main">

                    <div class="customer-avatar">
                        ${initials(customer.name)}
                    </div>

                    <div>

                        <strong>
                            ${escapeHtml(customer.name)}
                        </strong>

                        <span>
                            ${escapeHtml(
                                customer.email || ""
                            )}
                        </span>

                    </div>

                </div>


                <div class="customer-points">

                    <strong>
                        ${formatNumber(
                            customer.pointsBalance ?? 0
                        )} pts
                    </strong>

                    <span>
                        ${customer.tier || "BRONZE"}
                    </span>

                </div>

            </div>

        `).join("");

}


/* =====================================
   TOAST
===================================== */

let toastTimer;


function showToast(
    title,
    message,
    success = true
) {

    const toast =
        document.getElementById("toast");

    const icon =
        document.getElementById("toastIcon");


    document.getElementById(
        "toastTitle"
    ).textContent = title;


    document.getElementById(
        "toastMessage"
    ).textContent = message;


    icon.textContent =
        success ? "✓" : "!";


    icon.style.background =
        success
            ? "#2b8c68"
            : "#c94d5e";


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 3500);

}


/* =====================================
   HELPERS
===================================== */

function initials(name = "") {

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(word =>
            word.charAt(0).toUpperCase()
        )
        .join("") || "C";

}


function formatNumber(value) {

    return Number(value || 0)
        .toLocaleString("en-IN");

}


function formatDate(value) {

    if (!value) return "—";

    const date =
        new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString(
        "en-IN",
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

}


function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}