
export default class NoteEntity {
    constructor ({ id, title, content, imageUrl, isPrivate, password, userId, userid, categoryId }) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl || null;
        this.isPrivate = isPrivate || false;
        this.password = password || null;
        this.userId = userId || userid;
        this.categoryId = categoryId;
    }
 
}