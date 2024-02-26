/*const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

// connect to db
const connectDB = require('./database');

// setting config.env as .env file
dotenv.config({ path: 'config.env'});
const PORT = process.env.PORT || 8080

// connect to mongodb
connectDB();

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})
*/