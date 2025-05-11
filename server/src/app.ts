import express from "express";
import cors from "cors";
import routes from "./routes";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import passport from './config/passport';
dotenv.config();


const app = express();

 app.use(passport.initialize());
// app.use(passport.session());

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
console.log(allowedOrigin,'Allowed origin is')
app.use(cors({ origin: allowedOrigin, credentials: true }));

app.use(express.json());

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);


export default app;
