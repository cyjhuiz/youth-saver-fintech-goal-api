const express = require("express");

const dotenv = require("dotenv");
dotenv.config();

const { sequelize } = require("./util/database");
const { errorHandler } = require("./middleware/error-handler");

const goalRoutes = require("./routes/goal-routes");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/goal", goalRoutes);

app.use(errorHandler);

sequelize
  .sync()
  .then((result) => {
    console.log(result);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
