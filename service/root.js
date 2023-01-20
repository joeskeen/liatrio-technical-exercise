import express from "express";
import { STATIC_MESSAGE } from './defaults.js';

const router = express.Router();

router.get("/", (_, res) => handleRequest(res, getTimestamp));

export default router;

export function handleRequest(res, getTimestamp) {
  res.contentType = "application/json";
  res.statusCode = 200;
  res.send({
    message: process.env.STATIC_MESSAGE ?? STATIC_MESSAGE,
    timestamp: getTimestamp(),
  });
}

export function getTimestamp() {
  return Date.now();
}
