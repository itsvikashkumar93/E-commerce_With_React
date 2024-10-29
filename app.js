const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/mongodb");
const indexRoutes = require("./routes/index.routes");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRoutes);
app.use("/user", userRoutes);
app.use("/product", productRoutes);

app.listen(process.env.PORT || 3000);
