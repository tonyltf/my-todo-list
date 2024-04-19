import { NewTodo } from "../types";

export class TodoModel {
    id!: string;

    name!: string;

    userId!: string;

    isEnabled!: boolean;

    isCompleted!: boolean;

    completedAt!: Date | null;

    createdAt!: Date;

    updatedAt!: Date;

    constructor(data: NewTodo) {
        this.name = data.name
        this.userId = data.userId;
        this.isEnabled = true;
        this.isCompleted = false;
        this.completedAt = null;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}