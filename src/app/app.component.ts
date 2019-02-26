import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { HttpService } from './services/httpService';
import { Task } from './models/Task';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	tasksMap: Map<Task, Task[]> = new Map();
	tasks: Task[] = null;

	constructor(private httpService: HttpService,
		private snackBar: MatSnackBar) {
	}

	ngOnInit() {
		this.assignTasks();
	}

	assignTasks(): void {
		this.httpService.get().subscribe(
			jsonData => {
				this.tasksMap = new Map();

				jsonData.forEach(task => {
					let newTask = new Task(task.parent_id, task._id, task.name);

					if (!task.parent_id) { //doesn't have parent, is main task
						this.tasksMap.set(newTask, []);
					} else { // is subtask
						this.tasksMap.forEach((value, key) => {
							if (key._id === task.parent_id) {
								value.push(newTask);
							}
						});
					}

				});

				this.tasks = Array.from(this.tasksMap.keys());
			},
			err => {
				console.log(err);
			}
		);

	}

	addEmptyTask(parentTask?: Task) {
		if (parentTask) {

			if (parentTask._id) {
				let subtasks = this.tasksMap.get(parentTask);
				let newTask = new Task(parentTask._id);
				subtasks.push(newTask);
			} else {
				this.openSnackbar('Please save parent task');
			}

		} else {
			let newTask = new Task();
			this.tasksMap.set(newTask, []);
			this.tasks = Array.from(this.tasksMap.keys());
		}
	}

	save(task: Task) {
		if (!task._id) { // new task, should be saved
			this.httpService.post(task).subscribe(
				jsonData => {
					this.openSnackbar('Task\'s been saved');
					this.assignTasks();
				},
				err => {
					console.log(err);
				}
			);
		} else { // not new task, should be updated
			let updatedTask = {
				name: task.name
			}
			this.httpService.patch(updatedTask, task._id).subscribe(
				jsonData => {
					this.openSnackbar('Task\'s been updated');
					this.assignTasks();
				},
				err => {
					console.log(err);
				}
			);
		}
	}

	delete(task: Task): void {
		if (task._id) { // task that is stored in db
			this.httpService.delete(task._id).subscribe(
				jsonData => {
					this.openSnackbar('Task\'s been deleted');
					this.assignTasks();
				},
				err => {
					console.log(err);
				}
			);
		} else {
			this.tasksMap.delete(task);
			this.assignTasks();
		}
	}

	openSnackbar(message: string) {
		this.snackBar.open(message, null, {
			panelClass: ['snackbar'],
			duration: 3000,
			verticalPosition: 'bottom',
			horizontalPosition: 'right'
		});
	}
}