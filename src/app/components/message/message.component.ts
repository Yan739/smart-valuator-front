import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="{'user-message': message.isUser, 'bot-message': !message.isUser}">
      <p>{{ message.text }}</p>
      <small>{{ message.timestamp | date:'shortTime' }}</small>
    </div>
  `,
  styles: [`
    .user-message {
      text-align: right;
      background-color: #d1ffd6;
      margin: 0.5rem 0;
      padding: 0.5rem;
      border-radius: 0.5rem;
    }

    .bot-message {
      text-align: left;
      background-color: #f1f1f1;
      margin: 0.5rem 0;
      padding: 0.5rem;
      border-radius: 0.5rem;
    }

    p {
      margin: 0;
    }

    small {
      font-size: 0.7rem;
      color: gray;
    }
  `]
})
export class MessageComponent {
  @Input() message!: Message;
}
