# 🚀 Playwright Training Plan - Practice 2

**Date:** Mar 17, 2026

---

## 📌 OVERVIEW

This document provides the Playwright Automation Testing training plan.

The goal of this training is to practice **UI Testing** and **API Testing** using Playwright on the demo application:

👉 https://pocketbase.io/demo/

- **Timeline:** 5 working days
- **Start date:** Mar 17, 2026
- **End date:** Mar 23, 2026

---

## 🎯 TARGETS

- Implement end-to-end automation tests using Playwright
- Combine UI tests with API tests
- Create test data using API before running UI tests
- Verify API responses (status code & response data)
- Automate CRUD operations (Create, Read, Update, Delete)
- Automate table interactions
- Validate sorting and searching
- Write maintainable and scalable test cases

---

## 🧰 PREREQUISITE

### 📦 Framework

- Basic knowledge of a JS/TS framework (React, Angular, etc.)

### 💻 Operating System

- Windows 10+, Windows Server 2016+, or WSL
- macOS 13 Ventura or later
- Linux: Debian 12, Ubuntu 22.04 / 24.04 (x86-64 & arm64)

### 🟢 Node.js

- Version: 18 / 20 / 22 (recommended latest LTS)

### 📦 Package Manager

- npm / yarn / pnpm

### 🧑‍💻 IDE

- Visual Studio Code

> 📝 **Note:** System requirements follow official Playwright documentation.

---

## 📚 DETAIL PLAN

### 1. 🎯 PLAYWRIGHT FUNDAMENTALS

📖 Documentation: https://playwright.dev/docs/intro

Topics:

- Playwright introduction
- Writing first test
- Selectors
- Test structure
- Fixtures
- Locators
- Handling forms
- Handling tables
- Handling file uploads

---

### 2. 🔌 API TESTING WITH PLAYWRIGHT

📖 Documentation: https://playwright.dev/docs/api-testing

Topics:

- `APIRequestContext`
- API authentication
- Sending requests (GET / POST / DELETE / PATCH)
- Verifying status code
- Verifying response body
- Using API client patterns (service layer)

📌 Reference:

- Playwright Todo List example

---

## 🧪 PRACTICES (5 DAYS)

### 📍 PRACTICE 2

Test the demo application:

👉 https://pocketbase.io/demo/

---

## 🧩 FEATURES TO COVER

### 🔐 Authentication

- Verify user can login successfully

### 📝 CRUD Operations

- Create a new record
- Edit a record
- Delete a record

### 📊 Table Interactions

- Verify sorting by:
  - Title
  - Description
  - Active
  - Options

### 🔍 Search

- Verify user can search records
- Verify search with:
  - Normal text
  - Uppercase / lowercase
  - Empty result

---

## 📋 TEST CASES

- Test case list: **Google Sheet / Excel (provided separately)**

---

## 💡 EXPECTED OUTPUT

- Fully working Playwright test suite
- Clean architecture (Fixtures + Page Object + API layer)
- Stable tests (no flaky behavior)
- Reusable utilities and helpers
- Proper test tagging (`@smoke`, `@regression`, `@api`, `@ui`)

---

## 🏁 FINAL GOAL

By the end of this practice, you should be able to:

✅ Build a complete Playwright automation framework  
✅ Combine UI + API testing effectively  
✅ Handle real-world scenarios (async UI, table, search, CRUD)  
✅ Write clean, maintainable, and scalable tests

---

## ⚙️ INSTALLATION & SETUP

| Purpose                 | Command                                                                        |
| ----------------------- | ------------------------------------------------------------------------------ |
| 📄 Clone                | `git clone git@gitlab.asoft-python.com:ha.nguyenthanh/playwright-training.git` |
| 📦 Install dependencies | `pnpm install`                                                                 |
| 🌐 Install browsers     | `npx playwright install`                                                       |
| ▶️ Run all tests        | `pnpm test`                                                                    |
| 📄 Run specific file    | `pnpm test tests/create-post.spec.ts`                                          |
| 🌍 Run chromium only    | `pnpm test --project=chromium`                                                 |
| 🔌 Run API tests        | `pnpm test --project=api`                                                      |
| 🏷 Run by tag           | `pnpm test -g "@smoke"`                                                        |
| 👀 Headed mode          | `pnpm test --headed`                                                           |
| 🐞 Debug mode           | `pnpm test --debug`                                                            |
| 🎯 Run specific line    | `pnpm test file.spec.ts:10`                                                    |

---
