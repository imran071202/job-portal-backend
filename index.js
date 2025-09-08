import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";   // ✅ only once
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRouter from "./routes/userRoute.js";
import companyRouter from "./routes/companyRoute.js";
import jobRouter from "./routes/jobRoute.js";
import applicationRouter from "./routes/applicationRoute.js"



dotenv.config({})

const app = express()

// app.get("/home",(req,res)=>{
//     return res.status(200).json({
//         message:"I am backend",
//         success:true
//     })
// })


//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


const allowedOrigins = [
    "http://localhost:5173",
    "https://job-portal-frontend.vercel.app",
    "https://skill-bridge-jobs.vercel.app",   // ✅ add your real deployed frontend
    /\.vercel\.app$/   // ✅ allow Vercel preview builds
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.some(o =>
            o instanceof RegExp ? o.test(origin) : o === origin
        )) {
            callback(null, true);
        } else {
            console.warn(`Blocked by CORS: ${origin}`);
            callback(null, false); // instead of throwing error
        }
    },
    credentials: true,
};


app.use(cors(corsOptions));


const PORT = process.env.PORT || 3000

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Backend is running!",
        success: true
    });
});


//api

app.use("/api/v1/user", userRouter)
app.use("/api/v1/company", companyRouter)
app.use("/api/v1/job", jobRouter)
app.use("/api/v1/application", applicationRouter)





// app.listen(PORT, () => {
//     connectDB()

//     console.log(`server runnling ${PORT}`);


// })

const startServer = async () => {
    try {
        await connectDB()
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to DB", error);
        process.exit(1);
    }
};

startServer();

