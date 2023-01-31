import { Request, Response } from "express";
import User, { STATUS, UserType } from "models/user";
import bcrypt from "bcrypt";
import { getIdFromReq, parseJwt, tokenGen } from "utils/token";
import { accountVerify } from "middleware/verify";
import Log from "library/log";

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
    if (user.otp.exp > new Date()) {
      user.otp = {
        code: "",
        exp: new Date(),
      };
      const access_token = tokenGen({ _id: id }, 5);
      user.access_token = access_token;
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
  if (user.status === STATUS.active) {
    return res.status(409).json({ message: "User already set password" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  user.password = hashPassword;
  user.otp = {
    code: "",
    exp: new Date(),
  };
  const access_token = tokenGen({ _id: id }, 5);
  const refresh_token = tokenGen({ _id: id }, 60);
  user.access_token = access_token;
  user.refresh_token = refresh_token;
  user.status = STATUS.active;
  await user.save();
  return res.status(200).json({
    access_token,
    refresh_token,
    message: "Set password success",
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password, phone } = req.body;
  if ((!email || !password) && (!phone || !password)) {
    return res.status(400).json({ message: "Missing email/phone or password" });
  }
  const user = await User.findOne(email ? { email } : { phone });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  } else {
    if (user.status === STATUS.active) {
      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) {
        return res.status(400).json({ message: "Password is invalid" });
      }
      const access_token = tokenGen({ _id: user.id }, 5);
      const refresh_token = tokenGen({ _id: user.id }, 60);
      user.access_token = access_token;
      user.refresh_token = refresh_token;
      await user.save();
      return res.status(200).json({
        access_token,
        refresh_token,
        message: "Login success",
      });
    }
    return res.status(404).json({ message: "Login failed" });
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
    result: {
      email: user.email,
      phone: user.phone,
    },
    message: "Get user success",
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ message: "Missing token" });
  }
  const parToken = parseJwt(token);
  const { _id, exp } = parToken;
  // check expired token
  if (exp < new Date().getTime() / 1000) {
    Log.error("Token expired");
    return res.status(401).json({ message: "Refresh token expired" });
  }
  const user = await User.findOne({ _id, refresh_token: token });
  if (!user) {
    return res.status(401).json({ message: "Refresh token fail" });
  }
  //log id
  Log.info(`Refresh token success with id: ${user._id}`);
  const access_token = tokenGen({ _id: user.id }, 5);
  user.access_token = access_token;
  await user.save();
  Log.success(`Refresh token success with email: ${user.email}`);
  return res.status(200).json({
    access_token,
    message: "Refresh token success",
  });
};

export const logout = (req: Request, res: Response) => {
  const id = getIdFromReq(req);
  // clear token
  User.findByIdAndUpdate(id, {
    access_token: "",
    refresh_token: "",
  })
    .then(() => {
      Log.success(`Logout success with id: ${id}`);
      return res.status(200).json({ message: "Logout success" });
    })
    .catch((err: any) => {
      Log.error(`Logout fail with id: ${id}`);
      return res.status(500).json({ message: "Logout fail" });
    });
};
