import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Subject, takeUntil, finalize } from 'rxjs';

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

interface EstimationRequest {
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
  // State management
  estimations: Estimation[] = [];
  selectedEstimation: Estimation | null = null;
  isLoading = false;
  showForm = true;
  sidebarCollapsed = false;

  // Form data
  formData: EstimationRequest = this.getEmptyForm();

  readonly categories = [
    'Smartphone',
    'Laptop',
    'Tablet',
    'Desktop',
    'Smartwatch',
    'Camera',
    'Console',
    'TV',
    'Other'
  ];

  // Configuration
  private readonly apiUrl = 'http://localhost:8080/api/estimations';
  private destroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  // Lifecycle hooks
  ngOnInit(): void {
    this.loadEstimations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Data loading
  loadEstimations(): void {
    this.http.get<Estimation[]>(this.apiUrl)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.estimations = this.sortByDate(data);
          this.updateSelectedEstimation();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Failed to load estimations:', error);
          this.showError('Unable to load estimations. Please refresh the page.');
        }
      });
  }

  // Form submission
  submitEstimation(): void {
    if (!this.isFormValid()) {
      this.showError('Please fill in all required fields.');
      return;
    }

    this.isLoading = true;
    this.cdr.detectChanges();

    this.http.post<Estimation>(this.apiUrl, this.formData)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (newEstimation) => {
          this.estimations = [newEstimation, ...this.estimations];
          this.selectedEstimation = newEstimation;
          this.showForm = false;
          this.formData = this.getEmptyForm();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Failed to create estimation:', error);
          this.showError('Unable to create estimation. Please try again.');
        }
      });
  }

  // User actions
  selectEstimation(estimation: Estimation): void {
    this.selectedEstimation = estimation;
    this.showForm = false;
    this.cdr.detectChanges();
  }

  newEstimation(): void {
    this.selectedEstimation = null;
    this.showForm = true;
    this.formData = this.getEmptyForm();
    this.cdr.detectChanges();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.cdr.detectChanges();
  }

  deleteEstimation(id: number, event: Event): void {
    event.stopPropagation();

    if (!confirm('Are you sure you want to delete this estimation?')) {
      return;
    }

    this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.estimations = this.estimations.filter(e => e.id !== id);
          if (this.selectedEstimation?.id === id) {
            this.newEstimation();
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Failed to delete estimation:', error);
          this.showError('Unable to delete estimation. Please try again.');
        }
      });
  }

  // Validation
  isFormValid(): boolean {
    return !!(
      this.formData.itemName?.trim() &&
      this.formData.brand?.trim() &&
      this.formData.category &&
      this.formData.year >= 1990 &&
      this.formData.year <= new Date().getFullYear() &&
      this.formData.conditionRating >= 1 &&
      this.formData.conditionRating <= 10
    );
  }

  // Formatting helpers
  getConditionLabel(rating: number): string {
    if (rating >= 9) return 'Excellent';
    if (rating >= 7) return 'Very Good';
    if (rating >= 5) return 'Good';
    if (rating >= 3) return 'Fair';
    return 'Poor';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';

    const date = new Date(dateStr);
    const dateFormat = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const timeFormat = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    return `${dateFormat} ${timeFormat}`;
  }

  // Private helpers
  private sortByDate(estimations: Estimation[]): Estimation[] {
    return [...estimations].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  private updateSelectedEstimation(): void {
    if (!this.selectedEstimation) return;

    const updated = this.estimations.find(e => e.id === this.selectedEstimation!.id);
    if (updated) {
      this.selectedEstimation = updated;
      this.cdr.detectChanges();
    }
  }

  private getEmptyForm(): EstimationRequest {
    return {
      itemName: '',
      brand: '',
      category: '',
      year: new Date().getFullYear(),
      conditionRating: 5
    };
  }

  private showError(message: string): void {
    alert(message);
  }
}
