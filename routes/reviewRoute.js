const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/review-controllers")
const utilities = require("../utilities")
const reviewValidate = require('../utilities/review-validation')

// Route to add a new review
router.post("/add",
    reviewValidate.reviewRules(),
    reviewValidate.checkReviewData,
    utilities.handleErrors(reviewController.addReview)
)

// Route to show the edit review form
router.get("/edit/:review_id",
    utilities.checkLogin,
    utilities.handleErrors(reviewController.editReview)
)

// Route to update a review
router.post("/update",
    utilities.checkLogin,
    reviewValidate.reviewRules(),
    reviewValidate.checkUpdateData,
    utilities.handleErrors(reviewController.updateReview)
)

// Route to show the delete review confirmation view
router.get("/delete/:review_id",
    utilities.checkLogin,
    utilities.handleErrors(reviewController.deleteReviewView)
)

// Route to delete a review
router.post("/delete",
    utilities.checkLogin,
    utilities.handleErrors(reviewController.deleteReview)
)

module.exports = router;
