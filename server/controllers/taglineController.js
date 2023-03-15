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
exports.postTagline = exports.getTaglines = void 0;
const Tagline_1 = __importDefault(require("../models/Tagline"));
const getTaglines = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Tagline_1.default.find({});
        res.status(200).send(data);
    }
    catch (error) {
        res.status(500).send({ error: error });
    }
});

const postTagline = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body.tagline);
        const data = new Tagline_1.default(req.body);
        yield data.save();
        res.status(201);
    }
    catch (error) {
        res.status(500).send({ error: error });
    }
});


module.exports = { postTagline, getTaglines }