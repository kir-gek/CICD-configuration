require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const model = require("./models/models");
const cors = require(`cors`);
const router = require("./routes/index");
const path = require('path')

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.get('api/test', (req, res)=> {res.send('Vse kruto')})
app.use(cors(corsOptions));
app.use(express.static(path.resolve(__dirname, 'static')))

app.use("/api", router);


const start = async () => {
  try {
    await sequelize.authenticate();

    app.listen(PORT, () => {
      console.log(`Backend is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error);
    process.exit(1);
  }
};

start();
