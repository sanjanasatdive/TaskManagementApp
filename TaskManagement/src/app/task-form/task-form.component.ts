import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  
  taskForm: FormGroup;
  isEdit: boolean = false;
  taskId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.taskId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.taskId) {
      this.isEdit = true;
      this.taskService.getTask(this.taskId).subscribe(task => {
        if (task) {
          this.taskForm.patchValue(task);
        }
      });
    }
  }

  onSubmit(): void {
    const task: Task = this.taskForm.value;
    if (this.isEdit && this.taskId) {
      task.id = this.taskId;
      this.taskService.updateTask(task);
    } else {
      this.taskService.addTask(task);
    }
    this.router.navigate(['/']);
  }
}
