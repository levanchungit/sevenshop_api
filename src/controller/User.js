const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../utils/multer");
const mongoose = require("mongoose");

const userSchema = require("../models/user");

const register = async function (req, res, next) {
  try {
    const {
      username,
      password,
      fullname,
      phone,
      image,
      gender,
      birthday,
      status,
      role,
    } = req.body;
    const findUser = await userSchema.find({ username });
    if (findUser.length > 0) {
      return res.status(500).json({
        error: true,
        statusCode: 500,
        message: "User already registered",
      });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const _id = new mongoose.Types.ObjectId();
      const user = new userSchema({
        _id,
        username,
        password: hashedPassword,
        fullname,
        phone,
        image,
        gender,
        birthday,
        status,
        role,
      });
      const savedUser = await user.save();
      if (savedUser) {
        return res
          .status(200)
          .json({
            error: false,
            statusCode: 200,
            data: { username, fullname, phone },
          });
      } else {
        return res.status(500).json({
          error: true,
          statusCode: 500,
          message: "User already registereddd",
        });
      }
    }
  } catch (e) {
    return res.status(500).json({
      error: true,
      statusCode: 500,
      message: e.message,
    });
  }
};

// const login = async function (req, res, next) {
//   try {
//     const user = await userModel.findOne({ username: req.body.username });
//     if (user != null) {
//       if (await bcrypt.compare(req.body.password, user.password)) {
//         const token = jwt.sign(
//           { username: user.username, _id: user._id },
//           process.env.JWT_SECRET,
//           { expiresIn: "900s" }
//         );
//         res.json({
//           error: false,
//           responeTime: new Date(),
//           statusCode: 200,
//           accessToken: token,
//           data: user,
//         });
//       } else {
//         res.status(422).json({
//           error: true,
//           responeTime: new Date(),
//           statusCode: 422,
//           message: "Invalid password",
//         });
//       }
//     } else {
//       res.status(422).json({
//         error: true,
//         responeTime: new Date(),
//         statusCode: 422,
//         message: "Invalid username",
//       });
//     }
//   } catch (error) {
//     res.json({
//       error: true,
//       responeTime: new Date(),
//       statusCode: 500,
//       message: error.message,
//     });
//   }
// };

module.exports = {
  register,
};
