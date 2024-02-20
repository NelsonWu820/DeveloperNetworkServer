require('dotenv').config();
const express = require("express");
const connectDB = require("./config/db")
const path = require('path');
const cors = require('cors');

const app = express();

//code for vercel deployment
app.use(cors({
  origin:"https://developer-network-frontend.vercel.app", 
  methods: ["POST", "GET", "DELETE", "PUT"],
  credentials:true
}));

//connects to mongo
connectDB();

//initaizes middleware
app.use(express.json());

//Define routes
app.use("/users", require("./routes/api/users"));
app.use("/auth", require("./routes/api/auth"));
app.use("/profile", require("./routes/api/profile"));
app.use("/posts", require("./routes/api/posts"));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
  
    //gets the index.html from client/build
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

//defualt port is 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
