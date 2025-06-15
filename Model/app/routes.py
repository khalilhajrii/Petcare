from flask import Blueprint, request, jsonify
from .reservation_agent import ReservationAgent
import os
import asyncio

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return "Hello from Flask!"

@main.route('/api/reservation', methods=['POST'])
async def make_reservation():
    try:
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({"error": "Missing query parameter"}), 400
            
        # Get database URI from environment variable
        db_uri = os.getenv('DATABASE_URI', 'postgresql://root:root@database:5432/petcare')
        
        # Print the database URI for debugging
        print(f"Using database URI: {db_uri}")
        
        # Create reservation agent
        agent = ReservationAgent(db_uri)
        
        # Process reservation (await the async function)
        result = await agent.process_reservation(data['query'])
        
        return jsonify(result)
    except Exception as e:
        import traceback
        print(f"Error in make_reservation: {str(e)}")
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500