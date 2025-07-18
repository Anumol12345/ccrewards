const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path');
const connectDB = require('./utils/db');
const cardRoutes = require('./routes/card');
const login = require("./routes/login");
const app = express();
app.use(express.json());

app.use(cors({
  origin: 'https://CCRewardsTech.netlify.app', 
}));

const PORT = process.env.PORT || 3000;

 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended: true}));


app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/cards', cardRoutes);
app.use('/api/login' , login);
  

connectDB().then(() => {
 app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

});

