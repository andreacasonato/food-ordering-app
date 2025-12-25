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
    showModal();
  }

  // Handle modal background click (close modal)
  if (e.target.id === "payment-modal") {
    hideModal(); // 👈 ADD THIS
  }

  // Handle "start new order" button click
  if (e.target.id === "new-order-btn") {
    resetApp();
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

// ========== MODAL ==========
const modal = document.getElementById("payment-modal");
const payBtn = document.getElementById("pay-btn");
const nameInput = document.getElementById("name-input");
const cardInput = document.getElementById("card-input");
const cvvInput = document.getElementById("cvv-input");
const paymentForm = document.getElementById("payment-form");

// Show modal
function showModal() {
  modal.classList.remove("hidden");
  // Update pay button with total
  const total = calculateTotal();
  payBtn.textContent = `Pay $${total.toFixed(2)}`;
}

// Hide modal
function hideModal() {
  modal.classList.add("hidden");
  // Clear form
  paymentForm.reset();
}

// Handle payment form submission
paymentForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent page reload

  const name = nameInput.value.trim();
  const cardNumber = cardInput.value.trim();
  const cvv = cvvInput.value.trim();

  // Validation
  if (!name || !cardNumber || !cvv) {
    showNotification("❌ Please fill in all fields");
    return;
  }

  if (cardNumber.length !== 16) {
    showNotification("❌ Card number must be 16 digits");
    return;
  }

  if (cvv.length !== 3) {
    showNotification("❌ CVV must be 3 digits");
    return;
  }

  // Payment successful
  hideModal();
  showNotification("✅ Payment successful!");

  // Show order confirmation
  showOrderConfirmation(name);
});

// ===== ORDER CONFIRMATION =====
const orderConfirmation = document.getElementById("order-confirmation");

// Show order confirmation
function showOrderConfirmation(customerName) {
  // Hide header, menu, cart
  document.querySelector("header").classList.add("hidden");
  menuContainer.classList.add("hidden");
  cartSection.classList.add("hidden");

  // Show confirmation section
  orderConfirmation.classList.remove("hidden");

  // Calculate total
  const total = calculateTotal();

  // Generate order summary items HTML
  const summaryItemsHTML = cart
    .map(
      (item) => `
    <div class="summary-item">
      <img src="${item.image}" alt="${item.name}" class="summary-item-image">
      <div class="summary-item-details">
        <div class="summary-item-name">${item.name}</div>
        <div class="summary-item-qty">Quantity: ${item.quantity}</div>
      </div>
      <div class="summary-item-price">$${(item.price * item.quantity).toFixed(
        2
      )}</div>
    </div>
  `
    )
    .join("");

  // Build confirmation html
  orderConfirmation.innerHTML = `
    <div class="confirmation-message">
      <h2>Thank you ${customerName}, your order is on its way!</h2>
      <p>Follow this <span class="tracking-link">LINK</span> for tracking</p>
    </div>
    
    <div class="order-summary-box">
      <h3>Order summary</h3>
      ${summaryItemsHTML}
      <div class="summary-total">
        <span class="summary-total-label">Total price:</span>
        <span class="summary-total-price">$${total.toFixed(2)}</span>
      </div>
    </div>
    
    <button class="new-order-btn" id="new-order-btn">
      Start new order
    </button>
  `;

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Reset app for new order
function resetApp() {
  // Clear cart
  cart = [];

  // Hide confirmation
  orderConfirmation.classList.add("hidden");

  // Show header, menu
  document.querySelector("header").classList.remove("hidden");
  menuContainer.classList.remove("hidden");

  // Re-render menu and cart
  renderMenu();
  renderCart();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });

  showNotification("Ready for a new order!");
}

// ===== INITIALIZE APP =====
function initialize() {
  renderMenu();
  renderCart(); // Initially empty
}

// Start the app
initialize();
