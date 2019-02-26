import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/Task';

const httpOptions = {
	headers: new HttpHeaders({
		'Content-Type': 'application/json'
	})
};

@Injectable()
export class HttpService {
	route = 'http://ec2-18-185-4-4.eu-central-1.compute.amazonaws.com:2727/tasks';

	constructor(private http: HttpClient) {
	}

	get(): Observable<Task[]> {
		let url = this.route;
		return this.http.get<Task[]>(url, httpOptions);
	}

	post(task: Task): Observable<any> {
		let url = this.route;
		return this.http.post<any>(url, task, httpOptions);
	}

	delete(id: string): Observable<any> {
        let url = this.route + '/' + id;
		return this.http.delete<any>(url, httpOptions);
	}

	patch(updatedTask: any, id: string): Observable<any> {
        let url = this.route + '/' + id;
		return this.http.patch<any>(url, updatedTask, httpOptions);
	}
}