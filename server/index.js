const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const paymentRoutes = require("./routes/payment")

const app = express();

dotenv.config();

app.use(express.json());
app.use(cors());

// routes
app.use("/api/payment",paymentRoutes);

const port = process.env.PORT || 8000;
app.listen(port,() => console.log(`Running no port ${port}......`));

