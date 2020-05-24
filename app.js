const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "v9olvwo3ix6o",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: "NfiKbAMtoTIikae2oxjsgiLeNZak0_kqqc4zItEO6zA",
});

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
    // Here we want to get all the products of content model "comfyHouseProducts" by using Contentful content delivery API
    try {
      let contentful = await client.getEntries({
        content_type: "comfyHouseProducts",
      });

      // let result = await fetch("products.json");
      // // This will return the data with the json method on the fetch.
      // // This way, we will get the data in Json format. This Json format is the same format as Contentful.
      // let data = await result.json();

      //If we want to extract data from local storage we use this line of code
      // let products = data.items;

      // Here we used the products from Contentful CMS
      let products = contentful.items;

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

  // This method will setup all cart logic
  cartLogic() {
    // This will point to the UI class. We need to access things within this class so we need this format.
    // If not, we can format like this.showCart or this.hideCart earlier
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });

    // cart functionality
    cartContent.addEventListener("click", (event) => {
      // Here we add event listener to the whole cart content class. We distinguish each button from target.
      // Here we check if the target class contains remove-item
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        // This will remove the item from the cart. But we want to remove it from the DOM.
        // To acheive this, since we want to remove the whole cart-item div,
        // we need to access the parent of the parent of remove-item class
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);

        // Here we check if the target class contains fa-chevron-up
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        // Find the item of the specified id and assign it to tempItem. Increment by 1
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        // We need to update the local storage because else if we refresh it will come back to the old values.
        // When we updated the value, we updated the cart but we didn't save it
        // We also need to update the cart's total
        // Finally, we need to update the actual value of amount displayed betwwen the up and down arrow key
        Storage.saveCart(cart);
        this.setCartValues(cart);
        // The nextElementSibling property returns the element immediately following the specified element, in the same tree level
        addAmount.nextElementSibling.innerText = tempItem.amount;

        // Here we check if the target class contains fa-chevron-down
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        // Here, if the amount is 0 or less, there is no point of keeping it in the cart
        // So remove item
        // If it is bigger than 0, update the cart and the total
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          // The Node.removeChild() method removes a child node from the DOM and returns the removed node
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
        Storage.saveCart(cart);
        this.setCartValues(cart);
      }
    });
  }

  // This method will clear the cart.
  // We first get the cart array in the local storage and assign all items to cartItems.
  // We then loop through cartItems and call removeItem method for each item using its id.
  // Now we have to remove the content of the item from the cart-centent div
  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));
    console.log(cartContent.children);
    //While there are still children in cartContent, we keep remove the first child
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }

  // This method will remove a specific item with of a specific id from the cart and enable the button add to cart
  // We wrote a sperate method for this feature because this method will be used in clear cart and in remove
  removeItem(id) {
    // The filter method creates a new array with all elements that pass the test implemented by the provided function
    cart = cart.filter((item) => item.id !== id);
    // Change cart values (price and amount)
    this.setCartValues(cart);
    // Save the new cart to the local storage
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    // Since we removed the item from the shopping cart, the add to bag button should be enabled and changed to add to cart
    button.disabled = false;
    button.innerHTML = `<i class="fa fa-shopping-cart"></i>add to bag`;
  }

  getSingleButton(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
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
      ui.cartLogic();
    });
});
