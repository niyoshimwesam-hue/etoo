// DEFAULT RESTAURANT MENU

const starterMenu = [
    {
        id: 1,
        name: "Grilled chicken plate",
        category: "Mains",
        price: 8500,
        description: "Herb-marinated chicken, golden potatoes and a fresh garden salad.",
        image: "https://images.unsplash.com/photo-1532634896-26909d0d4b58?auto=format&fit=crop&w=800&q=80",
        tag: "Guest favourite"
    },
    {
        id: 2,
        name: "Creamy mushroom pasta",
        category: "Mains",
        price: 7500,
        description: "Silky parmesan cream, sautéed mushrooms and fresh herbs.",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",
        tag: ""
    },
    {
        id: 3,
        name: "Maison garden salad",
        category: "Starters",
        price: 5500,
        description: "Crisp greens, avocado, cherry tomatoes and citrus dressing.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
        tag: "Fresh"
    },
    {
        id: 4,
        name: "Classic beef burger",
        category: "Mains",
        price: 8000,
        description: "Juicy beef, melted cheese, house sauce and crunchy fries.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        tag: ""
    },
    {
        id: 5,
        name: "Chocolate dessert",
        category: "Desserts",
        price: 4500,
        description: "Rich chocolate, soft centre and a little vanilla sweetness.",
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
        tag: "A sweet finish"
    },
    {
        id: 6,
        name: "Fresh passion juice",
        category: "Drinks",
        price: 2500,
        description: "Freshly blended passion fruit, served chilled.",
        image: "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80",
        tag: ""
    }
];


// RESTAURANT DETAILS

const defaults = {
    restaurant: "Maison Restaurant",
    address: "Kigali, Rwanda",
    phone: "+250 000 000 000",
    email: "hello@maison.rw",
    hours: "Monday – Sunday | 10:00 AM – 10:00 PM"
};


// LOAD SAVED DATA

let menu = JSON.parse(localStorage.getItem("maison_menu") || "null") || starterMenu;

let cart = JSON.parse(localStorage.getItem("maison_cart") || "{}");

let settings = JSON.parse(localStorage.getItem("maison_settings") || "null") || defaults;

let orders = JSON.parse(localStorage.getItem("maison_orders") || "[]");

let activeCategory = "All";


// HELPER FUNCTIONS

const money = n => "RWF " + Number(n).toLocaleString("en-US");

const save = () => {
    localStorage.setItem("maison_menu", JSON.stringify(menu));
    localStorage.setItem("maison_cart", JSON.stringify(cart));
    localStorage.setItem("maison_settings", JSON.stringify(settings));
    localStorage.setItem("maison_orders", JSON.stringify(orders));
};


// DISPLAY MENU

function renderMenu() {

    const categories = [
        "All",
        ...new Set(menu.map(item => item.category))
    ];

    document.getElementById("categories").innerHTML =
        categories.map(category => `
            <button class="cat ${activeCategory === category ? "active" : ""}"
                onclick="setCategory('${esc(category)}')">
                ${esc(category)}
            </button>
        `).join("");

    const items = activeCategory === "All"
        ? menu
        : menu.filter(item => item.category === activeCategory);

    document.getElementById("menuGrid").innerHTML = items.length

        ? items.map(item => `
            <article class="food-card">

                <div class="food-photo">

                    <img src="${esc(item.image || "")}"
                         alt="${esc(item.name)}"
                         onerror="this.style.display='none'">

                    ${item.tag
                        ? `<span class="food-tag">${esc(item.tag)}</span>`
                        : ""
                    }

                </div>

                <div class="food-info">

                    <div class="food-title">

                        <h3>${esc(item.name)}</h3>

                        <span class="price">
                            ${money(item.price)}
                        </span>

                    </div>

                    <p>
                        ${esc(item.description || "Freshly prepared in our kitchen.")}
                    </p>

                    <div class="food-bottom">

                        <span class="muted">
                            ${esc(item.category)}
                        </span>

                        <button class="add"
                            onclick="addToCart(${item.id})">
                            +
                        </button>

                    </div>

                </div>

            </article>
        `).join("")

        : '<div class="empty">No menu items in this category yet.</div>';
}


// PREVENT HTML INJECTION

function esc(value) {

    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);

}


// CHANGE MENU CATEGORY

function setCategory(category) {

    activeCategory = category;

    renderMenu();

}


// ADD FOOD TO CART

function addToCart(id) {

    cart[id] = (cart[id] || 0) + 1;

    save();

    renderCart();

    document.getElementById("cartCount").textContent = cartCount();

}


// COUNT CART ITEMS

