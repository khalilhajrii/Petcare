from flask import Blueprint, request, jsonify
from .reservation_agent import ReservationAgent
import os

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return "Hello from Flask!"

@main.route('/api/reservation', methods=['POST'])
def make_reservation():
    try:
        data = request.get_json()
        if not data or 'query' not in data:
            return jsonify({"error": "Missing query parameter"}), 400
            
        db_uri = os.getenv('DATABASE_URI', 'postgresql://root:root@localhost:5432/petcare')
        agent = ReservationAgent(db_uri)
        result = agent.process_reservation(data['query'])
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500