const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*  **********************************
*  Classification Data Validation Rules
* ********************************* */
validate.addClassificationRules = () => {
  return [
    // classification_name is required and must be alphanumeric with no spaces or special characters
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification name.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters.")
      .custom(async (classification_name) => {
        const classificationExists = await invModel.checkExistingClassification(classification_name)
        if (classificationExists){
          throw new Error("Classification exists. Please enter a different classification")
        }
      })
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkAddClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
*  Inventory Data Validation Rules
* ********************************* */
validate.addInventoryRules = () => {
  return [
    // inv_make is required and must be a string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle make."),

    // inv_model is required and must be a string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle model."),

    // inv_year is required and must be a 4-digit year
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 1900, max: 2100 })
      .withMessage("Please provide a valid year between 1900 and 2100.")
      .isLength({ min: 4, max: 4 })
      .withMessage("Year must be a 4-digit number."),

    // inv_description is required
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle description."),

    // inv_image is required and must be a valid path
    body("inv_image")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide an image path."),

    // inv_thumbnail is required and must be a valid path
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail path."),

    // inv_price is required and must be a valid number
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isDecimal({ decimal_digits: '0,2' })
      .withMessage("Please provide a valid price.")
      .custom((value) => {
        if (parseFloat(value) < 0) {
          throw new Error("Price must be a positive number.");
        }
        return true;
      }),

    // inv_miles is required and must be a valid integer
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Please provide valid mileage (must be a positive integer)."),

    // inv_color is required
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle color."),

    // classification_id is required and must be a valid integer
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isInt({ min: 1 })
      .withMessage("Please select a valid classification.")
  ]
}

/* ******************************
 * Check inventory data and return errors or continue
 * ***************************** */
validate.checkAddInventoryData = async (req, res, next) => {
  const { 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id 
  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("./inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
    return
  }
  next()
}

/* ******************************
 * Check inventory data and return errors or continue
 * ***************************** */
validate.checkUpdateInventoryData = async (req, res, next) => {
  const { 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    inv_id,
    classification_id 
  } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.render("./inventory/edit-inventory", {
      errors,
      title: "Edit Inventory",
      nav,
      classificationList,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      inv_id,
      classification_id
    })
    return
  }
  next()
}

module.exports = validate
