import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GraphqlService } from '../../services/graphql.service';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

@Component({
  standalone: true,
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css'],
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
})
export class EmployeeEditComponent implements OnInit {
  employeeForm: FormGroup;
  submitted = false;
  employeeId: string = '';
  photoPreview: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private gql: GraphqlService,
    public router: Router
  ) {
    this.employeeForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      designation: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(1000)]],
      department: ['', Validators.required],
      date_of_joining: ['', Validators.required],
      employee_photo: ['']
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    this.gql.getEmployeeById(this.employeeId).subscribe({
      next: (data) => {
        this.employeeForm.patchValue(data);
        this.photoPreview = data.employee_photo || null;
      },
      error: (err) => {
        console.error('Failed to load employee', err);
        alert('Failed to load employee data');
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.employeeForm.patchValue({ employee_photo: result });
        this.photoPreview = result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.employeeForm.invalid) return;

    this.gql.updateEmployee(this.employeeId, this.employeeForm.value).subscribe({
      next: () => {
        alert('Employee updated successfully!');
        this.router.navigate(['/employees']);
      },
      error: (err) => {
        console.error(err);
        alert('Update failed');
      }
    });
  }
}
