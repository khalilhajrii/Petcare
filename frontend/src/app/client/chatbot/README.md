# Chatbot Reservation Assistant

## Overview
This component provides a floating chatbot interface for users to interact with the reservation assistant. The chatbot connects to the PetCare Reservation System API to process natural language queries and help users create reservations.

## Features
- Floating chat icon in the bottom right corner of the screen
- Modern, responsive chat interface
- Real-time conversation with the reservation assistant
- Visual feedback during processing (loading indicator)
- Error handling for failed requests

## Technical Implementation

### Components
- `ChatbotComponent`: The UI component that renders the chat interface
- `ChatbotService`: Service that handles API communication with the reservation system

### API Integration
- Connects to the reservation agent API at `http://localhost:5000/api/reservation/{email}`
- Sends user queries and displays responses

## Usage
The chatbot is automatically included in the client layout and will appear as a floating button in the bottom right corner of all client pages. Users can:

1. Click the chat icon to open the chat interface
2. Type a message and press Enter or click the send button
3. View the assistant's response
4. Click the chat icon again to close the interface

## Example Queries
- "I want to make a reservation for my dog tomorrow at 2pm"
- "Show me my upcoming reservations"
- "I need a grooming service for my cat"
- "What services are available?"

## Customization
The chatbot's appearance can be customized by modifying the SCSS variables in the `chatbot.component.scss` file.