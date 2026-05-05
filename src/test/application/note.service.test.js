import NoteService from '../../application/use-cases/note.service.js';
import { jest } from '@jest/globals';

const mockNoteRepository = {
    save: jest.fn(),
    findByUserId: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

const mockMailService = {
    sendNoteEmail: jest.fn(),
};

const mockCategoryRepository = {
    findById: jest.fn(),
};

describe('NoteService - Pruebas Unitarias', () => {
    let noteService;

    beforeEach(() => {
        jest.clearAllMocks();
        noteService = new NoteService(mockNoteRepository, mockMailService, mockCategoryRepository);
    });

    test('Crear: debería crear y guardar una nota correctamente', async () => {
        const data = { title: 'Mi nota', content: 'Info', userId: 'user_123', categoryId: 'cat_1' };
        mockCategoryRepository.findById.mockResolvedValue({ userId: 'user_123', name: 'Cat' });
        mockNoteRepository.save.mockResolvedValue({ id: 1, ...data });

        const result = await noteService.createNote(data);

        expect(mockCategoryRepository.findById).toHaveBeenCalledWith('cat_1');
        expect(mockNoteRepository.save).toHaveBeenCalledTimes(1);
        expect(result.title).toBe('Mi nota');
    });

    test('Crear: debería fallar al crear una nota sin título', async () => {
        const data = { content: 'Sin titulo', categoryId: 'cat_1', userId: 'user_123' };
        await expect(noteService.createNote(data)).rejects.toThrow('Title and content are required');
    });

    test('Leer: debería devolver las notas de un usuario específico', async () => {
        const mockNotes = [{ title: 'Nota 1' }, { title: 'Nota 2' }];
        mockNoteRepository.findByUserId.mockResolvedValue(mockNotes);

        const result = await noteService.getNotesByUserId('user_123');

        expect(mockNoteRepository.findByUserId).toHaveBeenCalledWith('user_123');
        expect(result.length).toBe(2);
    });
});
