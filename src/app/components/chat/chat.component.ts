import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatIcon } from "@angular/material/icon";
import { MatList, MatListItem } from "@angular/material/list";
import { MatCardContent, MatCard, MatCardActions } from "@angular/material/card";
import { MatFormField } from "@angular/material/input";
import { CommonModule } from '@angular/common';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

interface ValuationRequest {
  itemDescription: string;
  yearOfManufacture: number;
  condition: string;
}

interface ValuationResponse {
  description: string;
  profitability: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, MatIcon, MatList, MatListItem, MatCardContent, MatCard, MatCardActions, MatFormField],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  messages: Message[] = [];
  userInput = '';
  isLoading = false;

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    // Add user message
    this.messages.push({ sender: 'user', text: this.userInput });

    const input = this.userInput;
    const itemMatch = input.match(/Item:\s*(.+?)(?:,|$)/i);
    const yearMatch = input.match(/Year:\s*(\d+)/i);
    const conditionMatch = input.match(/Condition:\s*(.+?)(?:,|$)/i);

    if (!itemMatch || !yearMatch || !conditionMatch) {
      this.messages.push({ sender: 'bot', text: 'Please provide input in the format: "Item: [description], Year: [year], Condition: [condition]"' });
      this.userInput = '';
      return;
    }

    const request: ValuationRequest = {
      itemDescription: itemMatch[1].trim(),
      yearOfManufacture: parseInt(yearMatch[1]),
      condition: conditionMatch[1].trim()
    };

    this.isLoading = true;
    this.http.post<ValuationResponse>('http://localhost:8080/api/valuate', request).subscribe(
      response => {
        this.messages.push({ sender: 'bot', text: `Description: ${response.description}\nProfitability: ${response.profitability}` });
        this.isLoading = false;
      },
      error => {
        this.messages.push({ sender: 'bot', text: 'Error: Unable to get valuation. Please try again.' });
        this.isLoading = false;
      }
    );

    this.userInput = '';
  }
}