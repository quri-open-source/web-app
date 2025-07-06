import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl} from "@angular/forms";
import {AuthenticationService} from '../../services/authentication.service';
import {SignUpRequest} from "../../model/sign-up.request";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatLabel, MatPrefix, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {RouterLink} from "@angular/router";
import { LanguageSwitcherComponent } from '../../../shared/components/language-switcher.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ManufacturerService } from '../../../order-fulfillments/services/manufacturer.service';
import { CreateManufacturerRequest } from '../../../order-fulfillments/services/manufacturer.response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    MatCardHeader,
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatButton,
    MatIconButton,
    MatIcon,
    MatPrefix,
    MatSuffix,
    RouterLink,
    LanguageSwitcherComponent,
    TranslateModule,
    MatSelectModule,
    MatOptionModule,
    CommonModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {
  form!: FormGroup;
  manufacturerForm!: FormGroup;
  roles: Array<{ label: string; value: string }> = [];
  selectedRole = 'customer';
  submitted: boolean = false;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;
  step: 1 | 2 = 1;
  createdUserId: string | null = null;

  constructor(
    private builder: FormBuilder,
    private authenticationService: AuthenticationService,
    private translateService: TranslateService,
    private manufacturerService: ManufacturerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roles = [
      { label: this.translateService.instant('signup.roleField.customer'), value: 'customer' },
      { label: this.translateService.instant('signup.roleField.manufacturer'), value: 'manufacturer' }
    ];
    this.form = this.builder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['customer', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.manufacturerForm = this.builder.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.submitted = true;

    const username = this.form.value.username;
    const password = this.form.value.password;
    const role = this.form.value.role;
    let roles = ['ROLE_USER'];
    if (role === 'manufacturer') {
      roles.push('ROLE_MANUFACTURER');
    }
    const signUpRequest = new SignUpRequest(username, password, roles);

    this.authenticationService.signUp(signUpRequest).subscribe({
      next: (response: any) => {
        if (role === 'manufacturer' && response?.id) {
          this.createdUserId = response.id;
          this.step = 2;
        } else {
          this.router.navigate(['/home']);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onManufacturerSubmit() {
    if (this.manufacturerForm.invalid || !this.createdUserId) return;
    this.isLoading = true;
    const req: CreateManufacturerRequest = {
      userId: this.createdUserId,
      ...this.manufacturerForm.value
    };
    this.manufacturerService.create(req).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  passwordMatchValidator(control: AbstractControl): {[key: string]: any} | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  isInvalidControl(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  errorMessagesForControl(form: FormGroup, controlName: string): string {
    const control = form.get(controlName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return this.translateService.instant('signup.validation.required', { field: this.getFieldName(controlName) });
    }

    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return this.translateService.instant('signup.validation.minlength', {
        field: this.getFieldName(controlName),
        length: requiredLength
      });
    }

    if (controlName === 'confirmPassword' && form.errors?.['passwordMismatch']) {
      return this.translateService.instant('signup.validation.passwordMismatch');
    }

    return '';
  }

  private getFieldName(controlName: string): string {
    const fieldNames: { [key: string]: string } = {
      'username': 'signup.username',
      'password': 'signup.password',
      'confirmPassword': 'signup.confirmPassword'
    };
    return this.translateService.instant(fieldNames[controlName]) || controlName;
  }


}
