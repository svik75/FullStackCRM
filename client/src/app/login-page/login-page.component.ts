import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { MaterialService } from '../shared/classes/material.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  aSub: Subscription;
  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute) {

  }
  // ---------------------------------------------
  ngOnInit() {
    const rg = 'registered';
    const acd = 'accessDenied';
    const sesf = 'sessionFailed';

    this.form = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required, Validators.minLength(6)])
      }
    );
    this.route.queryParams.subscribe((params: Params) => {
      if (params[rg]) {// registered
        MaterialService.toast('Теперь вы можете войти в систему!');
      } else if (params[acd]) {// not registered
        MaterialService.toast('Для начала авторизуйтесь  в системе!');
      } else if (params[sesf]) {
        MaterialService.toast('Пожалуйста, войдите в систему заново!');
      }
    });
  }
  // ------------------------------------------------
  ngOnDestroy() {
    if (this.aSub) {
     this.aSub.unsubscribe();
    }

  }
  // -----------------------------------------------
  onSubmit() {
    /*const user = {
      email: this.form.value.email,
      password: this.form.value.password
    }*/
    this.form.disable();
    this.aSub = this.auth.login(this.form.value).subscribe(
      () => this.router.navigate(['/overview']),
      error => { MaterialService.toast(error.error.message); this.form.enable(); }
    );
  }

}
