"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("./auth"));
const accounts_1 = __importDefault(require("./accounts"));
const authentication_1 = require("../middlewares/authentication");
exports.routes = (0, express_1.default)()
    .use(auth_1.default)
    .use('/accounts', authentication_1.authMiddleware, accounts_1.default);
