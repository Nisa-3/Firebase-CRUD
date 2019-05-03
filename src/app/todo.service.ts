import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

export interface Todo {
  id?: string;
  task: string;
  priority: number;
  createdAt: number;
}

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  private TodoCollection: AngularFirestoreCollection<Todo>;
  private todos: Observable<Todo[]>;
  constructor( db: AngularFirestore) {
    this.TodoCollection = db.collection<Todo>('todos');
    // to display the data in realtime and have all the information present when we need it we need to call the snapshotChanges() function
    this.todos = this.TodoCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }
  getTodos() {
    return this.todos;
  }
  getTodo(id) {
    return this.TodoCollection.doc<Todo>(id).valueChanges();
  }
  updateTodo(todo: Todo, id: string) {
    return this.TodoCollection.doc(id).update(todo);
  }
  addTodo(todo: Todo) {
    return this.TodoCollection.add(todo);
  }
  removeTodo(id) {
    return this.TodoCollection.doc(id).delete();
  }
}
