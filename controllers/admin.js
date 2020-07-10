const Product = require("../models/product");

/**
 * Show Add Product Screen
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.addProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add-Product",
    editing: false,
  });
};

/**
 * Store product in DB
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.storeProduct = (req, res, next) => {
  const { title, imageURL, description, price } = req.body;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageURL: imageURL,
    userId: req.user,
  });

  product
    .save()
    .then(() => {
      console.log("Product Added Successfully!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

/**
 * Show Edit product Screen
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.editProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const pId = req.params.prodId;
  Product.findById(pId).then((product) => {
    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit-Product",
      editing: editMode,
      product: product,
    });
  });
};

/**
 * Store updated product details
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.updateProduct = (req, res, next) => {
  const { productId, title, imageURL, description, price } = req.body;
  Product.findById(productId)
    .then((product) => {
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageURL = imageURL;

      return product.save();
    })
    .then((result) => {
      console.log("Product Updated Successfully!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

/**
 * Get a product by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getProduct = (req, res, next) => {
  Product.find()
    .then((products) => {
      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
      });
    });
};

/**
 * Delete product by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteProduct = (req, res, next) => {
  Product.findByIdAndDelete(req.body.productId).then(() => {
    console.log("Product Deleted Successfully!");
    res.redirect("/admin/products");
  });
};
