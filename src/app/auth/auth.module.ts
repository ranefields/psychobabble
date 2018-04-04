import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ROUTES } from './auth.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './../_imports/material.module';

import { ChangePasswordComponent } from './change-password/change-password.component';
import { LoginComponent } from './login/login.component';
import { NewAdminComponent } from './new-admin/new-admin.component';
import { RegisterComponent } from './register/register.component';
import { ResetComponent } from './reset/reset.component';
import { VerifyComponent } from './verify/verify.component';
import { FormCardComponent } from './forms/form-card/form-card.component';
import { FormHeaderComponent } from './forms/form-header/form-header.component';
import { FormSubmitButtonComponent } from './forms/form-submit-button/form-submit-button.component';

import { AuthService } from './auth.service';
import { RegisterService } from './register/register.service';
import { AuthGuardService } from './auth-guard.service';
import { LoginGuardService } from './login-guard.service';
import { VerifyGuardService } from './verify-guard.service';
import {
  UsernameValidatorDirective,
  PasswordValidatorDirective,
  ConfirmPasswordValidatorDirective,
 } from './form-validator.directives';
import { FormContentComponent } from './forms/form-content/form-content.component';

@NgModule({
  declarations: [
    ChangePasswordComponent,
    LoginComponent,
    NewAdminComponent,
    RegisterComponent,
    ResetComponent,
    VerifyComponent,
    UsernameValidatorDirective,
    PasswordValidatorDirective,
    ConfirmPasswordValidatorDirective,
    FormCardComponent,
    FormHeaderComponent,
    FormSubmitButtonComponent,
    FormContentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(ROUTES),
  ],
  providers: [
    AuthService,
    RegisterService,
    AuthGuardService,
    LoginGuardService,
    VerifyGuardService,
  ],
  exports: []
})
export class AuthModule { }
