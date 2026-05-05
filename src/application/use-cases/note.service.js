// importante al trabajar con nuestros archivos debemos añadir al final .js requerido para ESM
import NoteEntity from "../../domain/entities/note.entity.js";

export default class NoteService {
    constructor(noteRepository, mailService, categoryRepository) {
        this.noteRepository = noteRepository;
        this.mailService = mailService;
        this.categoryRepository = categoryRepository;
    }

    async assertCategoryBelongsToUser(categoryId, userId) {
        const category = await this.categoryRepository.findById(categoryId);
        if (!category) throw new Error("Category not found");
        if (String(category.userId) !== String(userId)) {
            throw new Error("Category does not belong to this user");
        }
    }

    async createNote(data) {
        if (!data.title || !data.content) { throw new Error("Title and content are required"); }
        if (!data.categoryId) { throw new Error("Category is required"); }

        await this.assertCategoryBelongsToUser(data.categoryId, data.userId);

        const note = new NoteEntity(data);
        return await this.noteRepository.save(note);
    }

    async getNotesByUserId(userId){
        return await this.noteRepository.findByUserId(userId);
    }

    canManageNote(note, currentUser) {
        if (!currentUser) return false;
        if (currentUser.role === "admin") return true;
        return String(note.userId) === String(currentUser.id);
    }

    async updateNote(id, data, currentUser) {
        const note = await this.noteRepository.findById(id);
        if (!note) throw new Error("Note not found");
        if (!this.canManageNote(note, currentUser)) throw new Error("Forbidden");

        if (data.categoryId !== undefined && data.categoryId !== null && data.categoryId !== "") {
            await this.assertCategoryBelongsToUser(data.categoryId, currentUser.id);
        }

        const updatedNote = await this.noteRepository.update(id, data);
        return updatedNote;
    }

    async deleteNote(id, currentUser) {
        const note = await this.noteRepository.findById(id);
        if (!note) throw new Error("Note not found");
        if (!this.canManageNote(note, currentUser)) throw new Error("Forbidden");

        await this.noteRepository.delete(id);
        return { message: "Note deleted successfully" };
    }

    async shareNoteByEmail(noteId, targetEmail, currentUserId) {
        const note = await this.noteRepository.findById(noteId);
        if (!note) throw new Error("Note not found");
        
        // RESTRICCIÓN: Solo el dueño puede compartirla
        if (String(note.userId) !== String(currentUserId)) {
            throw new Error("Unauthorized: You can only share your own notes");
        }

        return await this.mailService.sendNoteEmail(targetEmail, note);
    }
}