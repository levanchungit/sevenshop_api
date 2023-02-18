import moment from "moment";
import { Request, Response } from "express";
import User, { Status, UserType } from "models/user";
import bcrypt from "bcrypt";
import { getIdFromReq, parseJwt, tokenGen } from "utils/token";
import { accountVerify } from "middleware/verify";
import Log from "libraries/log";

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
      const access_token = tokenGen(
        { _id: id, role_type: user.role_type },
        parseInt(<string>process.env.EXPIRED_ACCESS_TOKEN)
      );
      user.access_token = access_token;
      user.modify_at = moment(new Date()).format("YYYY-MM-DD HH:mm");
      user.modify_by =
        "CHECK OTP_" + moment(new Date()).format("YYYY-MM-DD HH:mm") + " | ";
      await user.save();
      return res.status(200).json({
        access_token,
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
  if (user.status === Status.active) {
    return res.status(409).json({ message: "User already set password" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  user.password = hashPassword;
  user.otp = {
    code: "",
    expired: new Date(),
  };
  const access_token = tokenGen(
    { _id: id, role_type: user.role_type },
    parseInt(<string>process.env.EXPIRED_ACCESS_TOKEN)
  );
  const refresh_token = tokenGen(
    { _id: id, role_type: user.role_type },
    parseInt(<string>process.env.EXPIRED_REFRESH_TOKEN)
  );
  user.access_token = access_token;
  user.refresh_token = refresh_token;
  user.status = Status.active;
  user.modify_at = moment(new Date()).format("YYYY-MM-DD HH:mm");
  user.modify_by +=
    "SET PASSWORD_" + moment(new Date()).format("YYYY-MM-DD HH:mm") + " | ";
  await user.save();
  return res.status(200).json({
    access_token,
    refresh_token,
    message: "Set password success",
  });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.password) {
      return res
        .status(404)
        .json({ message: "User inactive. Please active user!" });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(400).json({ message: "Password is invalid" });
    }

    const access_token = tokenGen(
      { _id: user.id, role_type: user.role_type },
      parseInt(<string>process.env.EXPIRED_ACCESS_TOKEN)
    );
    const refresh_token = tokenGen(
      { _id: user.id, role_type: user.role_type },
      parseInt(<string>process.env.EXPIRED_REFRESH_TOKEN)
    );
    user.access_token = access_token;
    user.refresh_token = refresh_token;
    await user.save();
    Log.info("Login success with email: " + user.email);
    return res.status(200).json({
      access_token,
      refresh_token,
      message: "Login success",
    });
  } catch (err) {
    Log.error(err);
    return res.status(500).json({ message: err });
  }
};

export const getMe = async (req: Request, res: Response) => {
  const id = getIdFromReq(req);
  const user = await User.findById(id);
  Log.info("Get user success with email: " + user?.email);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json({
    result: user,
    message: "Get user success",
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refresh_Token } = req.body;
  if (!refresh_Token) {
    return res.status(400).json({ message: "Missing token" });
  }
  const parToken = parseJwt(refresh_Token);
  const { _id, exp, role_type } = parToken;
  // check expired token
  if (exp < new Date().getTime() / 1000) {
    Log.error("Token expired");
    return res.status(401).json({ message: "Refresh token expired" });
  }
  const user = await User.findOne({ _id, refresh_token: refresh_Token });
  if (!user) {
    return res.status(401).json({ message: "Refresh token fail" });
  }
  //log id
  Log.info(`Refresh token success with id: ${user._id}`);
  const access_token = tokenGen(
    { _id: user.id, role_type: user.role_type },
    parseInt(<string>process.env.EXPIRED_ACCESS_TOKEN)
  );
  const refresh_token = tokenGen(
    { _id: user.id, role_type: user.role_type },
    parseInt(<string>process.env.EXPIRED_REFRESH_TOKEN)
  );
  user.access_token = access_token;
  user.refresh_token = refresh_token;
  user.modify_at = moment(new Date()).format("YYYY-MM-DD HH:mm");
  user.modify_by +=
    "REFRESH TOKEN_" + moment(new Date()).format("YYYY-MM-DD HH:mm") + " | ";
  await user.save();
  Log.success(`Refresh token success with email: ${user.email}`);
  return res.status(200).json({
    access_token,
    refresh_token,
    message: "Refresh token success",
  });
};

export const logout = async (req: Request, res: Response) => {
  const id = getIdFromReq(req);
  const user = await User.findById(id);
  if (!user) {
    return res.status(500).json({ message: "Logout fail" });
  }
  // clear token
  user.access_token = "";
  user.refresh_token = "";
  user.modify_at = moment(new Date()).format("YYYY-MM-DD HH:mm");
  user.modify_by +=
    "LOG OUT_" + moment(new Date()).format("YYYY-MM-DD HH:mm") + " | ";
  await user.save();
  return res.status(200).json({ message: "Logout success" });
};
