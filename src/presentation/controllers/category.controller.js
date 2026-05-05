export default class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }

    createCategory = async (req, res) => {
        try {
            const category = await this.categoryService.createCategory(req.body, req.user.id);
            res.status(201).json(category);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    getCategoriesByUserId = async (req, res) => {
        try {
            const categories = await this.categoryService.getCategoriesByUserId(req.user.id);
            res.status(200).json(categories);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    getCategoryById = async (req, res) => {
        try {
            const category = await this.categoryService.getCategoryById(req.params.id, req.user.id);
            res.status(200).json(category);
        } catch (error) {
            if (error.message === "Forbidden") return res.status(403).json({ error: error.message });
            if (error.message === "Category not found") return res.status(404).json({ error: error.message });
            res.status(400).json({ error: error.message });
        }
    };

    updateCategory = async (req, res) => {
        try {
            const category = await this.categoryService.updateCategory(req.params.id, req.body, req.user.id);
            res.status(200).json(category);
        } catch (error) {
            if (error.message === "Forbidden") return res.status(403).json({ error: error.message });
            if (error.message === "Category not found") return res.status(404).json({ error: error.message });
            res.status(400).json({ error: error.message });
        }
    };

    deleteCategory = async (req, res) => {
        try {
            const result = await this.categoryService.deleteCategory(req.params.id, req.user.id);
            res.status(200).json(result);
        } catch (error) {
            if (error.message === "Forbidden") return res.status(403).json({ error: error.message });
            if (error.message === "Category not found") return res.status(404).json({ error: error.message });
            res.status(400).json({ error: error.message });
        }
    };
}
