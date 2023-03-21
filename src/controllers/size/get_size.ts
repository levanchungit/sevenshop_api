import Size, { ISize } from "models/size";
import { Request, Response } from "express";

const getSizeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const size: ISize | null = await Size.findById(id);
    if (!size) {
      return res.sendStatus(404);
    }
    return res.json(size);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getSizeById;
