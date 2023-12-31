require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const notFoundMiddleware = require("./middlewares/not-found");
const errMiddleware = require("./middlewares/error");
const rateLimitMilddleware = require("./middlewares/rate-limit");
const authRoute = require("./routes/auth-route");
const adminRoute = require("./routes/admin-route");
const productRoute = require("./routes/product-route");
const authenticateMiddleware = require("./middlewares/authenticate");
const isAdminMiddleware = require("./middlewares/isAdminMiddleware");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(rateLimitMilddleware);
app.use(express.json());

app.use("/", productRoute);
app.use("/auth", authRoute);

app.use("/admin", authenticateMiddleware, isAdminMiddleware, adminRoute);

app.use(notFoundMiddleware);
app.use(errMiddleware);

const PORT = process.env.PORT || "5000";
app.listen(PORT, () => console.log(`sever running on port: ${PORT}`));
