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
router.get("/", utilities.checkAuthorization, utilities.handleErrors(invController.buildManagementView));

// Route to build edit inventory view
router.get("/edit/:inventoryId", utilities.checkAuthorization, utilities.handleErrors(invController.buildEditInventoryView));

// Route to build edit inventory view
router.get("/delete/:inventoryId", utilities.checkAuthorization, utilities.handleErrors(invController.buildDeleteInventoryView));

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build add classification view
router.get("/add-classification", utilities.checkAuthorization, utilities.handleErrors(invController.buildAddClassification));

// Route to build add inventory view
router.get("/add-inventory", utilities.checkAuthorization, utilities.handleErrors(invController.buildAddInventory));

// Route to process add classification
router.post("/add-classification", 
  utilities.checkAuthorization,
  validate.addClassificationRules(),
  validate.checkAddClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to process add inventory
router.post("/add-inventory", 
  utilities.checkAuthorization,
  validate.addInventoryRules(),
  validate.checkAddInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Route to process update inventory
router.post("/update-inventory", 
  utilities.checkAuthorization,
  // validate.addInventoryRules(),
  validate.checkUpdateInventoryData,
  utilities.handleErrors(invController.updateInventory)
);

// Route to process delete inventory
router.post("/delete-inventory/", 
  // validate.addInventoryRules(),
  validate.checkUpdateInventoryData,
  utilities.handleErrors(invController.deleteInventory)
);

router.get(
  "/trigger-error", 
  utilities.triggerError,
  utilities.handleErrors((req, res) => {
    res.send("This shouldn't display");
  })
);


module.exports = router;