function cartCount() {

    return Object.values(cart).reduce((total, quantity) => {
        return total + quantity;
    }, 0);

}


// CALCULATE TOTAL PRICE

function cartTotal() {

    return menu.reduce((total, item) => {
        return total + item.price * (cart[item.id] || 0);
    }, 0);

}


// DISPLAY SHOPPING CART

function renderCart() {

    const lines = menu
        .filter(item => cart[item.id])
        .map(item => `
            <div class="cart-line">

                <div>
                    <b>${esc(item.name)}</b>
                    <small>${money(item.price)} each</small>
                </div>

                <div class="qty">

                    <button onclick="changeQty(${item.id}, -1)">−</button>

                    <b>${cart[item.id]}</b>

                    <button onclick="changeQty(${item.id}, 1)">+</button>

                </div>

                <b>${money(item.price * cart[item.id])}</b>

            </div>
        `).join("");

    document.getElementById("cartItems").innerHTML =
        lines || '<div class="empty">Your basket is empty. Add something delicious from the menu.</div>';

    document.getElementById("cartTotal").textContent = money(cartTotal());

    document.getElementById("checkoutTotal").textContent = money(cartTotal());

    document.getElementById("cartCount").textContent = cartCount();

}


// CHANGE FOOD QUANTITY

function changeQty(id, amount) {

    cart[id] = (cart[id] || 0) + amount;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    save();

    renderCart();

}


// OPEN SHOPPING CART

function openCart() {

    renderCart();

    showModal("cartOverlay");

}


// CONTINUE TO CHECKOUT

function goCheckout() {

    if (!cartCount()) {
        alert("Your basket is empty.");
        return;
    }

    closeModal("cartOverlay");

    showModal("checkoutOverlay");

    renderCart();

}


// OPEN AND CLOSE POPUPS

function showModal(id) {

    document.getElementById(id).classList.add("show");

}

function closeModal(id) {

    document.getElementById(id).classList.remove("show");

}

function backdropClose(event, id) {

    if (event.target.id === id) {
        closeModal(id);
    }

}


// CUSTOMER CHECKOUT

document.getElementById("checkoutForm").addEventListener("submit", event => {

    event.preventDefault();

    if (!cartCount()) return;

    const form = new FormData(event.target);

    const order = {

        number: "M" + Date.now().toString().slice(-7),

        date: new Date().toLocaleString(),

        customer: form.get("name"),

        phone: form.get("phone"),

        address: form.get("address"),

        district: form.get("district"),

        delivery: form.get("delivery"),

        payment: form.get("payment"),

        notes: form.get("notes"),

        items: menu
            .filter(item => cart[item.id])
            .map(item => ({
                name: item.name,
                price: item.price,
                qty: cart[item.id]
            })),

        total: cartTotal(),

        status: "New"

    };


    // SAVE CUSTOMER ORDER

    orders.unshift(order);

    cart = {};

    save();

    renderCart();

    closeModal("checkoutOverlay");

    document.getElementById("successText").textContent =
        "Your order number is " + order.number +
        ". Total: " + money(order.total) +
        ". Payment: " + order.payment + ".";

    showModal("successOverlay");

    event.target.reset();

});


// OPEN ADMIN PANEL

function openAdmin() {

    document.getElementById("adminLogin").style.display = "block";

    document.getElementById("adminArea").style.display = "none";

    document.getElementById("adminPin").value = "";

    showModal("adminOverlay");

}


// ADMIN LOGIN

function adminLogin() {

    const pin = document.getElementById("adminPin").value;

    if (pin !== "1234") {

        alert("Incorrect demo PIN.");

        return;

    }

    document.getElementById("adminLogin").style.display = "none";

    document.getElementById("adminArea").style.display = "block";

    renderAdmin();

    document.querySelectorAll(".admin-tabs button").forEach((button, index) => {

        button.classList.toggle("active", index === 0);

    });

}


// CHANGE ADMIN TAB

function adminTab(id, button) {

    ["menuAdmin", "settingsAdmin", "ordersAdmin"].forEach(section => {

        document.getElementById(section).style.display =
            section === id ? "block" : "none";

    });

    document.querySelectorAll(".admin-tabs button").forEach(tab => {
        tab.classList.remove("active");
    });

    button.classList.add("active");

    if (id === "ordersAdmin") {
        renderOrders();
    }

    if (id === "settingsAdmin") {
        fillSettings();
    }

}


// DISPLAY ADMIN MENU

