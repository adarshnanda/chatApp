import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user.model';



@Injectable()
export class AuthService {
	private user: Observable<firebase.User>;
	private authState: any;
	get currentUserId(): string{
		return this.authState!==null?this.authState.uid:'';
	}
 	constructor( private db: AngularFireDatabase, private afAuth: AngularFireAuth, private router: Router ) {
 		this.user = afAuth.authState;
    }



    signUp(email: string, password: string, displayName:string){
    	return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    	.then((user)=>{
    		this.authState = user;
    		const status = 'online';
    		this.setUserData(email, displayName, status);
    	});

    }


    setUserData(email:string, displayname:string, status:string):void{
    	const path = `users/${this.currentUserId}`;
    	const data = {
    		email: email,
    		displayName: displayname,
    		status: status
    	};
    	this.db.object(path).update(data).catch(error=>console.log(error));
    }

    
    setUserStatus(status:string):void{
    	const path = `users/${this.currentUserId}`;
    	const data = {
    		status: status
    	};
    	this.db.object(path).update(data).catch(error=>console.log(error));
    }

    authUser(){
        return this.user;
    }

    logIn(email: string, password:string){
        return this.afAuth.auth.signInWithEmailAndPassword(email, password).then((user)=>{
            this.authState = user;
            const status = 'online';
            this.setUserStatus(status);
        });
    }

    logOut(){
      const status = 'offline';
      this.setUserStatus(status);
      this.afAuth.auth.signOut();
      this.router.navigate(['login']);
    }

}
