require('dotenv').config();
const express = require('express');
const app = express();
const connectDB = require('./config/dbConnection');
const mongoose = require('mongoose');
const path = require('path');
const {User, Exercise} = require('./models/index')

//connec to the database
connectDB();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
})


const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', () => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`)
    })
    console.log("MongoDB database connection established successfully");
})
