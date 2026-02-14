# Smart Valuator

<div align="center">

![Angular](https://img.shields.io/badge/Angular-18-red?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4-brightgreen?logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-brightgreen)

</div>

---

## Description

A **premium AI-powered electronic item valuation platform** built with **Angular 18** and **Spring Boot 3.4** to provide instant, accurate price estimates for used electronics. This full-stack application demonstrates modern web development practices with a clean architecture and intelligent backend integration.

Features an elegant, minimalist design with real-time AI valuation, persistent data storage, and a reactive frontend architecture using RxJS for seamless state management.

---

## Features

- **AI-Powered Valuation Engine**
  - Real-time price estimation using Claude AI
  - Context-aware analysis based on brand, category, and condition
  - Detailed AI-generated item descriptions
  - Market-adjusted pricing for European market (EUR)

- **Smart User Interface**
  - Collapsible history sidebar with smooth animations
  - Real-time form validation
  - Interactive condition rating slider
  - Responsive design for mobile and desktop

- **Data Management**
  - Persistent estimation history with PostgreSQL
  - Instant CRUD operations (Create, Read, Delete)
  - Automatic sorting by creation date
  - Session-based data synchronization

- **Intelligent Features**
  - Manual change detection for reliable UI updates
  - Optimistic UI updates with server synchronization
  - Error handling with user-friendly messages
  - Auto-formatted dates (French locale)

---

## Technologies

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Angular | 18.0.0 | Frontend framework |
| TypeScript | 5.4.0 | Type-safe development |
| RxJS | 7.8.0 | Reactive state management |
| SCSS | Latest | Modular styling |
| FormsModule | Angular 18 | Two-way data binding |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Spring Boot | 3.4.1 | Backend framework |
| Java | 21 | Application runtime |
| PostgreSQL | 16 | Relational database |
| Hibernate | 6.4 | ORM layer |
| Anthropic API | Claude 3.7 Sonnet | AI valuation engine |

---

## Project Structure

### Frontend

```
smart-valuator-front/
│
├── src/app/
│   ├── components/
│   │   └── chat/
│   │       ├── chat.component.ts         → Main valuation interface
│   │       ├── chat.component.html       → Template with sidebar & form
│   │       ├── chat.component.scss       → Component styles
│   │       └── chat.component.spec.ts    → Unit tests
│   ├── app.component.ts                  → Root component
│   ├── app.html                          → App template
│   └── app.scss                          → Global styles
├── angular.json                          → Angular configuration
├── package.json                          → Dependencies
└── tsconfig.json                         → TypeScript config
```

### Backend

```
smart-valuator-back/
│
├── src/main/java/com/valuator/
│   ├── controller/
│   │   └── EstimationController.java     → REST API endpoints
│   ├── service/
│   │   ├── EstimationService.java        → Business logic
│   │   └── ClaudeAIService.java          → AI integration
│   ├── model/
│   │   └── Estimation.java               → Entity model
│   └── repository/
│       └── EstimationRepository.java     → Data access layer
├── src/main/resources/
│   └── application.properties            → Configuration
└── pom.xml                               → Maven dependencies
```

---

## Architecture

### Full-Stack Data Flow

```
Angular Frontend
    │
    ├─→ User fills estimation form
    ├─→ HTTP POST to /api/estimations
    │
    ↓
Spring Boot Backend
    │
    ├─→ EstimationController receives request
    ├─→ EstimationService validates data
    ├─→ ClaudeAIService calls Anthropic API
    ├─→ Parse AI response (price + description)
    ├─→ Save to PostgreSQL via Hibernate
    ├─→ Return Estimation entity
    │
    ↓
Angular Frontend
    │
    ├─→ Receive response with estimated price
    ├─→ Update UI with ChangeDetectorRef
    ├─→ Display results immediately
    └─→ Add to history sidebar
```

### Reactive State Management

```
Services (State Layer)
    │
    ├── HTTP Observables          → API calls
    ├── ChangeDetectorRef         → Manual updates
    └── RxJS Operators            → takeUntil, finalize
         │
         ↓
Components (UI Layer)
         │
         ├── Subscribe to responses
         ├── Update local state
         └── Trigger change detection
```

---

## Design System

### Color Palette

| Element | Light Mode | Dark Mode |
|---|---|---|
| Primary | `#1976d2` (Blue) | `#1976d2` |
| Background | `#f5f7fa` (Light Gray) | `#1a1a1a` |
| Card | `#ffffff` | `#2a2a2a` |
| Text | `#1a202c` | `#f5f5f5` |
| Accent | `#1565c0` (Dark Blue) | `#42a5f5` |

### Typography

- **Headers**: System UI fonts (Segoe UI, Roboto, Helvetica)
- **Body**: `-apple-system, BlinkMacSystemFont, 'Segoe UI'`
- **Monospace**: `monospace` for numeric values

### Key Animations

- **Sidebar Slide**: 0.3s cubic-bezier (width + opacity)
- **Toggle Button**: Scale transform on hover/active
- **Form Focus**: Box-shadow transition (0.2s)
- **Card Hover**: Lift effect with shadow (0.2s)
- **Spinner**: Infinite rotation for loading states

---

## Installation & Usage

### Prerequisites

- Node.js 18+
- Java 21
- PostgreSQL 16+
- Anthropic API Key

### Frontend Setup

```bash
# Clone the repository
git clone <repo-url>
cd smart-valuator-front

# Install dependencies
npm install

# Configure API endpoint (if needed)
# Edit src/app/components/chat/chat.component.ts
# private readonly apiUrl = 'http://localhost:8080/api/estimations';

# Run development server
npm start

# Open browser
http://localhost:4200
```

### Backend Setup

```bash
cd smart-valuator-back

# Configure database
# Edit src/main/resources/application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/valuator_db
spring.datasource.username=your_username
spring.datasource.password=your_password

# Add Anthropic API key
anthropic.api.key=your_api_key_here

# Run application
./mvnw spring-boot:run

# API will be available at
http://localhost:8080
```

### Build for Production

```bash
# Frontend
cd smart-valuator-front
npm run build
# Output: dist/

# Backend
cd smart-valuator-back
./mvnw clean package
# Output: target/smart-valuator.jar
```

---

## API Endpoints

### REST API

| Method | Endpoint | Description | Request Body | Response |
|---|---|---|---|---|
| `GET` | `/api/estimations` | Get all estimations | — | `Estimation[]` |
| `GET` | `/api/estimations/{id}` | Get single estimation | — | `Estimation` |
| `POST` | `/api/estimations` | Create estimation | `EstimationRequest` | `Estimation` |
| `DELETE` | `/api/estimations/{id}` | Delete estimation | — | `204 No Content` |

### Request Example

```json
POST /api/estimations
{
  "itemName": "iPhone 12 Pro",
  "brand": "Apple",
  "category": "Smartphone",
  "year": 2020,
  "conditionRating": 8
}
```

### Response Example

```json
{
  "id": 42,
  "itemName": "iPhone 12 Pro",
  "brand": "Apple",
  "category": "Smartphone",
  "year": 2020,
  "conditionRating": 8,
  "estimatedPrice": 450.00,
  "aiDescription": "Used iPhone 12 Pro in very good condition...",
  "createdAt": "2026-02-14T15:30:00"
}
```

---

## Database Schema

### Estimations Table

| Column | Type | Constraints |
|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT |
| `item_name` | VARCHAR(255) | NOT NULL |
| `brand` | VARCHAR(255) | NOT NULL |
| `category` | VARCHAR(100) | NOT NULL |
| `year` | INTEGER | NOT NULL |
| `condition_rating` | INTEGER | NOT NULL (1-10) |
| `estimated_price` | DECIMAL(10,2) | NULLABLE |
| `ai_description` | TEXT | NULLABLE |
| `created_at` | TIMESTAMP | DEFAULT NOW() |

---

## Development Patterns

### Frontend Patterns

#### Standalone Components

```typescript
@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit { }
```

#### Manual Change Detection

```typescript
constructor(
  private http: HttpClient,
  private cdr: ChangeDetectorRef
) {}

submitEstimation(): void {
  this.isLoading = true;
  this.cdr.detectChanges(); // Force UI update
  
  this.http.post<Estimation>(this.apiUrl, this.formData)
    .pipe(finalize(() => {
      this.isLoading = false;
      this.cdr.detectChanges(); // Force UI update
    }))
    .subscribe(/* ... */);
}
```

#### Subscription Cleanup

```typescript
private destroy$ = new Subject<void>();

ngOnInit(): void {
  this.http.get<Estimation[]>(this.apiUrl)
    .pipe(takeUntil(this.destroy$))
    .subscribe(/* ... */);
}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### Backend Patterns

#### Service Layer

```java
@Service
@Transactional
public class EstimationService {
    
    @Autowired
    private EstimationRepository repository;
    
    @Autowired
    private ClaudeAIService aiService;
    
    public Estimation createEstimation(EstimationRequest request) {
        // Business logic
        AIResponse aiResponse = aiService.getValuation(request);
        Estimation estimation = mapToEntity(request, aiResponse);
        return repository.save(estimation);
    }
}
```

#### Repository Pattern

```java
@Repository
public interface EstimationRepository 
    extends JpaRepository<Estimation, Long> {
    
    List<Estimation> findAllByOrderByCreatedAtDesc();
}
```

---

## Key Learnings

This project demonstrates:

### Frontend
- ✅ **Standalone Components** (Angular 18+)
- ✅ **Reactive Programming** with RxJS
- ✅ **Manual Change Detection** for edge cases
- ✅ **HTTP Client** with proper error handling
- ✅ **Form Validation** with two-way binding
- ✅ **SCSS Animations** for smooth UX
- ✅ **Responsive Design** with CSS Grid/Flexbox
- ✅ **Unit Testing** with HttpClientTestingModule

### Backend
- ✅ **RESTful API Design** with Spring Boot
- ✅ **Service Layer Pattern** for clean architecture
- ✅ **JPA/Hibernate** for ORM
- ✅ **External API Integration** (Anthropic Claude)
- ✅ **JSON Parsing** with Jackson
- ✅ **CORS Configuration** for cross-origin requests
- ✅ **Exception Handling** with proper HTTP status codes

---

## Browser Compatibility

| Browser | Version | Status |
|---|---|---|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |

---

## Known Issues & Future Improvements

### Current Limitations
- No authentication/authorization system
- Single-user application (no user accounts)
- Limited to European market pricing (EUR)
- No image upload for item verification
- No export functionality (CSV, PDF)

### Planned Features
- 🔄 User authentication with Spring Security
- 📊 Advanced analytics dashboard
- 📸 Image upload for better AI accuracy
- 💱 Multi-currency support
- 📱 Mobile app (iOS/Android)
- 🔔 Price alerts for market changes
- 📄 PDF report generation

---

## Motivation

Created as a **full-stack learning project** to:

1. Practice modern Angular development (v18+)
2. Integrate AI services (Anthropic Claude) into web apps
3. Build a production-quality Spring Boot REST API
4. Explore reactive programming across the stack
5. Solve the problem of uncertain used electronics pricing
6. Demonstrate clean architecture principles

---
*Personal project — public — no restrictive license.*
