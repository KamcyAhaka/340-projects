const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  
  // Check if inv_id exists
  if (!inv_id) {
    return res.status(400).render("errors/error", {
      title: "Error",
      message: "Invalid vehicle ID",
      nav: await utilities.getNav()
    });
  }
  
  const data = await invModel.getDetailsByInventoryId(inv_id)
  
  // Check if data exists and has at least one record
  if (!data || data.length === 0) {
    return res.status(404).render("errors/error", {
      title: "Vehicle Not Found",
      message: "Sorry, the vehicle you're looking for could not be found.",
      nav: await utilities.getNav()
    });
  }
  
  // Since data is an array with one object, pass data[0] to buildDetailsView
  const vehicle = data[0]
  const view = await utilities.buildDetailsView(vehicle)
  let nav = await utilities.getNav()
  const pageTitle = `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`
  
  res.render("./inventory/details", {
    title: pageTitle,
    nav,
    view,
  })
}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {

  let nav = await utilities.getNav()
  res.render("./inventory/index", {
    title: "Inventory Management",
    nav,
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {

  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {

  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory Item",
    nav,
    classificationList,
    errors: null,
  })
}

/* ***************************
 *  Process classification addition
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body

  const addResult = await invModel.addClassification(classification_name)

  if (addResult) {
    // Regenerate nav to include the new classification
    let nav = await utilities.getNav()
    
    req.flash(
      "notice",
      `Congratulations, you added the ${classification_name} classification.`
    )
    // Render the management view instead of the add-classification view
    return res.status(201).render("./inventory/index", {
      title: "Inventory Management",
      nav,
    })
  }
  else {
    let nav = await utilities.getNav()
    
    req.flash(
      "notice",
      `Sorry, the ${classification_name} classification addition failed. Please try again.`
    )
    return res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Process inventory addition
 * ************************** */
invCont.addInventory = async function (req, res, next) {
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

  const addResult = await invModel.addInventory(
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
  )

  if (addResult) {
    // Regenerate nav to include the new classification
    let nav = await utilities.getNav()
    
    req.flash(
      "notice",
      `Congratulations, you added the ${inv_make} ${inv_model} inventory.`
    )
    // Render the management view instead of the add-classification view
    return res.status(201).render("./inventory/index", {
      title: "Inventory Management",
      nav,
    })
  }
  else {
    let nav = await utilities.getNav()
    
    req.flash(
      "notice",
      `Sorry, the ${inv_make} ${inv_model} inventory addition failed. Please try again.`
    )
    return res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
    })
  }
}

module.exports = invCont
