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


//Routes


export {app};