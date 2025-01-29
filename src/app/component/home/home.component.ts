import { Component, inject } from '@angular/core';
import { Employee } from '../../model/Employee';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  isadding = false;
  employeeForm!: FormGroup;
  employeeList: Employee[] = [];
  isEditMode = false;
  selectedEmployee: Employee | null = null;

  router = inject(Router);

  private _fields = [
    { name: 'empId', label: 'Employee ID', type: 'text', placeholder: 'Enter Employee ID', error: 'Employee ID is required.' },
    { name: 'empName', label: 'Employee Name', type: 'text', placeholder: 'Enter Employee Name', error: 'Employee Name is required.' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email', error: 'Valid email is required.' },
    { name: 'city', label: 'City', type: 'text', placeholder: 'Enter City', error: 'City is required.' },
    { name: 'salary', label: 'Salary', type: 'number', placeholder: 'Enter Salary', error: 'Salary is required.' },
    { name: 'state', label: 'State', type: 'text', placeholder: 'Enter State', error: 'State is required.' },
  ];

  public get fields() {
    return this._fields;
  }
  public set fields(value) {
    this._fields = value;
  }

  constructor(private fb: FormBuilder) {
    const data = localStorage.getItem("empData");
    if (data != null) {
      this.employeeList = JSON.parse(data);
    }
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.employeeForm = this.fb.group({
      empId: ['', Validators.required],
      empName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      city: ['', Validators.required],
      salary: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      state: ['', Validators.required]
    });
  }

  addEmployee(): void {
    this.isadding = true;
    this.isEditMode = false;
    this.employeeForm.reset();
  }

  editEmployee(employee: Employee): void {
    this.isadding = true;
    this.isEditMode = true;
    this.selectedEmployee = employee;
    this.employeeForm.patchValue(employee);
  }

  deleteEmployee(empId: string): void {
    this.employeeList = this.employeeList.filter(emp => emp.empId !== empId);
    localStorage.setItem("empData", JSON.stringify(this.employeeList));
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      const formData = this.employeeForm.value;

      if (this.isEditMode) {
        this.employeeList = this.employeeList.map(emp =>
          emp.empId === this.selectedEmployee?.empId ? formData : emp
        );
      } else {
        this.employeeList.unshift(formData);
      }

      localStorage.setItem("empData", JSON.stringify(this.employeeList));
      this.resetForm();
    }
  }

  resetForm(): void {
    this.employeeForm.reset();
    this.isadding = false;
    this.isEditMode = false;
    this.selectedEmployee = null;
  }

  cancel(): void {
    this.isadding = false;
  }
}
