# Specification: 003-food-meal-tracking (Epic 3 — Sprint 3)

> **Status: Planned**
> **Target Milestone**: M2 (Nutrition Tracking, Progress & Platform Reach)
> **Sprint**: Sprint 3 (1.5 wks, 16 Story Points)
> **Related FRs**: FR-04, FR-05a, FR-05b, FR-05c, FR-06
> **Data Entities**: `Food`, `FoodCategory`, `Meal`, `MealItem`, `NutritionTarget`

---

## 1. Feature Summary & User Intent

Enable users to search an extensive database of Arabic and international foods by name/category, and seamlessly log, edit, and delete daily meals (Breakfast, Lunch, Dinner, Snacks) with automatic recalculation of calories, protein, carbs, and fats.

---

## 2. Requirements & User Stories

### US-04: Search Food Items (3 SP)
> As a user, I want to search the food database by name, so that I can quickly find the food item I ate.

- **AC-1 (Live Search)**: Given a user logging a meal, when typing a query in the food search input, then system returns matching foods with serving size and calorie/macro details within 300ms.
- **AC-2 (Empty Search State)**: Given a search query with no matching items in database, when executed, then system displays localized "No Results Found" with option to suggest/custom add.
- **AC-3 (Food Selection)**: Given search results, when user selects a food item, then meal logger pre-fills nutritional values per serving unit.

### US-05: Log, Edit, and Delete Meals (8 SP)
> As a user, I want to add, edit, and delete meals from my daily log, so that my nutrition tracking stays accurate.

- **AC-1 (Log Meal Item)**: Given a selected food item and portion quantity, when user submits to a meal slot (Breakfast/Lunch/Dinner/Snack), then system saves `MealItem`, computes totals, and updates consumed daily calories.
- **AC-2 (Edit Meal Portion)**: Given an existing logged meal, when user changes quantity or unit, then total calories and macros update instantly.
- **AC-3 (Delete Meal)**: Given a logged meal item, when user deletes it, then item is removed and daily totals subtract its nutritional values.
- **AC-4 (Automatic Nutrition Totals - UC-06)**: Given any meal mutation (create, edit, delete), when completed, then system updates daily summary and compares against active `NutritionTarget`.

---

## 3. Data Model & API Interfaces

### Endpoints (To be implemented/confirmed with Laravel API)
- `GET /foods/search?q={query}&category={id}`
- `GET /food-categories`
- `POST /meals` (`meal_type`, `date`, `items: [{ food_id, quantity, serving_unit }]`)
- `GET /meals?date={YYYY-MM-DD}`
- `PUT /meals/{id}`
- `DELETE /meals/{id}`

---

## 4. Acceptance Verification & QA Criteria

- [ ] Food search responds in ≤ 300ms.
- [ ] Meal logging updates daily calorie progress bar in real-time.
- [ ] Full bilingual support (Arabic food names & English food names).
