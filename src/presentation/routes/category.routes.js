import { Router } from "express";
import CategoryController from "../controllers/category.controller.js";
import CategoryService from "../../application/use-cases/category.service.js";
import CategoryMongoRepository from "../../infrastructure/database/mongo/category.mongo.repository.js";
import NoteMongoRepository from "../../infrastructure/database/mongo/note.mongo.repository.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const categoryRepository = new CategoryMongoRepository();
const noteRepository = new NoteMongoRepository();
const categoryService = new CategoryService(categoryRepository, noteRepository);
const categoryController = new CategoryController(categoryService);

const router = Router();

router.post("/", authMiddleware, categoryController.createCategory);

export default router;
