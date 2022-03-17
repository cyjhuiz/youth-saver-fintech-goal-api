const axios = require("axios");
const Goal = require("../models/goal");

const HttpError = require("../models/http-error");

const { CARD_API_ENDPOINT } = process.env;

const getAllGoalsByUserID = async (req, res, next) => {
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
    goal = await Goal.findByPk(goalID);
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
      "Something went wrong, could not create goal",
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
    goal = await Goal.findByPk(goalID);
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
      const value = req.body[key];
      goal.setDataValue(key, value);
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

const deleteGoal = async (req, res, next) => {
  let goalID = req.params.goalID;

  let goal;
  try {
    goal = await Goal.findByPk(goalID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete goal",
      500
    );
    return next(error);
  }

  if (!goal) {
    const error = new HttpError("Goal being deleted does not exist", 404);
    return next(error);
  }

  try {
    await goal.destroy();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete goal",
      500
    );
    return next(error);
  }

  return res.status(200).json({
    goalID: goalID,
  });
};

const checkoutGoal = async (req, res, next) => {
  let goalID = req.params.goalID;
  let goal;
  try {
    goal = await Goal.findByPk(goalID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not checkout goal",
      500
    );
    return next(error);
  }

  if (!goal) {
    const error = new HttpError("Goal for checkout does not exist", 404);
    return next(error);
  }

  // insert steps to check for bankBalance via tBankAccountID, if enough, continue checkout
  // ========================================================
  let customerYouthSaverCard;
  try {
    let response = await axios.get(
      `${CARD_API_ENDPOINT}/card/userCard?userID=${goal.userID}`
    );

    if (response.status != 200) {
      const error = new HttpError(
        "Something went wrong, could not retrieve customer card during goal checkout",
        500
      );
      return next(error);
    }

    const customerUserCards = response.data.userCards;
    for (card of customerUserCards) {
      if (card.cardName == "YouthSaver") {
        customerYouthSaverCard = card;
      }
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update goal status during checkout",
      500
    );
    return next(error);
  }

  // update and activate customerYouthSaverCard with new credit limit based on goal price
  try {
    let response = await axios.put(
      `${CARD_API_ENDPOINT}/card/userCard/${customerYouthSaverCard.userCardID}`,
      {
        creditLimit: goal.getDataValue("goalPrice"),
        isActivated: true,
      }
    );

    if (response.status != 200) {
      const error = new HttpError(
        "Something went wrong, could not update card credit limit during goal checkout",
        500
      );
      return next(error);
    }

    goal.setDataValue("goalStatus", "Ready for redemption");
    await goal.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update goal status during checkout",
      500
    );
    return next(error);
  }

  return res.status(200).json({
    goalID: goalID,
  });
};

exports.getAllGoalsByUserID = getAllGoalsByUserID;
exports.getGoalByID = getGoalByID;
exports.createGoal = createGoal;
exports.updateGoal = updateGoal;
exports.deleteGoal = deleteGoal;
exports.checkoutGoal = checkoutGoal;
