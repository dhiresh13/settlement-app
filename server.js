const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const PORT = process.env.PORT || 4000;

// const db = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "chat_app",
// });

const db = mysql.createPool({
  host: "sql12.freesqldatabase.com",
  user: "sql12712839",
  password: "2mBe9tImeU",
  database: "sql12712839",
});

app.use(cors());
app.use(express.json());
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.get("/api/messages", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM messages where is_delete=0;");
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/insert", async (req, res) => {
  try {
    const { text, updated_by, status } = req.body;
    if (updated_by === 1) {
      let update_msg = `UPDATE messages set
    status = 'Read' WHERE updated_by = 0 and status="Pending";`;
      const [updated] = await db.query(update_msg);
    }
    let query = `INSERT INTO messages (text, updated_by, status)
                  VALUES ('${text}', ${updated_by}, '${status}');`;
    const [result] = await db.query(query);

    const [rows] = await db.query("SELECT * FROM messages WHERE id = ?;", [
      result.insertId,
    ]);
    const newMessage = rows[0];

    io.emit("newMessage", newMessage);
    res.status(200).json("Data inserted Successfully");
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/update", async (req, res) => {
  try {
    const { text, updated_by, status, id } = req.body;

    const obj_query = `select MAX(id) from messages`;
    const [latest] = await db.query(obj_query);

    if (Object.values(latest[0])[0] !== id) {
      res.status(409).json("Latest Update Available");
    } else {
      let query = `UPDATE messages
      SET text = '${text}',
    updated_by = ${updated_by},
    status = '${status}'
WHERE id = ${id};`;

      const [result] = await db.query(query);
      const [rows] = await db.query("SELECT * FROM messages WHERE id = ?;", [
        id,
      ]);
      const newMessage = rows[0];

      io.emit("onUpdate", newMessage);
      res.status(200).json("Updated Data Successfully");
    }
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
