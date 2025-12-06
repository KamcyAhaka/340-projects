const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

const reviewController = {}

/* ***************************
 *  Add a new review
 * ************************** */
reviewController.addReview = async function (req, res, next) {
  const { review_text, inv_id, account_id } = req.body

  const addResult = await reviewModel.addReview(
    review_text,
    inv_id,
    account_id
  )

  if (addResult) {
    req.flash("notice", `Your review has been added.`)
    res.redirect(`/inv/detail/${inv_id}`)
  } else {
    req.flash("notice", "Sorry, there was an error adding your review.")
    res.redirect(`/inv/detail/${inv_id}`)
  }
}

/* ***************************
 *  Build the edit review view
 * ************************** */
reviewController.editReview = async function (req, res, next) {
  const review_id = parseInt(req.params.review_id)
  let nav = await utilities.getNav()
  const review = await reviewModel.getReviewById(review_id)
  const itemName = `${review.inv_make} ${review.inv_model}`
  res.render("./inventory/edit-review", {
    title: "Edit " + itemName + " Review",
    nav,
    review,
    errors: null,
  })
}

/* ***************************
 *  Update a review
 * ************************** */
reviewController.updateReview = async function (req, res, next) {
  const { review_id, review_text } = req.body

  const updateResult = await reviewModel.updateReview(
    review_id,
    review_text
  )

  if (updateResult) {
    req.flash("notice", `Your review has been updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, there was an error updating your review.")
    res.redirect(`/inv/review/${review_id}/edit`)
  }
}

/* ***************************
 *  Build the delete review confirmation view
 * ************************** */
reviewController.deleteReviewView = async function (req, res, next) {
  const review_id = parseInt(req.params.review_id)
  let nav = await utilities.getNav()
  const review = await reviewModel.getReviewById(review_id)
  const itemName = `${review.inv_make} ${review.inv_model}`
  res.render("./inventory/delete-review", {
    title: "Delete " + itemName + " Review",
    nav,
    review,
    errors: null,
  })
}

/* ***************************
 *  Delete a review
 * ************************** */
reviewController.deleteReview = async function (req, res, next) {
  const { review_id } = req.body

  const deleteResult = await reviewModel.deleteReview(review_id)

  if (deleteResult) {
    req.flash("notice", `Your review has been deleted.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, there was an error deleting your review.")
    res.redirect(`/inv/review/${review_id}/delete`)
  }
}

module.exports = reviewController
