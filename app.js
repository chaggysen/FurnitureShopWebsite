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
}

// The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed,
// without waiting for stylesheets, images and subframes to finish loading.
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

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
    .then(() => {});
});
