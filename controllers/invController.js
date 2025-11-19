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

module.exports = invCont
