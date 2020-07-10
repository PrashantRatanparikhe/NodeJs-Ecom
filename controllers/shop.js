const Product = require("../models/product");
const Order = require("../models/order");

/**
 * Get All products
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

/**
 * Get spacific product by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getProduct = (req, res, next) => {
  Product.findById(req.params.productId).then((product) => {
    res.render("shop/product-details", {
      product: product,
      pageTitle: product.title,
    });
  });
};

/**
 * Get Index page of shoping
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getIndex = (req, res, next) => {
  Product.find().then((products) => {
    res.render("shop/index", { prods: products, pageTitle: "Shop" });
  });
};

/**
 * Add product to cart
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.addToCart = (req, res, next) => {
  Product.findById(req.body.productId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    });
};

/**
 * Remove product from cart
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteToCart = (req, res, next) => {
  req.user
    .deleteItemFromCart(req.body.productId)
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.log(err);
    });
};

/**
 * Get all products from cart
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        pageTitle: "My Cart",
        products: products,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

/**
 * Make an order
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((x) => {
        return { quantity: x.quantity, product: { ...x.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products: products,
      });
      order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
    });
};

/**
 * Get all orders
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", { pageTitle: "My Orders", orders: orders });
    })
    .catch((err) => {
      console.log(err);
    });
};
