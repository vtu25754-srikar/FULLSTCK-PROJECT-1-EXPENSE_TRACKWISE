const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const expenseRoutes = require("./routes/expenses");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

app.listen(3000, () => {
console.log("Server running on port 3000");
});