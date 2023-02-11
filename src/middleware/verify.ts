import User, { OTPType, STATUS } from "models/user";
import { Types } from "mongoose";
import { Response } from "express";
import nodemailer from "nodemailer";
import client from "twilio";
import Log from "library/log";

type AccountVerifyType = {
  email?: string;
  phone?: string;
  res: Response;
};

const sendMail = (
  user_id: Types.ObjectId,
  otp: string,
  email: string,
  res: Response
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_APP_MAIL,
      pass: process.env.PASS_APP_MAIL,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  var content = `
      <div style="display:flex;background-color:rgb(224,224,224);align-items: center;justify-content: center;">
        <div style="align-items: center;justify-content: center ;width: 50%; background-color: white; margin: 50px; padding: 50px">
            <div>
                <img style="width: 100%; min-width: 250px;"
                    src="https://res.cloudinary.com/dq7xnkfde/image/upload/v1673451729/logo-01_xgl0wr.png"></img>
            </div>
            <h2 style="text-align: center; font-weight: bold;"> Here is your One Time Password</h2>
            <p style="text-align: center; color:rgb(132, 132, 132);font-size: 18px;">to validate your email address</p>
            <div style="display:flex;padding:10px;background-color:white;border-radius:4px;align-items: center;justify-content: center;">
                <h1 style="text-align: center; font-size: 50px; letter-spacing: 10dp;letter-spacing: 5px;">${otp}</h1>
            </div>
            <p style="text-align: center; color:rgb(255, 0, 0);font-size: 16px;">Valid for 5 minutes only</p>
        </div>
      </div>
  `;
  const mailOptions = {
    from: process.env.USER_APP_MAIL,
    to: email,
    subject: "Verify your email",
    html: content,
  };
  transporter.sendMail(mailOptions, async (err, info) => {
    if (err) {
      return res.status(500).json({ message: "Send email fail" });
    }
    return res.status(200).json({
      result: {
        id: user_id,
      },
      message: "Send email success",
    });
  });
};

const sendPhone = (
  user_id: Types.ObjectId,
  otp: string,
  phone: string,
  res: Response
) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  client(accountSid, authToken)
    .messages.create({
      body: `Your OTP is ${otp}`,
      messagingServiceSid: process.env.MESSAGE_SERVICE_ID,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: "+84" + phone,
    })
    .then((message) => {
      Log.info(message);
      return res.status(200).json({
        result: {
          id: user_id,
        },
        message: "Send phone success",
      });
    })
    .catch((err) => {
      Log.error(err);
      return res.status(500).json({ message: "Send phone fail" });
    });
};

const generateOTP = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const exp = new Date();
  exp.setMinutes(exp.getMinutes() + 5);

  return { code: otp.toString(), exp };
};

export const accountVerify = async (props: AccountVerifyType) => {
  const { email, phone, res } = props;
  const user = await User.findOne(email ? { email } : { phone });
  if (user) {
    if (user.status === STATUS.active) {
      return res.status(409).json({ message: "Account already exists" });
    }
    if (user.status === STATUS.pending) {
      checkDateOTP(user._id, res);
      if (email) {
        sendMail(user._id, user.otp.code, user.email, res);
        return;
      }
      if (phone) {
        sendPhone(user._id, user.otp.code, user.phone, res);
        return;
      }
      return res.status(200).json({
        result: {
          otp: user.otp.code,
        },
        message: "Send OTP success",
      });
    }
  }
  // create new user
  const otp = (await generateOTP()) as OTPType;
  const newUser = new User({
    email,
    phone,
    otp,
  });
  await newUser.save();
  if (email) {
    sendMail(newUser._id, otp.code, newUser.email, res);
    return;
  }
  if (phone) {
    sendPhone(newUser._id, otp.code, newUser.phone, res);
    return;
  }
  return res.status(200).json({
    result: {
      otp: otp.code,
    },
    message: "Send OTP success",
  });
};

export const checkDateOTP = async (id: Types.ObjectId, res: Response) => {
  const user = await User.findById(id);
  // update if otp expired
  if (user) {
    if (user.otp.exp < new Date()) {
      const otp = await generateOTP();
      await user.updateOne({
        otp,
      });
      return { otp, id };
    }
    return { otp: user.otp, id };
  }
  return res.status(404).json({ message: "User not found" });
};
