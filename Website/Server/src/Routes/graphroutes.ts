import express from "express";
import { getContentStats  } from "../Controllers/graphcontroller";

const router = express.Router();

router.get("/graph", getContentStats );
console.log("Graph routes carregadas");


export default router;
