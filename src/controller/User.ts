import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Log from "../library/Log";
import User, { UserType } from "../models/user";
const nodemailer = require("nodemailer");
import bcrypt from "bcrypt";
import { tokenGen } from "../utils/token";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username }: UserType = req.body;
    if (username == undefined || username.toString().trim() == "") {
      res
        .status(500)
        .json({ error: true, message: "Username không được bỏ trống" });
    }
    const findUserByUsername = await User.find({ username });
    if (findUserByUsername.length > 0)
      return res
        .status(500)
        .json({ error: true, message: "Username đã tồn tại" });

    const _id = new mongoose.Types.ObjectId();
    const _user = new User({
      _id,
      username,
    });
    const user = await _user.save();
    if (user) {
      Log.info("CREATED USER");

      const random = Math.floor(Math.random() * 90000) + 10000;
      await User.findOneAndUpdate(
        { _id },
        {
          $set: {
            otp: random.toString(),
            otp_createdAt: Date.now().toString(),
            expiresIn: new Date().getTime() + 300 * 1000,
          },
        },
        { new: true }
      );

      //Tiến hành gửi mail, nếu có gì đó bạn có thể xử lý trước khi gửi mail
      var transporter = nodemailer.createTransport({
        // config mail server
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.USER_APP_MAIL, //Tài khoản gmail vừa tạo
          pass: process.env.PASS_APP_MAIL, //Mật khẩu tài khoản gmail vừa tạo
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false,
        },
      });
      var content = `
      <div
        style="display:flex;width: 500px;background-color:rgb(224,224,224);align-items: center;justify-content: center;">
        <div style="align-items: center;justify-content: center ;width: 50%; background-color: white; margin: 50px; padding: 50px">
            <div>
                <img style="width: 100%; min-width: 250px;"
                    src="https://res.cloudinary.com/dq7xnkfde/image/upload/v1673451729/logo-01_xgl0wr.png"></img>
            </div>
            <h2 style="text-align: center; font-weight: bold;"> Here is your One Time Password</h2>
            <p style="text-align: center; color:rgb(132, 132, 132);font-size: 18px;">to validate your email address</p>
            <div style="display:flex;padding:10px;background-color:white;border-radius:4px;align-items: center;justify-content: center;">
                <h1 style="text-align: center; font-size: 50px; letter-spacing: 10dp;letter-spacing: 5px;">${random.toString()}</h1>
            </div>
            <p style="text-align: center; color:rgb(255, 0, 0);font-size: 16px;">Valid for 5 minutes only</p>
        </div>
    </div>
  `;
      var mainOptions = {
        // thiết lập đối tượng, nội dung gửi mail
        from: process.env.USER_APP_MAIL,
        to: username,
        subject: "OTP verification",
        text: "", //Thường thi mình không dùng cái này thay vào đó mình sử dụng html để dễ edit hơn
        html: content, //Nội dung html mình đã tạo trên kia :))
      };
      transporter.sendMail(mainOptions, (err: any, info: any) => {
        Log.info("INFO" + info.response);
        if (err) {
          Log.error(err);
          res.status(500).json({ error: true, message: "Send mail error" });
        } else {
          Log.success("Mail send " + info.response);
          res.status(200).json({
            error: false,
            message: "An OTP has been sent to email " + username,
          });
        }
      });
    }
  } catch (err) {
    return res.status(500).json({ error: true, message: err });
  }
};

export const checkOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, otp }: UserType = req.body;
  if (username == undefined || username.toString().trim() == "") {
    res
      .status(500)
      .json({ error: true, message: "Username không được bỏ trống" });
  }
  if (otp == undefined || otp.toString().trim() == "") {
    res.status(500).json({ error: true, message: "OTP không được bỏ trống" });
  }

  try {
    const user = await User.find({ username });
    if (user) {
      if (user[0].otp == otp.toString()) {
        res.status(200).json({ error: false, message: "OTP SUCCESS" });
      } else {
        res.status(500).json({ error: true, message: "OTP error" });
      }
    } else {
      res.status(500).json({ error: true, message: "Username không tồn tại" });
    }
  } catch (e) {
    res.status(500).json({ error: true, message: "OTP ERR " + e });
  }
};

export const setPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password }: UserType = req.body;
  const hashedPassword = await bcrypt.hash(password.toString(), 10);
  try {
    const _user = await User.findOneAndUpdate(
      { username },
      {
        $set: {
          password: hashedPassword,
        },
      },
      { new: true }
    );
    if (_user) {
      const token = tokenGen(
        { _id: _user._id.toString(), role: _user.role },
        7
      );
      const refreshToken = tokenGen({ _id: _user._id.toString() }, 30);
      res.status(200).json({ error: false, token, refreshToken, data: _user });
    }
  } catch (e) {
    res.status(500).json({ error: true, message: "SetPassword ERR " + e });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password }: UserType = req.body;
  if (username == undefined || username.toString().trim() == "") {
    res
      .status(500)
      .json({ error: true, message: "Username không được bỏ trống" });
  }

  if (password == undefined || password.toString().trim() == "") {
    res
      .status(500)
      .json({ error: true, message: "Password không được bỏ trống" });
  }

  try {
    const _user = await User.find({ username });
    if (_user.length > 0) {
      const compare = await bcrypt.compare(
        password.toString(),
        _user[0].password.toString()
      );
      if (compare) {
        const token = tokenGen(
          { _id: _user[0]._id.toString(), role: _user[0].role },
          7
        );
        const refreshToken = tokenGen({ _id: _user[0]._id.toString() }, 30);
        res
          .status(200)
          .json({ error: false, token, refreshToken, data: _user[0] });
      }
    } else {
      res.status(500).json({ error: true, message: "User không tồn tại" });
    }
  } catch (e) {
    res.status(500).json({ error: true, message: "Login ERR " + e });
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.params;
  try {
    const _user = await User.find({ username });
    if (_user.length > 0) {
      res.status(200).json({ error: false, data: _user[0] });
    } else {
      res.status(500).json({ error: true, message: "User không tồn tại" });
    }
  } catch (e) {
    res.status(500).json({ error: true, message: "GetUser ERR " + e });
  }
};
export const logout = (req: Request, res: Response, next: NextFunction) => {};
