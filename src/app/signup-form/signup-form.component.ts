import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent {
	email: string;
	displayName: string;
	errorMessage: string;
	password: string;
	confirmPassword: string;

  constructor(private authService: AuthService, private router:Router) { }


  signUp(){
  	const email = this.email;
  	const password = this.password;
  	const displayName = this.displayName;
  	if(password!==this.confirmPassword){
  		this.errorMessage = 'Both passwords should match';
  		this.password = this.confirmPassword = null;
  	}else{
  		this.errorMessage =  null;
  		this.authService.signUp(email, password, displayName).then(
  		(resolve)=>{
  				this.router.navigate(['chat']);
  		},(error)=>{
    		this.errorMessage = error.message
    	});
  	}
  	
  }
}
