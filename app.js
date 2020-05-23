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
// buttons
let buttonsDOM = [];

// Product class: getting the products:
// This will be responsible for getting the products localy first,
// (products.json) and then contentful(data management)
class Products {
  // The async keyword can be placed before a function. It means that:
  // a function always return a promise(an object that may produce a single value some time in the future)
  // Other values are wrapped in a resolved promise automatically

  // The keyword await makes JavaScript wait until that promise settles and returns its results.

  // In conclusion, the async/await keywords enable asynchronous promise-based behavior
  // to be written in a cleaner style, avoiding the need to explicitly consigure promise chain.
  async getProducts() {
    try {
      let result = await fetch("products.json");
      // This will return the data with the json method on the fetch.
      // This way, we will get the data in Json format. This Json format is the same format as Contentful.
      let data = await result.json();
      let products = data.items;

      // We got the json file but the structure is complicated to work with.
      // The following lines of code will destructure the data.
      // The map method creates a new array populated with the results of
      // calling a provided function on every element in the calling array.
      products = products.map((item) => {
        // The title and price are in the fields property, id in the sys property.
        // For the image, we iterate through the properties to get the URL.
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        // Here we create the cleaner return object
        return { title, price, id, image };
      });
      // Finally, we return the cleaner object
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// UI class: display products
// This class will be responsible to get all the items we will get from the products,
// and then displaying them.
class UI {
  // This method will take an array of products as input
  displayProducts(products) {
    // Create an empty string variable
    let result = "";
    // The forEach() method executes a provided function once for each array element.
    // Here we are getting all the products and their attributes
    products.forEach((product) => {
      result += `
      <!-- Single product -->
      <!-- The article tag specifies independant, self-contained content -->
      <article class="product">
        <div class="img-container">
          <img
            src=${product.image}
            alt="product"
            class="product-img"
          />
          <button class="bag-btn" data-id=${product.id}>
            <i class="fa fa-shopping-cart"></i>
            add to bag
          </button>
        </div>
        <h3>${product.title}</h3>
        <h4>$${product.price}</h4>
      </article>
      <!-- end of single product -->
      `;
    });
    // productsDOM variable is the DOM of product-center div. Here we set that to the result.
    productsDOM.innerHTML = result;
  }

  // Get all the bag buttons and turn them into an array.
  // It returns a node list by default
  // The method iterate through all buttons and retrive their ids.
  // We find the items that are already inCart by using find method on the cart array.
  // If the item is already in cart, we change the innnerHTML of the button to "In cart" and we disable the button.
  // If the add to bag button is clicked, we change the innerText to "In cart" and we disable the button.
  // We then get each product from products and add product to the cart and save cart in local storage.
  // After, we set the cart values and display the item in the cart.
  // Finally, each time we add an item to the cart, it shows the cart.
  getBagButtons() {
    // The spread operator(...) with objects is used to make a copy of an existing object or to make new object with more properties
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      // The find() method returns the value of the first element in the provided array that satisfies the provided testing function.
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerHTML = "In cart";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        // The target property of the event interface is a reference to the object onto which the event was dispached.
        event.target.innerText = "In cart";
        event.target.disabled = true;
        // get product from products. The id is already defined with dataset attribute.
        // Here we are declaring an object. We are creating an array of all the properties that Storage.getProducts(id) is returning
        // and we all another amount property with 1 as default.
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        // add product to the cart array.
        // Here, we get all the items we had in the cart array currently and add a new cartItem
        cart = [...cart, cartItem];
        // save cart in local storage because we still want the same cart when I refresh.
        Storage.saveCart(cart);
        // set cart values
        this.setCartValues(cart);
        // display cart items
        this.addCartItem(cartItem);
        // show the cart
        this.showCart();
      });
    });
  }

  // This method will update both the total price and the total amount of each item in the cart array.
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    // Here we update the values in the ineerText.
    // The parseFloat function parses a string and returns a floating point number
    // toFixed (we want 2 decimals)
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }

  // This method will add the item in the dom.
  // It creates a new div and add it to the cart-item class in HTML.
  // The item.id allows us to dynamically change the amount of a specific item
  addCartItem(item) {
    // Here we create the item to be added with a div
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <img src=${item.image} alt="product" />
            <div>
              <h4>${item.title}</h4>
              <h5>${item.price}$</h5>
              <span class="remove-item" data-id =${item.id}>remove</span>
            </div>
            <div>
              <i class="fa fa-chevron-up" data-id =${item.id}></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fa fa-chevron-down" data-id =${item.id}></i>
            </div>
    `;
    // Here we appendChild the newly created div to the cartContent variable declared earlier.
    // The appendChild method appends a node as the last child of a node
    cartContent.appendChild(div);
  }

  // Change css class to show the cart
  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }

  // This class setup the application.
  // Upon loading, we first get the cart item from the local storage: it may or may not exist.
  // When we got the cart, we set the cart values that are going to be in DOM.
  // After that we display all the items in the cart.
  // We also add an event Listener to the cart button to show the cart and access the closing button of the cart.
  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    // dont add () after this.function (idk why)
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }

  // This method iterate through an cart array and display the items in the cart
  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }

  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
}

// Local storage class:
// This class will deal with local storage
class Storage {
  // This static methods allow us to use this saveProduct method without the need to instantiate that class
  static saveProduct(products) {
    // The localStorage property allow to save key/value pairs in a web browser
    // The JSON.stringify() method converts a JS object or value to a JSON string
    localStorage.setItem("products", JSON.stringify(products));
  }

  // get products from local storage. It takes an id as argument.
  // It is through local storage because we stored the products in the local storage when DOMContentLoadd
  static getProduct(id) {
    // We need to parse since we stored the products as string. This will simply return the array from the local storage
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }

  // This method will allow us to save the cart array in the local storage.
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // This method check is cart item exist in the local storage.
  // If it exists, we parse the cart and return this array, else we return an empty array
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

// The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed,
// without waiting for stylesheets, images and subframes to finish loading.
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  // Setup application
  ui.setupAPP();

  // get all products
  // The then() method returns a Promise
  // Here we call displayProducts function from UI class
  // After that, we call the static saveProducts method to save the products in the local storage
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProduct(products);
    })
    .then(() => {
      ui.getBagButtons();
    });
});
