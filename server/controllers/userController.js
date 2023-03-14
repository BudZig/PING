"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateImages = exports.sendReview = exports.sendRequest = exports.updateUser = exports.createUser = exports.getUser = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield User_1.default.find();
        res.send(data);
        res.status(200);
    }
    catch (error) {
        res.status(500).send({ error: error });
    }
});

const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield User_1.default.findOne({ email: req.body.email.user.email });
        res.send(data);
        res.status(200);
    }
    catch (error) {
        res.status(500).send({ error: error });
    }
});

const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = new User_1.default(req.body);
        yield data.save();
        res.send(data);
        res.status(201);
    }
    catch (error) {
        res.status(500).send({ error: error });
    }
});

const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { socketID, username, role } = req.body;
        const data = yield User_1.default.findOneAndUpdate({ socketID: socketID }, { username: username, role: role }, { new: true });
        res.send(data);
        console.log(data);
        res.status(201);
    }
    catch (error) {
        res.status(500).send({ error: error });
    }
});

const sendRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, content, type, status } = req.body;
        const data = yield User_1.default.findOneAndUpdate({ username: username }, {
            $push: {
                requests: {
                    content: content,
                    type: type,
                    status: status,
                    date: new Date(),
                },
            },
        }, { new: true });
        res.send(data);
        res.status(201);
    }
    catch (error) {
        res.status(500).send({ error: error });
    }
});

const sendReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, helper, rating, review, time } = req.body.request;
        const data = yield User_1.default.findOneAndUpdate({ 'requests._id': _id }, { 'requests.$.review': { helper, rating, review, time } }, { new: true });
        res.send(data);
        res.status(201);
    }
    catch (error) {
        res.status(500).send({ error: error });
    }
});

// this function has to be fixed, images get added to wrong documents
const updateImages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, image } = req.body;
        const user = yield User_1.default.findOneAndUpdate({ username: username }, { $push: { 'requests.$[elem].images': { $each: [image], $position: 0 } } }, { arrayFilters: [{ 'elem.images': { $exists: true } }], new: true });
        if (!user) {
            res.status(404).send({ error: `User with username ${username} not found` });
            return;
        }
        res.send(user);
        res.status(201);
    }
    catch (error) {
        res.status(500).send({ error: error });
    }
});


module.exports = { getAllUsers, getUser, sendRequest, sendReview, createUser, updateUser, updateImages }