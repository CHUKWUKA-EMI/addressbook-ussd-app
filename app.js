const express = require("express");
const cors = require("cors");
const ussdRoute = require("./routes/ussd");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/", ussdRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`running on localhost:${PORT}`));
