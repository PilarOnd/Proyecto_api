import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import AuthService from "../../application/use-cases/auth.service.js";
import UserMongoRepository from "../../infrastructure/database/mongo/user.mongo.repository.js";

// Inyección de dependencias
const userRepository = new UserMongoRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController({ authService });

const router = Router();

// Permite el alta inicial; si quieres restringirlo a admin, aplica auth+roles después de bootstrap.
router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;