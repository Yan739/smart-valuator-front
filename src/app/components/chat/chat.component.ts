import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MessageComponent } from '../message/message.component';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ValuationRequest {
  description: string;
  yearOfManufacture: number;
  condition: string;
}

interface ValuationResponse {
  description: string;
  estimatedProfitability: number;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MessageComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  currentMessage = '';
  showForm = false;
  isLoading = false;
  valuationRequest: ValuationRequest = {
    description: '',
    yearOfManufacture: 0,
    condition: ''
  };

  private messageId = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.addBotMessage('Hello! I\'m Smart Valuator. I can help you get detailed descriptions and profitability estimates for electronic items. Would you like to valuate an item?');
  }

  sendMessage() {
    if (this.currentMessage.trim()) {
      this.addUserMessage(this.currentMessage);
      this.processMessage(this.currentMessage);
      this.currentMessage = '';
    }
  }

  private processMessage(message: string) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('valuate') || lowerMessage.includes('value') || lowerMessage.includes('yes')) {
      this.showForm = true;
      this.addBotMessage('Great! Please fill out the form below with details about your electronic item.');
    } else if (lowerMessage.includes('help')) {
      this.addBotMessage('I can provide detailed descriptions and estimated profitability for electronic items based on their year of manufacture and condition. Just say "valuate" to get started!');
    } else {
      this.addBotMessage('I\'m not sure what you mean. Say "valuate" if you\'d like to get an item valuation, or "help" for more information.');
    }
  }

  submitValuation() {
    if (this.valuationRequest.description && this.valuationRequest.yearOfManufacture && this.valuationRequest.condition) {
      this.isLoading = true;
      this.showForm = false;

      this.http.post<ValuationResponse>('http://localhost:8080/api/estimations', this.valuationRequest)
        .subscribe({
          next: (response) => {
            this.addBotMessage(`Item Description: ${response.description}\n\nEstimated Profitability: $${response.estimatedProfitability.toFixed(2)}`);
            this.isLoading = false;
            this.valuationRequest = { description: '', yearOfManufacture: 0, condition: '' };
          },
          error: (error) => {
            console.error('Error:', error);
            this.addBotMessage('Sorry, I encountered an error while processing your request. Please try again.');
            this.isLoading = false;
            this.showForm = true;
          }
        });
    }
  }

  private addUserMessage(text: string) {
    this.messages.push({
      id: ++this.messageId,
      text,
      isUser: true,
      timestamp: new Date()
    });
  }

  private addBotMessage(text: string) {
    this.messages.push({
      id: ++this.messageId,
      text,
      isUser: false,
      timestamp: new Date()
    });
  }
}
