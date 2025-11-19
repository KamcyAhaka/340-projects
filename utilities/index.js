const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()

  let list = "<ul class='navigation-menu'>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildDetailsView = function(vehicle) {
  if (!vehicle) {
    return '<p class="notice">Sorry, vehicle details could not be found.</p>';
  }

  let detailView = '<div class="vehicle-detail">';
  
  // Vehicle image section
  detailView += '<div class="vehicle-image-section">';
  detailView += '<img src="' + vehicle.inv_image + '" alt="' + vehicle.inv_year + ' ' 
    + vehicle.inv_make + ' ' + vehicle.inv_model + '" class="vehicle-main-image" />';
  detailView += '</div>';
  
  // Vehicle info section
  detailView += '<div class="vehicle-info-section">';
  
  // Price and mileage highlight box
  detailView += '<div class="price-mileage-box">';
  detailView += '<div class="mileage-display">';
  detailView += '<span class="label">MILEAGE</span>';
  detailView += '<span class="value">' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</span>';
  detailView += '</div>';
  detailView += '<div class="price-display">';
  detailView += '<span class="price-label">Price</span>';
  detailView += '<span class="price-value">$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
  detailView += '</div>';
  detailView += '</div>';
  
  // Vehicle specifications
  detailView += '<div class="vehicle-specs">';
  detailView += '<div class="spec-item">';
  detailView += '<span class="spec-label">Mileage:</span> ';
  detailView += '<span class="spec-value">' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</span>';
  detailView += '</div>';
  
  detailView += '<div class="spec-item">';
  detailView += '<span class="spec-label">Color:</span> ';
  detailView += '<span class="spec-value">' + vehicle.inv_color + '</span>';
  detailView += '</div>';
  
  detailView += '<div class="spec-item">';
  detailView += '<span class="spec-label">Classification:</span> ';
  detailView += '<span class="spec-value">' + vehicle.classification_name + '</span>';
  detailView += '</div>';
  detailView += '</div>';
  
  // Vehicle description
  detailView += '<div class="vehicle-description">';
  detailView += '<h3>Description</h3>';
  detailView += '<p>' + vehicle.inv_description + '</p>';
  detailView += '</div>';
  
  detailView += '</div>'; // Close vehicle-info-section
  detailView += '</div>'; // Close vehicle-detail
  
  return detailView;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// Intentional Error Trigger - for testing error handling
Util.triggerError =  async (req, res, next) => {
  const err = new Error('Intentional 500 error for testing purposes');
  err.status = 500;
  next(err);
}


module.exports = Util
