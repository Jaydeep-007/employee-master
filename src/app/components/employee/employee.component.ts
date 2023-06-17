import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Department } from 'src/app/models/Department';
import { Employee } from 'src/app/models/Employee';
import { DepartmentService } from 'src/app/services/department.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  employeeForm!: FormGroup;
  isEditing = false;
  employees?: Employee[];
  departments: Department[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) { }

  ngOnInit(): void {
    this.employeeForm = this.formBuilder.group({
      id: [null],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      departmentId: ['', Validators.required]
    });

    this.loadEmployees();
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe((departments) => {
      this.departments = departments;
    });
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe((employees) => {
      this.employees = employees;
    });
  }

  onSubmit(): void {
    if (this.employeeForm?.invalid) {
      return;
    }

    const employee: Employee = this.employeeForm?.value;
    if (this.isEditing) {
      this.employeeService.updateEmployee(employee).subscribe(() => {
        this.loadEmployees();
        this.employeeForm?.reset();
      }, error => {
        // Handle error
      });
    } else {
      this.employeeService.createEmployee(employee).subscribe(() => {
        this.loadEmployees();
        this.employeeForm?.reset();
      }, error => {
        // Handle error
      });
    }
  }

  editEmployee(employee: Employee): void {
    this.isEditing = true;
    this.employeeForm?.patchValue(employee);
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.loadEmployees();
      }, error => {
        // Handle error
      })
    }
  }
}