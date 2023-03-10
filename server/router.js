"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("./controllers/userController");
const taglineController_1 = require("./controllers/taglineController");
const router = express_1.default.Router();
router.get('/getAllUsers', userController_1.getAllUsers);
router.post('/getUser', userController_1.getUser);
router.post('/createUser', userController_1.createUser);
router.put('/updateUser', userController_1.updateUser);
router.post('/sendRequest', userController_1.sendRequest);
router.post('/sendReview', userController_1.sendReview);
router.post('/updateImages', userController_1.updateImages);
router.get('/getTaglines', taglineController_1.getTaglines);
router.post('/postTagline', taglineController_1.postTagline);
exports.default = router;
