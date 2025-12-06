const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
 *  Review Data Validation Rules
 * ********************************* */
validate.reviewRules = () => {
  return [
    // review_text is required and must be string
    body("review_text")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Review text is required."),
  ]
}

/* ******************************
 * Check data and return errors or continue
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryByInventoryId(inv_id)
    const reviews = await reviewModel.getReviewsByInventoryId(inv_id)
    const item = utilities.buildDetailPage(itemData)
    const reviewDisplay = utilities.buildReviewList(reviews)
    res.render("./inventory/details", {
      title: itemData.inv_make + " " + itemData.inv_model,
      nav,
      item,
      reviews: reviewDisplay,
      errors,
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue for update
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { review_id, review_text } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const review = await reviewModel.getReviewById(review_id)
      const itemName = `${review.inv_make} ${review.inv_model}`
      res.render("./inventory/edit-review", {
        title: "Edit " + itemName + " Review",
        nav,
        review,
        errors,
      })
      return
    }
    next()
  }

module.exports = validate
