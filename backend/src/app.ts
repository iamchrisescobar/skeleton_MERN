import "dotenv/config";
import express from "express";
import type { Request, Response, NextFunction } from "express";
import notesRoutes from "./routes/notes.ts";
import userRoutes from "./routes/users.ts";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from "./util/validateEnv.ts";
import MongoStore from "connect-mongo";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

// Handle favicon requests first TODO: add icon or do nothing for now.
app.get("/favicon.ico", (req, res) => {
    res.status(204).end(); // No Content - browser will use default favicon
});

app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 // 1 ms * 1000 * 60 s * 60 m = 1 h
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING
    }),
}));

app.use("/api/users", userRoutes)
app.use("/api/notes", notesRoutes);

// Middleware for unreachable endpoints
app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// ERROR MIDDLEWARE (4 parameters)
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An Unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage});
});

export default app;