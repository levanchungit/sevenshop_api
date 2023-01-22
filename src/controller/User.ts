import { Request, Response } from "express";
import User, { STATUS, UserType } from "models/user";
import bcrypt from "bcrypt";
import { getIdFromReq, tokenGen } from "utils/token";
import { accountVerify } from "middleware/verify";

// const sendSMS = (code: string, phone: string, res: Response) => {
//   const accountSid = process.env.TWILIO_ACCOUNT_SID;
//   const authToken = process.env.TWILIO_AUTH_TOKEN;
//   const client = require("twilio")(accountSid, authToken);
//   client.messages
//     .create({
//       body: `Here is your One Time Password to validate your phone number: ${code}`,
//       from: process.env.TWILIO_PHONE_NUMBER,
//       to: phone,
//     })
//     .then((message: any) => {
//       return res.status(200).json({ message: "Send SMS success" });
//     })
//     .catch((err: any) => {
//       return res.status(500).json({ message: "Send SMS fail" });
//     });
// };

export const register = async (req: Request, res: Response) => {
  const { email, phone }: UserType = req.body;
  if (!email && !phone) {
    return res.status(400).json({ message: "Missing email or phone" });
  }
  if (email) {
    await accountVerify({ email, res });
  }
  if (phone) {
    await accountVerify({ phone, res });
  }
};

export const checkOTP = async (req: Request, res: Response) => {
  const { id, otp } = req.body;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.otp.code === otp) {
    if (user.otp.expired > new Date()) {
      user.otp = {
        code: "",
        expired: new Date(),
      };
      user.accessToken = tokenGen({ _id: user.id }, 1);
      await user.save();
      return res.status(200).json({
        data: {
          accessToken: user.accessToken,
        },
        message: "OTP is valid",
      });
    }
  }
  return res.status(400).json({ message: "OTP is invalid" });
};

export const setPassword = async (req: Request, res: Response) => {
  const id = getIdFromReq(req);
  const { password } = req.body;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.status === STATUS.active) {
    return res.status(409).json({ message: "User already set password" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  user.password = hashPassword;
  user.otp = {
    code: "",
    expired: new Date(),
  };
  const accessToken = tokenGen({ _id: id }, 1);
  const refreshToken = tokenGen({ _id: id }, 7);
  user.accessToken = accessToken;
  user.refreshToken = refreshToken;
  user.status = STATUS.active;
  await user.save();
  return res.status(200).json({
    data: {
      accessToken,
      refreshToken,
    },
    message: "Set password success",
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) {
    return res.status(400).json({ message: "Password is invalid" });
  }
  const accessToken = tokenGen({ _id: user.id }, 1);
  const refreshToken = tokenGen({ _id: user.id }, 7);
  user.accessToken = accessToken;
  user.refreshToken = refreshToken;
  await user.save();
  return res.status(200).json({
    data: {
      accessToken,
      refreshToken,
    },
    message: "Login success",
  });
};

export const getMe = async (req: Request, res: Response) => {
  const id = getIdFromReq(req);
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({
    data: {
      username: user.username,
      email: user.email,
      phone: user.phone,
    },
    message: "Get user success",
  });
};
export const logout = (req: Request, res: Response) => {
  const id = getIdFromReq(req);
  User.findByIdAndUpdate(
    id,
    {
      accessToken: "",
      refreshToken: "",
    },
    (err, doc) => {
      if (err) {
        return res.status(500).json({ message: "Logout fail" });
      }
      return res.status(200).json({ message: "Logout success" });
    }
  );
};
