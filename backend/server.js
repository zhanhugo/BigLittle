import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import noteRoutes from "./routes/noteRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config();

connectDB();

const app = express(); // main thing
app.use(express.json()); // to accept json data
const http = createServer(app);
const PORT = process.env.PORT || 443;
const io = new Server(http, { allowEIO3: true, cors: { origin: ["https://biglittle.herokuapp.com", "http://localhost:3000"], credentials: true } });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
})

app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes)

var connectedUsers = {};

io.on('connection', (socket) => { // socket object may be used to send specific messages to the new connected client
    socket.emit('connection', null);

    socket.on('register', user => {
      socket.user = user
      connectedUsers[user] = socket
    });

    socket.on('send-message', message => {
      if (connectedUsers.hasOwnProperty(message.to)) {
        connectedUsers[message.to].emit('message' + socket.user, message);
      }
    });
});

// --------------------------deployment------------------------------
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}
// --------------------------deployment------------------------------

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

http.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}..`.yellow
      .bold
  )
);
