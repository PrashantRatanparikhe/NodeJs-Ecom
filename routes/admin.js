const express = require("express");
const controller = require("../controllers/admin");
const router = express.Router();

router.get("/add-product", controller.addProduct);
router.get("/products", controller.getProduct); 
router.post("/add-product", controller.storeProduct);
router.get("/edit-product/:prodId", controller.editProduct);
router.post("/edit-product/", controller.updateProduct);
router.post("/delete-product", controller.deleteProduct);

module.exports = router;
