# PetCare Reservation AI Agent

## Overview

This module provides an AI-powered reservation system for the PetCare application. It allows users to:

1. List existing reservations
2. Create new reservations using natural language

## How It Works

The reservation agent uses a combination of:

- **SQLAlchemy**: For direct database operations
- **LlamaIndex**: For natural language processing and SQL generation
- **LangGraph**: For workflow management
- **Hugging Face Models**: For local language processing

## Features

### Listing Reservations

Users can request to see reservations with queries like:

- "Show all reservations"
- "List reservations for user john@example.com"
- "Get appointments for Jane"

### Creating Reservations

Users can create reservations with natural language queries like:

- "Make a reservation for John with his dog Max on 2023-12-30 at 2:30 PM for a vaccination"
- "Book a grooming appointment for Jane's cat Luna on December 25th at 10am"
- "Schedule a dental cleaning for Charlie at the Main Clinic on January 5th at 3pm"

## API Endpoints

### POST /api/reservation

Creates a new reservation or lists reservations based on the query.

**Request Body:**
```json
{
  "query": "Make a reservation for John with his dog Max on 2023-12-30 at 2:30 PM for a vaccination"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reservation request processed",
  "data": "Reservation created successfully!\nReservation #5\nDate: 2023-12-30\nTime: 14:30\nLocation: Main Clinic\nPet: Max (Dog)\nOwner: John Doe (john@example.com)\nServices: Vaccination"
}
```

### GET /api/reservations

Lists all reservations.

**Response:**
```json
{
  "success": true,
  "message": "Here are the reservations:",
  "data": "Reservation #1: 2023-12-15 at 10:00 AM\nLocation: Main Clinic\nPet: Max (Dog)\nOwner: John Doe (john@example.com)\nServices: Basic Checkup ($50.0), Vaccination ($75.0)\n\nReservation #2: 2023-12-20 at 2:30 PM\nLocation: Pet Spa Center\nPet: Bella (Cat)\nOwner: John Doe (john@example.com)\nServices: Grooming ($45.0)"
}
```

## Implementation Details

### Workflow

The agent follows this workflow:

1. **Identify Intent**: Determine if the user wants to list or create a reservation
2. **List Reservations**: If listing, query the database and format results
3. **Parse Reservation Request**: If creating, extract details from the natural language query
4. **Check Availability**: Verify the requested time slot is available
5. **Create Reservation**: Add the reservation to the database
6. **Confirm Reservation**: Return confirmation details to the user

### Database Integration

The agent connects directly to the PostgreSQL database and interacts with these tables:

- `user`: Pet owners
- `pet`: Pets belonging to users
- `service`: Available services
- `reservation`: Appointment details
- `reservation_services`: Junction table for services in each reservation

## Setup and Configuration

### Environment Variables

- `DATABASE_URI`: PostgreSQL connection string (default: `postgresql://root:root@database:5432/petcare`)

### Dependencies

Required Python packages:

- flask
- sqlalchemy
- llama-index
- langgraph
- transformers
- torch

## Usage Examples

### Creating a Reservation

```python
import requests

response = requests.post(
    "http://localhost:3005/api/reservation",
    json={"query": "Book a grooming appointment for Jane's cat Luna on December 25th at 10am"}
)

print(response.json())
```

### Listing Reservations

```python
import requests

response = requests.get("http://localhost:3005/api/reservations")

print(response.json())
```