const pool = require("../database/")

/* ***************************
 *  Get all reviews for a specific inventory item
 * ************************** */
async function getReviewsByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      "SELECT r.review_id, r.review_text, r.review_date, a.account_firstname, a.account_lastname FROM public.review r JOIN public.account a ON r.account_id = a.account_id WHERE r.inv_id = $1 ORDER BY r.review_date DESC",
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("get reviews by inventoryid error " + error)
  }
}

/* ***************************
 *  Get all reviews written by a specific account
 * ************************** */
async function getReviewsByAccountId(account_id) {
  try {
    const data = await pool.query(
      "SELECT r.review_id, r.review_text, r.review_date, i.inv_make, i.inv_model FROM public.review r JOIN public.inventory i ON r.inv_id = i.inv_id WHERE r.account_id = $1 ORDER BY r.review_date DESC",
      [account_id]
    )
    return data.rows
  } catch (error) {
    console.error("get reviews by accountid error " + error)
  }
}

/* ***************************
 *  Get a specific review by its ID
 * ************************** */
async function getReviewById(review_id) {
  try {
    const data = await pool.query(
      "SELECT r.*, i.inv_make, i.inv_model FROM public.review r JOIN public.inventory i ON r.inv_id = i.inv_id WHERE r.review_id = $1",
      [review_id]
    )

    return data.rows[0]
  } catch (error) {
    console.error("get review by id error " + error)
  }
}

/* ***************************
 *  Add a new review
 * ************************** */
async function addReview(review_text, inv_id, account_id) {
  try {
    const sql = "INSERT INTO public.review (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
    return await pool.query(sql, [review_text, inv_id, account_id])
  } catch (error) {
    console.error("add review error " + error)
  }
}

/* ***************************
 *  Update a review
 * ************************** */
async function updateReview(review_id, review_text) {
  try {
    const sql = "UPDATE public.review SET review_text = $1 WHERE review_id = $2 RETURNING *"
    return await pool.query(sql, [review_text, review_id])
  } catch (error) {
    console.error("update review error " + error)
  }
}

/* ***************************
 *  Delete a review
 * ************************** */
async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM public.review WHERE review_id = $1"
    return await pool.query(sql, [review_id])
  } catch (error) {
    console.error("delete review error " + error)
  }
}

module.exports = {
  getReviewsByInventoryId,
  getReviewsByAccountId,
  getReviewById,
  addReview,
  updateReview,
  deleteReview,
}
