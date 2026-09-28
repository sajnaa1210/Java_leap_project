# LoyaltyPoints — Tier-Based Retail Loyalty Points Engine

Complete Java + DBMS mini-project using Spring Boot, MySQL (XAMPP), IntelliJ IDEA, Postman, HTML/CSS/JS.

## Features
- Customer CRUD (create, view, update via REST, delete when no transaction history)
- Earn points from purchase amount using current tier multiplier
- Automatic tier upgrade: Bronze → Silver → Gold → Platinum
- Redeem points with insufficient-balance validation
- Manual positive/negative point adjustments
- Full transaction history
- Tier-based discount information
- Responsive browser dashboard

## Tier Rules
| Tier | Lifetime points | Earn rate | Discount |
|---|---:|---:|---:|
| Bronze | 0+ | 1 point/₹ | 0% |
| Silver | 1,000+ | 1.25 points/₹ | 5% |
| Gold | 3,000+ | 1.5 points/₹ | 10% |
| Platinum | 7,000+ | 2 points/₹ | 15% |

These thresholds are easy to edit in `model/Tier.java`.

## Run it (XAMPP + IntelliJ)
1. Extract this ZIP.
2. Open XAMPP Control Panel and start **MySQL**. Apache is not required because Spring Boot serves the frontend.
3. Optional: open phpMyAdmin and import `database.sql`. This is not mandatory because the JDBC URL uses `createDatabaseIfNotExist=true`.
4. In IntelliJ IDEA: **File → Open** → choose the extracted `LoyaltyPoints` folder → trust/open Maven project.
5. Make sure Project SDK is **Java 17 or newer**.
6. Open `LoyaltyPointsApplication.java` and click **Run**.
7. Wait for `Started LoyaltyPointsApplication`.
8. Open `http://localhost:8080` in your browser.

### If your XAMPP MySQL root user has a password
Edit `src/main/resources/application.properties` and set:
`spring.datasource.password=YOUR_PASSWORD`

### If MySQL uses another port
Change `localhost:3306` in `application.properties` to your MySQL port.

## Postman
Import `postman/LoyaltyPoints.postman_collection.json`. Base URL is already `http://localhost:8080`.

## Database tables
- `customers`: customer profile, balance, lifetime points, tier
- `point_transactions`: immutable audit/history rows for EARN, REDEEM and ADJUSTMENT

## Main REST APIs
- GET/POST `/api/customers`
- GET/PUT/DELETE `/api/customers/{id}`
- POST `/api/customers/{id}/earn`
- POST `/api/customers/{id}/redeem`
- POST `/api/customers/{id}/adjust`
- GET `/api/customers/{id}/transactions`
- GET `/api/tiers`
