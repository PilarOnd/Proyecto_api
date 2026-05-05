import CategoryModel from "./category.model.js";

export default class CategoryMongoRepository {
    async save(categoryEntity) {
        const doc = new CategoryModel({
            name: categoryEntity.name,
            userId: categoryEntity.userId,
        });
        const saved = await doc.save();
        return saved.toObject();
    }

    async findAllByUserId(userId) {
        const docs = await CategoryModel.find({ userId }).sort({ name: 1 });
        return docs.map((d) => d.toObject());
    }

    async findById(id) {
        const doc = await CategoryModel.findById(id);
        return doc ? doc.toObject() : null;
    }

    async update(id, data) {
        const doc = await CategoryModel.findByIdAndUpdate(id, data, { new: true });
        return doc ? doc.toObject() : null;
    }

    async delete(id) {
        const doc = await CategoryModel.findByIdAndDelete(id);
        return doc ? true : null;
    }
}
