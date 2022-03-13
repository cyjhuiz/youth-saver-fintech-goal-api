const Goal = require("../models/goal");

const HttpError = require("../models/http-error");

const getGoalsByUserID = async (req, res, next) => {
  let userID = req.query.userID;
  let goals;
  try {
    goals = await Goal.findAll({
      where: {
        userID: userID,
      },
      raw: true,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find goals.",
      500
    );
    return next(error);
  }

  return res.status(200).json({
    code: 200,
    goals: goals,
  });
};

const getGoalByID = async (req, res, next) => {
  let goalID = req.params.goalID;
  let goal;
  try {
    goal = await Goal.findOne({ where: { goalID: goalID } });
  } catch (err) {
    const error = new HttpError("Could not find goal using id provided", 404);
    return next(error);
  }

  if (!goal) {
    const error = new HttpError("Could not find goal using id provided", 404);
    return next(error);
  }

  return res.status(200).json({
    code: 200,
    goal: goal,
  });
};

const createGoal = async (req, res, next) => {};

const updateGoal = async (req, res, next) => {};

const deleteGoal = async (req, res, next) => {};

exports.getGoalsByUserID = getGoalsByUserID;
exports.getGoalByID = getGoalByID;
exports.createGoal = createGoal;
exports.updateGoal = updateGoal;
exports.deleteGoal = deleteGoal;
