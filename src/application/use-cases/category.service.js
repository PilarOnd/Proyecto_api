import NoteCategoryEntity from "../../domain/entities/note.category.js";

export default class CategoryService {
    constructor(categoryRepository, noteRepository) {
        this.categoryRepository = categoryRepository;
        this.noteRepository = noteRepository;
    }

    async createCategory(data, userId) {
        const name = data.name?.trim();
        if (!name) throw new Error("Name is required");

        const entity = new NoteCategoryEntity({ name, userId });
        return await this.categoryRepository.save(entity);
    }

    async getCategoriesByUserId(userId) {
        return await this.categoryRepository.findAllByUserId(userId);
    }

    async getCategoryById(id, userId) {
        const category = await this.categoryRepository.findById(id);
        if (!category) throw new Error("Category not found");
        if (String(category.userId) !== String(userId)) throw new Error("Forbidden");
        return category;
    }

    async updateCategory(id, data, userId) {
        await this.getCategoryById(id, userId);
        const name = data.name?.trim();
        if (!name) throw new Error("Name is required");

        const updated = await this.categoryRepository.update(id, { name });
        if (!updated) throw new Error("Category not found");
        return updated;
    }

    async deleteCategory(id, userId) {
        await this.getCategoryById(id, userId);

        const count = await this.noteRepository.countByCategoryId(id);
        if (count > 0) {
            throw new Error("Cannot delete category: notes are still using it");
        }

        const deleted = await this.categoryRepository.delete(id);
        if (!deleted) throw new Error("Category not found");
        return { message: "Category deleted successfully" };
    }
}
