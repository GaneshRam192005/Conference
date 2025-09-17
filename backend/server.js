import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db.js";
// import { createRegistrationTable } from "./models/Registration.js";
import {registrationModel} from "./models/registrationModel.js";
import { userModel } from "./models/userModel.js";
import registrationRoutes from "./routes/registrationRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { seedAdmin } from "./controllers/adminController.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

registrationModel(db);
userModel(db);


seedAdmin();

app.use("/api/auth", authRoutes);
app.use("/api/registration", registrationRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
