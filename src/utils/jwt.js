"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signToken = exports.registroJwt = void 0;
var dotenv = require("dotenv");
dotenv.config();
var secret = process.env.JWT_SECRET;
var registroJwt = function (app) {
    if (!secret) {
        throw new Error("ocorreu um erro no JWT_SECRET");
    }
    app.register(Promise.resolve().then(function () { return require("fastify-jwt"); }), {
        secret: secret,
    });
};
exports.registroJwt = registroJwt;
var signToken = function (pl) {
    return { token: pl };
};
exports.signToken = signToken;
var verifyToken = function (token) {
    return token;
};
exports.verifyToken = verifyToken;
