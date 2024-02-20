const express = require("express");
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { check, validationResult} = require("express-validator");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
require('dotenv').config();

// @route    POST api/user
// @desc     creates user/ register
// @access   Private
router.post("/", [
    check("name", "Name is required").notEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password","Please enter a password with 6 or more characters").isLength({ min: 6 }),
],
async (req, res) => {
    //err check
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      //checks if user exists
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      //takes emails avatar
      const avatar = 
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        })

      user = new User({
        name,
        email,
        avatar,
        password
      });

      //gens salt/hash for password
      const salt = await bcrypt.genSalt(10);

      //hashes password
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //jwt make and store
      const payload = {
        user: {
            id: user.id
        }
      };
      jwt.sign(payload,
        process.env.jwtSecret,
        {expiresIn: '5 days'},
        (err, token) => {
            if (err) throw err;
            res.json({ token });
          } 
       );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    
    });

module.exports = router;