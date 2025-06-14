import os
from typing import Dict, Any, List
from llama_index.core import SQLDatabase
from llama_index.core.query_engine import NLSQLTableQueryEngine
from langgraph.graph import Graph
from sqlalchemy import create_engine, text
from sqlalchemy.engine.base import Engine

class ReservationAgent:
    def __init__(self, db_uri: str):
        self.db_uri = db_uri
        self.engine = create_engine(db_uri)
        self.sql_database = SQLDatabase(self.engine)
        self.query_engine = NLSQLTableQueryEngine(
            sql_database=self.sql_database,
            tables=["pets", "services", "reservations"]
        )
        self.workflow = self._create_workflow()
    
    def _create_workflow(self) -> Graph:
        workflow = Graph()
        
        # Define nodes
        workflow.add_node("identify_intent", self._identify_intent)
        workflow.add_node("check_availability", self._check_availability)
        workflow.add_node("create_reservation", self._create_reservation)
        workflow.add_node("confirm_reservation", self._confirm_reservation)
        
        # Define edges
        workflow.add_edge("identify_intent", "check_availability")
        workflow.add_edge("check_availability", "create_reservation")
        workflow.add_edge("create_reservation", "confirm_reservation")
        
        workflow.set_entry_point("identify_intent")
        workflow.set_finish_point("confirm_reservation")
        
        return workflow
    
    async def _identify_intent(self, state: Dict[str, Any]) -> Dict[str, Any]:
        # Use LLM to identify what the user wants
        query = state.get("query", "")
        response = self.query_engine.query(
            f"Based on this user query: '{query}', what tables would be relevant?"
        )
        state["intent"] = str(response)
        return state
    
    async def _check_availability(self, state: Dict[str, Any]) -> Dict[str, Any]:
        # Check database for availability
        query = state.get("query", "")
        response = self.query_engine.query(
            f"Check availability for: {query}"
        )
        state["availability"] = str(response)
        return state
    
    async def _create_reservation(self, state: Dict[str, Any]) -> Dict[str, Any]:
        # Create reservation in database
        query = state.get("query", "")
        response = self.query_engine.query(
            f"Create a reservation for: {query}"
        )
        state["reservation"] = str(response)
        return state
    
    async def _confirm_reservation(self, state: Dict[str, Any]) -> Dict[str, Any]:
        # Confirm reservation details
        state["confirmation"] = f"Reservation created: {state.get('reservation', '')}"
        return state
    
    async def process_reservation(self, query: str) -> Dict[str, Any]:
        result = await self.workflow.arun({"query": query})
        return result