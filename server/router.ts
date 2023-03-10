import express from 'express';
import {
  getUser,
  createUser,
  updateUser,
  sendRequest,
  sendReview,
  updateImages,
  getAllUsers,
} from './controllers/userController';

import {
  getTaglines,
  postTagline,
} from './controllers/taglineController';

const router = express.Router();

router.get('/getAllUsers', getAllUsers);
router.post('/getUser', getUser);
router.post('/createUser', createUser);
router.put('/updateUser', updateUser);
router.post('/sendRequest', sendRequest);
router.post('/sendReview', sendReview);
router.post('/updateImages', updateImages);
router.get('/getTaglines', getTaglines);
router.post('/postTagline', postTagline);

export default router;
