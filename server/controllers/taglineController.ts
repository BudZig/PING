import { Request, Response } from 'express';
import Tagline, { ITagline } from '../models/Tagline';

export const getTaglines = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: ITagline[] = await Tagline.find({});
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({error: error as string});
  }
}

export const postTagline = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log(req.body.tagline);
    const data: ITagline = new Tagline(req.body);
    await data.save();
    res.status(201);
  } catch (error) {
    res.status(500).send({error: error as string});
  }
}
