import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express()

// basic configuration
app.use(express.json({limit : "16kb"}))
app.use(cookieParser()) // for parsing cookies
app.use(express.urlencoded({extended : true, limit : "16kb"}))
app.use(express.static("public"))

// cors configuration
app.use(
    cors({
      origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

// import routes
import healthCheckRoute from "./routes/healthcheck.routes.js"
import authRouter from "./routes/auth.routes.js"
import projectRouter from "./routes/project.routes.js"


app.use("/api/v1/healthcheck", healthCheckRoute)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/projects", projectRouter)



app.get("/instagram", (req, res) => {
    res.send("Welcome to Instagram")
})
export default app
