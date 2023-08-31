import { Request, Response } from "express";
import User, { IUser } from "../models/User";

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await User.find();
    res.send(data);
    res.status(200); 
  } catch (error) {
    res.status(500).send({error: error as string});
  }
}

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await User.findOne({email: req.body.email.user.email});
    res.send(data);
    res.status(200);
  } catch (error) {
    res.status(500).send({error: error as string});
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = new User(req.body);
    await data.save();
    res.send(data);
    res.status(201);
  } catch (error) {
    res.status(500).send({error: error as string});
  }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { socketID, username, role } = req.body;
    const data = await User.findOneAndUpdate(
      { socketID: socketID },
      { username: username, role: role },
      { new: true }
    );
    res.send(data);
    console.log(data);
    res.status(201);
  } catch (error) {
    res.status(500).send({error: error as string});
  }
};

export const sendRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, content, type, status } = req.body;
    const data = await User.findOneAndUpdate(
      { username: username },
      {
        $push: {
          requests: {
            content: content,
            type: type,
            status: status,
            date: new Date(),
          },
        },
      },
      { new: true }
    );
    res.send(data);
    res.status(201);
  } catch (error) {
    res.status(500).send({error: error as string});
  }
};


export const sendReview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { _id, helper, rating, review, time } = req.body.request;
    const data = await User.findOneAndUpdate(
      { 'requests._id': _id },
      { 'requests.$.review': { helper, rating, review, time } },
      { new: true }
    );
    res.send(data);
    res.status(201);
  } catch (error) {
    res.status(500).send({error: error as string});
  }
};

// this function has to be fixed, images get added to wrong documents
export const updateImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, image } = req.body;
    const user: IUser | null = await User.findOneAndUpdate(
      { username: username },
      { $push: { 'requests.$[elem].images': { $each: [image], $position: 0 } } },
      { arrayFilters: [{ 'elem.images': { $exists: true } }], new: true }
    );
    if (!user) {
      res.status(404).send({ error: `User with username ${username} not found` });
      return;
    }
    res.send(user);
    res.status(201);
  } catch (error) {
    res.status(500).send({error: error as string});
  }
};

