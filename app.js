import { menuArray } from "./menu.js";

const menuContainer = document.getElementById("menu-container");

// ===== RENDER MENU =====
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

// ===== INITIALIZE APP =====
function initialize() {
  renderMenu();
}

// Start the app
initialize();
