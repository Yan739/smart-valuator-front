import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatComponent } from './chat.component';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load estimations on init', () => {
    const mockEstimations = [
      {
        id: 1,
        itemName: 'iPhone 12',
        brand: 'Apple',
        category: 'Smartphone',
        year: 2020,
        conditionRating: 8,
        estimatedPrice: 450,
        aiDescription: 'Test description',
        createdAt: '2024-01-01T12:00:00'
      }
    ];

    component.ngOnInit();

    const req = httpMock.expectOne('http://localhost:8080/api/estimations');
    expect(req.request.method).toBe('GET');
    req.flush(mockEstimations);

    expect(component.estimations.length).toBe(1);
    expect(component.estimations[0].itemName).toBe('iPhone 12');
  });

  it('should validate form correctly', () => {
    component.formData = {
      itemName: '',
      brand: '',
      category: '',
      year: 2024,
      conditionRating: 5
    };
    expect(component.isFormValid()).toBeFalsy();

    component.formData = {
      itemName: 'iPhone 13',
      brand: 'Apple',
      category: 'Smartphone',
      year: 2021,
      conditionRating: 8
    };
    expect(component.isFormValid()).toBeTruthy();
  });

  it('should get correct condition label', () => {
    expect(component.getConditionLabel(10)).toBe('Excellent');
    expect(component.getConditionLabel(8)).toBe('Very Good');
    expect(component.getConditionLabel(6)).toBe('Good');
    expect(component.getConditionLabel(4)).toBe('Fair');
    expect(component.getConditionLabel(2)).toBe('Poor');
  });

  it('should toggle sidebar state', () => {
    expect(component.sidebarCollapsed).toBeFalsy();
    component.toggleSidebar();
    expect(component.sidebarCollapsed).toBeTruthy();
    component.toggleSidebar();
    expect(component.sidebarCollapsed).toBeFalsy();
  });

  it('should format date correctly', () => {
    const dateStr = '2024-01-15T14:30:00';
    const formatted = component.formatDate(dateStr);
    expect(formatted).toContain('15/01/2024');
    expect(formatted).toContain('14:30');
  });

  it('should reset to new estimation form', () => {
    component.selectedEstimation = {
      id: 1,
      itemName: 'Test',
      brand: 'Test',
      category: 'Smartphone',
      year: 2020,
      conditionRating: 5,
      estimatedPrice: 100,
      aiDescription: 'Test',
      createdAt: '2024-01-01'
    };
    component.showForm = false;

    component.newEstimation();

    expect(component.selectedEstimation).toBeNull();
    expect(component.showForm).toBeTruthy();
    expect(component.formData.itemName).toBe('');
  });
});
