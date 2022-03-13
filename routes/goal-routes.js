const express = require("express");

const {
  getAllGoalsByUserID,
  getGoalByID,
  createGoal,
  updateGoal,
  deleteGoal,
} = require("../controllers/goal-controllers");

const router = express.Router();

router.get("/", getAllGoalsByUserID);

router.get("/:goalID", getGoalByID);

router.post("/", createGoal);

router.put("/:goalID", updateGoal);

router.delete("/:goalID", deleteGoal);

module.exports = router;
