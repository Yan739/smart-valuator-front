import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Estimation {
  id: number;
  itemName: string;
  brand: string;
  category: string;
  year: number;
  conditionRating: number;
  estimatedPrice: number | null;
  aiDescription: string;
  createdAt: string;
}

interface EstimationForm {
  itemName: string;
  brand: string;
  category: string;
  year: number;
  conditionRating: number;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  estimations: Estimation[] = [];
  selectedEstimation: Estimation | null = null;
  showForm = true;
  isLoading = false;
  sidebarCollapsed = false;

  formData: EstimationForm = {
    itemName: '',
    brand: '',
    category: '',
    year: new Date().getFullYear(),
    conditionRating: 7
  };

  categories = ['Smartphone', 'Laptop', 'Tablette', 'Montre connectée', 'Console de jeu', 'Écouteurs', 'Appareil photo', 'Autre'];

  private readonly apiUrl = 'http://localhost:8080/api/estimations';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadEstimations();
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  newEstimation() {
    this.selectedEstimation = null;
    this.showForm = true;
    this.formData = { itemName: '', brand: '', category: '', year: new Date().getFullYear(), conditionRating: 7 };
  }

  selectEstimation(estimation: Estimation) {
    this.selectedEstimation = estimation;
    this.showForm = false;
  }

  isFormValid(): boolean {
    return !!(this.formData.itemName && this.formData.brand && this.formData.category && this.formData.year);
  }

  submitEstimation() {
    if (!this.isFormValid()) return;
    this.isLoading = true;

    this.http.post<Estimation>(this.apiUrl, this.formData).subscribe({
      next: (result) => {
        this.estimations.unshift(result);
        this.selectedEstimation = result;
        this.showForm = false;
        this.isLoading = false;
      },
      error: () => {
        // Backend may have saved despite timeout — reload history
        this.loadEstimations();
        this.showForm = false;
        this.isLoading = false;
      }
    });
  }

  deleteEstimation(id: number, event: Event) {
    event.stopPropagation();
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.estimations = this.estimations.filter(e => e.id !== id);
      if (this.selectedEstimation?.id === id) {
        this.selectedEstimation = null;
        this.showForm = true;
      }
    });
  }

  priceLabel(estimation: Estimation): string {
    if (estimation.estimatedPrice !== null) return `€${Number(estimation.estimatedPrice).toFixed(2)}`;
    if (estimation.aiDescription?.startsWith('Error')) return 'Indisponible';
    return 'Calcul en cours...';
  }

  getConditionLabel(rating: number): string {
    if (rating <= 2) return 'Mauvais';
    if (rating <= 4) return 'Passable';
    if (rating <= 6) return 'Correct';
    if (rating <= 8) return 'Bon';
    return 'Excellent';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  private loadEstimations() {
    this.http.get<Estimation[]>(this.apiUrl).subscribe({
      next: (data) => { this.estimations = data.reverse(); },
      error: () => {}
    });
  }
}
