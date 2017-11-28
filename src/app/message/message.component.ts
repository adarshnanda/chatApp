import { Component, OnInit, Input} from '@angular/core';
import {ChatService} from '../services/chat.service';
import {AuthService} from '../services/auth.service';
import { ChatMessage } from '../models/chat-message.model';


@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
	@Input() chatMessage:ChatMessage;
	userName: string;
	userEmail:string;
	messageContent: string;
	timeStamp: Date = new Date();
	isOwnMessage:Boolean;
	ownEmail: string;
	constructor(private authService: AuthService) {
    	authService.authUser().subscribe(user => {
      	this.ownEmail = user.email;
      	this.isOwnMessage = this.ownEmail === this.userEmail;
    	});
  	}

	ngOnInit(chatMessage = this.chatMessage) {
		this.messageContent = chatMessage.message;
		this.userName = chatMessage.userName;
		this.userEmail = chatMessage.email;
		this.timeStamp = chatMessage.timeSent;
	}

}
