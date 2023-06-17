import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Department } from 'src/app/models/Department';
import { DepartmentService } from 'src/app/services/department.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent {
  departmentForm!: FormGroup;
  isEditing = false;
  departments?: Department[];

  constructor(
    private formBuilder: FormBuilder,
    private departmentService: DepartmentService
  ) { }

  ngOnInit(): void {
    this.departmentForm = this.formBuilder.group({
      id: [null],
      departmentName: ['', Validators.required],
      location: ['', Validators.required]
    });

    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe((departments) => {
      this.departments = departments;
    });
  }

  onSubmit(): void {
    if (this.departmentForm?.invalid) {
      return;
    }

    const department: Department = this.departmentForm?.value;
    if (this.isEditing) {
      this.departmentService.updateDepartment(department).subscribe(() => {
        this.loadDepartments();
        this.departmentForm?.reset();
      }, error => {
        // Handle error
      });
    } else {
      this.departmentService.createDepartment(department).subscribe(() => {
        this.loadDepartments();
        this.departmentForm?.reset();
      }, error => {
        // Handle error
      });
    }
  }

  editDepartment(department: Department): void {
    this.isEditing = true;
    this.departmentForm?.patchValue(department);
  }

  deleteDepartment(id: number): void {
    if (confirm('Are you sure you want to delete this department?')) {
      this.departmentService.deleteDepartment(id).subscribe(() => {
        this.loadDepartments();
      }, error => {
        // Handle
      })
    }
  }
}