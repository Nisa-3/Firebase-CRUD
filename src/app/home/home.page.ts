import { Component } from '@angular/core';
import { Todo, TodoService } from '../todo.service';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  todo: Todo = {
    task: 'test',
    createdAt: new Date().getTime(),
    priority: 2
  };
 todoId = null;
  constructor(private route: ActivatedRoute, private todoService: TodoService, private loadingController: LoadingController) { }
   // tslint:disable-next-line:use-life-cycle-interface
   ngOnInit() {
    this.todoId = this.route.snapshot.params['id'];
    if (this.todoId)  {
      this.loadTodo();
    }
  }


  async loadTodo() {
    const loading = await this.loadingController.create({
      message: 'Loading Todo..'
    });
    await loading.present();
 
    this.todoService.getTodo(this.todoId).subscribe(res => {
      loading.dismiss();
      this.todo = res;
    });
  }

  async saveTodo() {
 
    const loading = await this.loadingController.create({
      message: 'Saving Todo..'
    });
    await loading.present();
 
    if (this.todoId) {
      this.todoService.updateTodo(this.todo, this.todoId).then(() => {
        loading.dismiss();
        // this.nav.goBack('home');
      });
    } else {
      this.todoService.addTodo(this.todo).then(() => {
        loading.dismiss();
        // this.nav.goBack('home');
      });
    }
  }

}
