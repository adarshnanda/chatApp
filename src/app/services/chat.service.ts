
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';

import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';

import { ChatMessage } from '../models/chat-message.model';

@Injectable()
export class ChatService {
  chatMessages: FirebaseListObservable<ChatMessage[]>;
  chatMessage: ChatMessage;
  user:firebase.User;
  userName:Observable<string>;

  constructor( private db: AngularFireDatabase, private afAuth: AngularFireAuth ) {
        this.afAuth.authState.subscribe(auth => {
          if (auth !== undefined && auth !== null) {
            this.user = auth;
            this.getUser().subscribe(temp=>{
              this.userName = temp.displayName;
            });
          }
        });
    }

  getUser(){
    const userId = this.user.uid;
    const path = `/users/${userId}`;
    return this.db.object(path);

  }


  getUsers(){
    const path = '/users';
    return this.db.list(path);
  }

  
  sendMessage(msg: string){
  	const timeStamp = this.getTimeStamp();
  	const email = this.user.email;
  	this.chatMessages = this.getChatMessages();
  	this.chatMessages.push({
  		message:msg,
  		timeSent: timeStamp,
  		userName: this.userName,
  		email: email
  	});
  }

  getTimeStamp() {
    const now = new Date();
    const date = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();
    const time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();

    return (date + ' ' + time);
  }


  getChatMessages(): FirebaseListObservable<ChatMessage[]> {
    // query to create our message feed binding
    return this.db.list('messages', {
      query: {
        limitToLast: 25,
        orderByKey: true
      }
    });
  }

}
