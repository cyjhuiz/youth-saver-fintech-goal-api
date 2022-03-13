const express = require("express");

const {
  getGoalsByUserID,
  getGoalByID,
  createGoal,
  updateGoal,
  deleteGoal,
} = require("../controllers/goal-controllers");

const router = express.Router();

router.get("/", getGoalsByUserID);

router.get("/", getGoalByID);

router.post("/", createGoal);

router.put("/:goalId", updateGoal);

router.delete("/:goalId", deleteGoal);

module.exports = router;
