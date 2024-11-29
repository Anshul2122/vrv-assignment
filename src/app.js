import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.use((req, res, next) => {
    console.log(
        "----------------------------------------------------------------------------------"
    );
    console.log(`Route being hit: ${req.method} ${req.path}`);
    console.log("Req Body", req.body);
    console.log("Req Params", req.params);
    console.log("Req Query", req.query);
    console.log(
        "----------------------------------------------------------------------------------"
    );
    next();
});


// import Routes
import userRoute from "./routes/user.route.js";
import noteRoute from "./routes/note.route.js";

//routes declaration
app.use("/api/v1/user", userRoute);
app.use("/api/v1/note", noteRoute);
export {app};