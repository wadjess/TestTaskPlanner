export class Task {
    _id: string = null;
    name: string = null;
    parent_id: string = null;

    constructor(parent_id?: string, _id?: string, name?: string) {
        this.parent_id = parent_id || null;
        this._id = _id || null;
        this.name = name || null;
    }
}