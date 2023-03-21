import Color, { IColor } from "models/color";
import { Request, Response } from "express";

const getColorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const color: IColor | null = await Color.findById(id);
    if (!color) {
      return res.sendStatus(404);
    }
    return res.json(color);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getColorById;
