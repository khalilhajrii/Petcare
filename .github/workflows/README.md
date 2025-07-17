# PetCare CI/CD Workflows

This directory contains GitHub Actions workflows for continuous integration and deployment of the PetCare application.

## Workflows

### 1. `ci.yml` - Frontend and Backend CI Pipeline

This workflow runs tests for both the frontend and backend components of the application.

**Triggers:**
- Push to `main`, `master`, or `develop` branches
- Pull requests to `main`, `master`, or `develop` branches

**Jobs:**

#### Backend Tests
- Sets up a PostgreSQL database service
- Installs Node.js and dependencies
- Runs linting
- Executes backend tests

#### Frontend Tests
- Installs Node.js and dependencies
- Runs linting
- Executes frontend tests with headless Chrome

### 2. `admin-ci.yml` - Admin Frontend CI Pipeline

This workflow runs tests for the admin frontend component.

**Triggers:**
- Push to `main`, `master`, or `develop` branches (only when files in the `FrontendAdmin/` directory change)
- Pull requests to `main`, `master`, or `develop` branches (only when files in the `FrontendAdmin/` directory change)

**Jobs:**

#### Admin Frontend Tests
- Installs Node.js and dependencies
- Runs linting
- Executes admin frontend tests with headless Chrome

### 3. `build.yml` - Build Pipeline

This workflow builds all components of the application and saves the build artifacts.

**Triggers:**
- Push to `main`, `master`, or `develop` branches
- Pull requests to `main`, `master`, or `develop` branches

**Jobs:**

#### Build Backend
- Installs Node.js and dependencies
- Builds the backend application
- Archives the build artifacts

#### Build Frontend
- Installs Node.js and dependencies
- Builds the frontend application
- Archives the build artifacts

#### Build Admin Frontend
- Installs Node.js and dependencies
- Builds the admin frontend application
- Archives the build artifacts

### 4. `security.yml` - Security Scan Pipeline

This workflow scans all components for security vulnerabilities in dependencies.

**Triggers:**
- Push to `main` or `master` branches
- Pull requests to `main` or `master` branches
- Weekly schedule (Sundays at midnight)

**Jobs:**

#### Backend Security
- Runs npm audit
- Performs OWASP Dependency-Check
- Generates and uploads security reports

#### Frontend Security
- Runs npm audit
- Performs OWASP Dependency-Check
- Generates and uploads security reports

#### Admin Frontend Security
- Runs npm audit
- Performs OWASP Dependency-Check
- Generates and uploads security reports

### 5. `typescript-lint.yml` - TypeScript Linting Pipeline

This workflow runs TypeScript linting on all TypeScript files to catch type errors and other issues early.

**Triggers:**
- Push to `main`, `master`, or `develop` branches (only when TypeScript files, tsconfig.json, or ESLint configs change)
- Pull requests to `main`, `master`, or `develop` branches (only when TypeScript files, tsconfig.json, or ESLint configs change)

**Jobs:**

#### Backend Linting
- Installs Node.js and dependencies
- Runs ESLint on backend TypeScript files

#### Frontend Linting
- Installs Node.js and dependencies
- Runs ESLint on frontend TypeScript files

#### Admin Frontend Linting
- Installs Node.js and dependencies
- Runs ESLint on admin frontend TypeScript files

## Usage

These workflows run automatically when code is pushed or pull requests are created. No manual action is required.

## Customization

To customize these workflows:

1. Edit the YAML files in this directory
2. Commit and push your changes
3. GitHub will use the updated workflows for subsequent runs

## Environment Variables

The workflows use environment variables for database connections and other configurations. In a production environment, you should set these as GitHub Secrets rather than hardcoding them in the workflow files.