function renderAdmin() {

    document.getElementById("adminMenuList").innerHTML = menu.map(item => `

        <div class="admin-row">

            <div>
                <b>${esc(item.name)}</b>
                <small>${esc(item.category)} · ${money(item.price)}</small>
            </div>

            <div class="admin-actions">

                <button class="mini" onclick="editItem(${item.id})">
                    Edit
                </button>

                <button class="mini danger" onclick="deleteItem(${item.id})">
                    Delete
                </button>

            </div>

        </div>

    `).join("") || '<p class="muted">No menu items yet.</p>';

}


// EDIT MENU ITEM

function editItem(id) {

    const item = menu.find(x => x.id === id);

    const name = prompt("Item name:", item.name);

    if (name === null) return;

    const price = prompt("Price in RWF:", item.price);

    if (price === null) return;

    const category = prompt("Category:", item.category);

    if (category === null) return;

    const description = prompt("Description:", item.description);

    if (description === null) return;

    const image = prompt("Image URL:", item.image);

    if (image === null) return;

    Object.assign(item, {
        name,
        price: Number(price),
        category,
        description,
        image
    });

    save();

    renderMenu();

    renderAdmin();

}


// DELETE MENU ITEM

function deleteItem(id) {

    if (!confirm("Delete this menu item?")) return;

    menu = menu.filter(item => item.id !== id);

    delete cart[id];

    save();

    renderMenu();

    renderAdmin();

    renderCart();

}


// ADD NEW MENU ITEM

document.getElementById("addItemForm").addEventListener("submit", event => {

    event.preventDefault();

    const form = new FormData(event.target);

    const newItem = {

        id: Date.now(),

        name: form.get("name"),

        price: Number(form.get("price")),

        category: form.get("category"),

        image: form.get("image"),

        description: form.get("description"),

        tag: ""

    };

    menu.push(newItem);

    save();

    event.target.reset();

    renderMenu();

    renderAdmin();

    alert("Menu item added.");

});


// RESTAURANT SETTINGS

function fillSettings() {

    const form = document.getElementById("settingsForm");

    Object.keys(settings).forEach(key => {

        if (form.elements[key]) {
            form.elements[key].value = settings[key];
        }

    });

}


// SAVE RESTAURANT SETTINGS

document.getElementById("settingsForm").addEventListener("submit", event => {

    event.preventDefault();

    const form = new FormData(event.target);

    Object.keys(settings).forEach(key => {

        settings[key] = form.get(key);

    });

    save();

    renderSettings();

    alert("Restaurant details saved.");

});


// DISPLAY RESTAURANT SETTINGS

function renderSettings() {

    document.title = settings.restaurant;

    document.querySelector(".brand").innerHTML =
        esc(settings.restaurant.toLowerCase().replace(" restaurant", "")) +
        '<span>.</span>';

    document.getElementById("addressText").textContent = settings.address;

    document.getElementById("hoursText").textContent = settings.hours;

    document.getElementById("contactText").textContent =
        settings.phone + " | " + settings.email;

}


// DISPLAY CUSTOMER ORDERS IN ADMIN PANEL

function renderOrders() {

    document.getElementById("ordersList").innerHTML = orders.length

        ? orders.map((order, index) => `

            <div class="admin-row" style="display:block">

                <div style="display:flex;justify-content:space-between;gap:10px">

                    <b>
                        Order ${esc(order.number)} · ${money(order.total)}
                    </b>

                    <select onchange="setOrderStatus(${index},this.value)">

                        <option ${order.status === "New" ? "selected" : ""}>
                            New
                        </option>

                        <option ${order.status === "Preparing" ? "selected" : ""}>
                            Preparing
                        </option>

                        <option ${order.status === "Ready" ? "selected" : ""}>
                            Ready
                        </option>

                        <option ${order.status === "Delivered" ? "selected" : ""}>
                            Delivered
                        </option>

                        <option ${order.status === "Cancelled" ? "selected" : ""}>
                            Cancelled
                        </option>

                    </select>

                </div>

                <small>
                    ${esc(order.date)} · ${esc(order.customer)} · ${esc(order.phone)}
                </small>

                <small>
                    ${esc(order.address)}, ${esc(order.district)} · ${esc(order.delivery)}
                </small>

                <small>
                    Payment: ${esc(order.payment)} · ${esc(order.notes || "No notes")}
                </small>

                <small>
                    ${order.items.map(item =>
                        esc(item.name) + " × " + item.qty
                    ).join(", ")}
                </small>

            </div>

        `).join("")

        : '<div class="empty">No orders received yet.</div>';

}


// UPDATE ORDER STATUS

function setOrderStatus(index, status) {

    orders[index].status = status;

    save();

    renderOrders();

}


// INITIALISE WEBSITE

document.getElementById("year").textContent = new Date().getFullYear();

renderMenu();

renderCart();

renderSettings();