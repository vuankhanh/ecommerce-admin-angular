import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../shared/modules/material';
import { AuthService } from '../../service/api/auth.service';
import { LocalStorageService } from '../../service/local-storage.service';
import { LocalStorageKey } from '../../shared/constant/local_storage.constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class LoginComponent {
  loginForm!: FormGroup;
  subscription: Subscription = new Subscription();
  constructor(
    private readonly router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly localStorageService: LocalStorageService,
  ) {

  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required],
    })
  }

  submit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.controls['email'].value;
      const password = this.loginForm.controls['password'].value;
      this.subscription.add(
        this.authService.login(email, password).subscribe(token => {
          this.localStorageService.set(LocalStorageKey.TOKEN, token);
          this.router.navigate(['']);
        })
      )
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
