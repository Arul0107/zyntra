require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const http = require("http");
const { Server } = require("socket.io");

const app = express();

/* ------------------------------
   ⭐ CORS CONFIG
------------------------------ */
const corsOptions = {
    origin: ["https://vrismcrm.netlify.app", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"]
};
app.use(cors(corsOptions));
app.use(express.json());

/* ------------------------------
   ⭐ AUTO OFFLINE CRON
------------------------------ */
const userStatusCron = require("./cron/userStatusCron");
userStatusCron();

/* ------------------------------
   ⭐ ROUTES
------------------------------ */
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/departments', require('./routes/departmentRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/accounts', require('./routes/businessAccountRoutes'));
app.use('/api/quotations', require('./routes/quotationRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/service', require('./routes/brandServiceRoutes'));
app.use('/api/tasks', require("./routes/taskRoutes"));
app.use('/api/work-sessions', require('./routes/workSessionRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

app.get('/api/test', (req, res) => res.json({ message: 'Server is working 🎉' }));

/* ------------------------------
   ⭐ CREATE HTTP + WEBSOCKET SERVER
------------------------------ */
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ["https://vrismcrm.netlify.app", "http://localhost:5173"],
        methods: ["GET", "POST"]
    }
});

// 🔥 Global IO to use inside controllers
global._io = io;

/* ------------------------------
   ⭐ SOCKET.IO EVENTS
------------------------------ */
io.on("connection", (socket) => {
    console.log("🟢 Socket Connected:", socket.id);

    // When the user updates their presence
    socket.on("presence_change", (data) => {
        console.log("📡 Presence Update:", data);

        // Broadcast to all apps
        io.emit("presence_updated", data);
    });

    socket.on("disconnect", () => {
        console.log("🔴 Socket Disconnected:", socket.id);
    });
});

/* ------------------------------
   ⭐ START SERVER
------------------------------ */
connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () =>
        console.log(`🔥 API + WebSocket Server running on port ${PORT}`)
    );
});
