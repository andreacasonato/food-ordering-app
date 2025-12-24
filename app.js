import { menuArray } from "./menu.js";

const menuContainer = document.getElementById("menu-container");

// =============== RENDER MENU ===============
function renderMenu() {
  const categories = getUniqueCategories();

  const menuHTML = categories
    .map((category) => {
      const categoryItems = menuArray.filter(
        (item) => item.category === category
      );

      // Generate HTML for this category section
      return `
    <section class="section-menu section-${category}">
    <h2>${capitalizeCategory(category)}</h2>
    ${generateMenuItemsHTML(categoryItems)}
    </section>
    `;
    })
    .join("");

  // Insert sections into the page
  menuContainer.innerHTML = menuHTML;
}

// ===== HELPER FUNCTIONS =====

// Get unique categories from menu data
function getUniqueCategories() {
  // Use Set to get unique values, then convert back to array
  const categories = [...new Set(menuArray.map((item) => item.category))];
  return categories;
}

function capitalizeCategory(category) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

// Generate HTML for menu items
function generateMenuItemsHTML(items) {
  return items
    .map(
      (item) => `
    <div class="menu-item">
      <img src="${item.image}" alt="${item.name}" class="menu-item-image">
      <div class="menu-item-details">
        <h3 class="menu-item-name">${item.name}</h3>
        <p class="menu-item-ingredients">${item.ingredients.join(", ")}</p>
        <p class="menu-item-price">$${item.price}</p>
      </div>
      <button class="add-btn" data-id="${item.id}">+</button>
    </div>
  `
    )
    .join("");
}

// ========== CART SECTION ==========
let cart = [];

const cartSection = document.getElementById("cart-section");

// ===== CART FUNCTIONALITY =====
// Add item to cart
function addToCart(itemId) {
  // Find the menu item by ID
  const menuItem = menuArray.find((item) => item.id === itemId);

  // Check if item already exists in cart
  const existingItem = cart.find((item) => item.id === itemId);

  if (existingItem) {
    // Item exists - increase quantity
    existingItem.quantity++;
  } else {
    // New item - add to cart with quantity 1
    cart.push({
      ...menuItem,
      quantity: 1,
    });
  }

  console.log("Cart:", cart);
  renderCart();

  showNotification("✅ Added to cart!");
}

// Remove item from cart
function removeFromCart(itemId) {
  // Filter out the item with matching ID
  cart = cart.filter((item) => item.id !== itemId);

  console.log("Cart after removal:", cart); // Debug
  renderCart();
}

// Calculate total price
function calculateTotal() {
  return cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

// Increase quantity
function increaseQuantity(itemId) {
  const cartItem = cart.find((item) => item.id === itemId);
  if (cartItem) {
    cartItem.quantity++;
    renderCart();
    showNotification("✅ Quantity increased!");
  }
}

// Decrease quantity (or remove if quantity is 1)
function decreaseQuantity(itemId) {
  const cartItem = cart.find((item) => item.id === itemId);
  if (cartItem) {
    if (cartItem.quantity === 1) {
      // Remove item completely
      removeFromCart(itemId);
      showNotification("🗑️ Item removed from cart");
    } else {
      // Decrease quantity
      cartItem.quantity--;
      renderCart();
      showNotification("➖ Quantity decreased");
    }
  }
}

// Render cart
function renderCart() {
  // If cart is empty, hide the cart section
  if (cart.length === 0) {
    cartSection.classList.add("hidden");
    cartSection.innerHTML = "";
    return;
  }

  // Cart has items, show it
  cartSection.classList.remove("hidden");

  // Generate cart items HTML
  const cartItemsHTML = cart
    .map(
      (item) => `
  <div class="cart-item">
    <div class="cart-item-left">
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <span class="cart-item-name">${item.name}</span>
        <div class="quantity-controls">
          <button class="quantity-btn decrease-btn" data-decrease="${item.id}">
            −
          </button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn increase-btn" data-increase="${
            item.id
          }">+</button>
        </div>
      </div>
    </div>
    <span class="cart-item-price">$${(item.price * item.quantity).toFixed(
      2
    )}</span>
  </div>
`
    )
    .join("");

  // Calculate total
  const total = calculateTotal();

  // Build complete cart HTML
  cartSection.innerHTML = `
    <h2 class="cart-title">Order summary</h2>
    ${cartItemsHTML}
    <div class="cart-total">
      <span class="cart-total-label">Total price:</span>
      <span class="cart-total-price">$${total.toFixed(2)}</span>
    </div>
    <button class="complete-order-btn" id="complete-order-btn">
      Complete order
    </button>
  `;
}

document.addEventListener("click", (e) => {
  // Handle "add to cart" button clicks
  if (e.target.classList.contains("add-btn")) {
    const itemId = Number(e.target.dataset.id);
    addToCart(itemId);
  }

  // Handle "increase quantity" button clicks
  if (e.target.classList.contains("increase-btn")) {
    const itemId = Number(e.target.dataset.increase);
    increaseQuantity(itemId);
  }

  // Handle "decrease quantity" button clicks
  if (e.target.classList.contains("decrease-btn")) {
    const itemId = Number(e.target.dataset.decrease);
    decreaseQuantity(itemId);
  }

  // Handle "complete order" button click
  if (e.target.id === "complete-order-btn") {
    console.log("Complete order clicked!");

    // Modal
  }
});

// ===== NOTIFICATION FUNCTION =====
function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;

  document.body.appendChild(notification);

  // Remove after 1.8 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 1800);
}

// ===== INITIALIZE APP =====
function initialize() {
  renderMenu();
  renderCart(); // Initially empty
}

// Start the app
initialize();
