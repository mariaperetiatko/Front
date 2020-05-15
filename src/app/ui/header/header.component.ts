import { SchedulerComponent } from './../../scheduler/scheduler.component';
import { UserService } from './../../user.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isCollapsed = false;
  linkVisible = ' ';
  // signUpString = 'Sing Up';
  LoginString = 'Login';
  isMember = (localStorage.getItem('role') === 'Member');
  isAdmin = (localStorage.getItem('role') === 'Admin');

  constructor(private userService: UserService, private router: Router,
    private activatedRoute: ActivatedRoute,  public translate: TranslateService) {
      translate.addLangs(['en', 'uk']);
    translate.setDefaultLang('en');


    //const browserLang = translate.getBrowserLang();
    translate.use(localStorage.getItem('lang'));
     }

     setLang(val: string) {
      this.translate.use(val);
      localStorage.setItem('lang', val)
     }

     getlang(): string {
       return localStorage.getItem('lang');
     }

  ngOnInit() {
    this.visualManagement();
  }

  visualManagement() {
    const pages = document.getElementsByClassName('jumping');
    const singUpButton = document.getElementById('signUp');

    if (this.userService.isLoggedIn()) {

      for (let i = 0; i < pages.length; i++) {
        pages[i].className = pages[i].className.replace(' d-none', ' d-block');
      }

      singUpButton.className = singUpButton.className.replace(' d-block', ' d-none');
      this.LoginString = 'Logout';

    } else {

      for (let i = 0; i < pages.length; i++) {
        pages[i].className = pages[i].className.replace(' d-block', ' d-none');
      }

      singUpButton.className = singUpButton.className.replace(' d-none', ' d-block');
      this.LoginString = 'Login';
    }
  }

  logOnClickAction() {
    if (this.userService.isLoggedIn()) {
      this.logout();
    } else {
      this.login();
    }
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/welcome']);
    this.visualManagement();
  }

  login() {
   this.router.navigate(['/login']);
  }

  signUp() {
    this.router.navigate(['/register']);
   }

}
