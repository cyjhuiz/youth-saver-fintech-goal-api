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
    const error = new HttpError(
      "Something went wrong, could not find goal",
      500
    );
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

const createGoal = async (req, res, next) => {
  const { userID, goalName, goalPrice, productImgUrl, goalStatus } = req.body;

  let goal;
  try {
    goal = await Goal.create({
      userID,
      goalName,
      goalPrice,
      productImgUrl,
      goalStatus,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find goal",
      500
    );
    return next(error);
  }

  return res.status(201).json({
    code: 201,
    goalID: goal.goalID,
  });
};

const updateGoal = async (req, res, next) => {
  let goalID = req.params.goalID;

  let goal;
  try {
    goal = await Goal.findOne({
      where: {
        goalID: goalID,
      },
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update goal",
      500
    );
    return next(error);
  }

  if (!goal) {
    const error = new HttpError("Goal being updated does not exist", 404);
    return next(error);
  }

  for (key in req.body) {
    if (goal.get(key)) {
      goal[key] = req.body[key];
    }
  }

  try {
    await goal.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update goal",
      500
    );
    return next(error);
  }

  return res.status(200).json({
    goalID: goalID,
  });
};

const deleteGoal = async (req, res, next) => {};

exports.getGoalsByUserID = getGoalsByUserID;
exports.getGoalByID = getGoalByID;
exports.createGoal = createGoal;
exports.updateGoal = updateGoal;
exports.deleteGoal = deleteGoal;
