// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const validate = require("../utilities/classification-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory by classification view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to build add classification view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to process add classification
router.post("/add-classification", 
  validate.addClassificationRules(),
  validate.checkAddClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to process add inventory
router.post("/add-inventory", 
  validate.addInventoryRules(),
  validate.checkAddInventoryData,
  utilities.handleErrors(invController.addInventory)
);

router.get(
  "/trigger-error", 
  utilities.triggerError,
  utilities.handleErrors((req, res) => {
    res.send("This shouldn't display");
  })
);


module.exports = router;
