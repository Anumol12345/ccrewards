const express = require('express');
const bodyParser = require("body-parser");
const importDB = require('./import-db');
const cors = require('cors');
const path = require('path');
const connectDB = require('./utils/db');
const cardRoutes = require('./routes/card');
 const login = require("./routes/login");
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;
 app.use(bodyParser.json());
 app.use(bodyParser.urlencoded({extended: true}));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/api/cards', cardRoutes);

  app.use('/api/login' , login);
  

// Connect DB and start server
connectDB().then(() => {
 // importDB();
 app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
  // app.listen(3000, () => {
  //   console.log('Server is running on http://localhost:3000');
  // });
});

// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });