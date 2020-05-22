// variables

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

// cart
let cart = [];

// Product class: getting the products:
// This will be responsible for getting the products localy first,
// (products.json) and then contentful(data management)
class Products {}

// UI class: display products
// This class will be responsible to get all the items we will get from the products,
// and then displaying them.
class UI {}

// Local storage class:
// This class will deal with local storage
class Storage {}

// The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed,
// without waiting for stylesheets, images and subframes to finish loading.
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
});
