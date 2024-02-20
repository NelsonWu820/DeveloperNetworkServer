const jwt = require("jsonwebtoken");
require('dotenv').config();

//checks if the token is valid
module.exports = function(req, res, next){
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        jwt.verify(token, process.env.jwtSecret, (error, decoded) => {
          if (error) {
            return res.status(401).json({ msg: 'Token is not valid' });
          } else {
            //sets the instance to the decoded token which then lets it access certain pages
            req.user = decoded.user;
            next();
          }
        });
      } catch (err) {
        console.error('something wrong with auth middleware');
        res.status(500).json({ msg: 'Server Error' });
    }
}