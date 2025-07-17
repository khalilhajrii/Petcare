import os
from typing import Dict, Any, List
from llama_index.core import SQLDatabase, Settings
from llama_index.core.query_engine import NLSQLTableQueryEngine
from langgraph.graph import Graph
from sqlalchemy import create_engine, text
from sqlalchemy.engine.base import Engine
from transformers import pipeline
# Import Hugging Face LLM
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from llama_index.llms.huggingface import HuggingFaceLLM
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

class ReservationAgent:
    def __init__(self, db_uri: str):
        self.db_uri = db_uri
        print(f"Connecting to database: {db_uri}")
        
        try:
            # Create the engine with the provided URI
            self.engine = create_engine(db_uri)
            
            # Test the connection
            with self.engine.connect() as conn:
                print("Database connection successful!")
                
            # Initialize SQL database after successful connection
            self.sql_database = SQLDatabase(self.engine)
            
        except Exception as e:
            print(f"Database connection failed: {e}")
            raise
        
        # Configure local embeddings (free)
        Settings.embed_model = HuggingFaceEmbedding(
            model_name="BAAI/bge-small-en-v1.5"  # Free, lightweight embedding model
        )
        
        # Initialize local LLM
        tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-small")
        model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-small")
        
        self.llm = HuggingFaceLLM(
            model=model,
            tokenizer=tokenizer,
            context_window=512,
            max_new_tokens=256,
            generate_kwargs={
                "temperature": 0.7,
                "do_sample": False,
                "max_length": 256
            },
            device_map="auto"
        )
        
        # Configure query engine with local models
        self.query_engine = NLSQLTableQueryEngine(
            sql_database=self.sql_database,
            tables=["pet", "service", "reservation","reservation_services"],
            llm=self.llm
        )
        
        self.workflow = self._create_workflow()
    
    def _create_workflow(self) -> Any:
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
        
        return workflow.compile()
    
    async def _identify_intent(self, state: Dict[str, Any]) -> Dict[str, Any]:
        # Use LLM to identify what the user wants
        query = state.get("query", "")
        try:
            response = self.query_engine.query(
                f"Based on this user query: '{query}', what tables would be relevant?"
            )
            state["intent"] = str(response)
        except Exception as e:
            print(f"Error in _identify_intent: {e}")
            state["intent"] = f"Error: {str(e)}"
        return state
    
    async def _check_availability(self, state: Dict[str, Any]) -> Dict[str, Any]:
        # Check database for availability
        query = state.get("query", "")
        try:
            response = self.query_engine.query(
                f"Check availability for: {query}"
            )
            state["availability"] = str(response)
        except Exception as e:
            print(f"Error in _check_availability: {e}")
            state["availability"] = f"Error: {str(e)}"
        return state
    
    async def _create_reservation(self, state: Dict[str, Any]) -> Dict[str, Any]:
        # Create reservation in database
        query = state.get("query", "")
        try:
            response = self.query_engine.query(
                f"Create a reservation for: {query}"
            )
            state["reservation"] = str(response)
        except Exception as e:
            print(f"Error in _create_reservation: {e}")
            state["reservation"] = f"Error: {str(e)}"
        return state
    
    async def _confirm_reservation(self, state: Dict[str, Any]) -> Dict[str, Any]:
        # Confirm reservation details
        state["confirmation"] = f"Reservation created: {state.get('reservation', '')}"
        return state
    
    async def process_reservation(self, query: str) -> Dict[str, Any]:
        try:
            result = await self.workflow.ainvoke({"query": query})
            return result
        except Exception as e:
            import traceback
            print(f"Error in process_reservation: {str(e)}")
            print(traceback.format_exc())
            return {"error": str(e)}