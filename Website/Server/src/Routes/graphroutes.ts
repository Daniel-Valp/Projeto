import express from "express";
import { getCourseStats } from "../Controllers/graphcontroller";

const router = express.Router();

router.get("/graph", getCourseStats);
console.log("Graph routes carregadas");


export default router;
