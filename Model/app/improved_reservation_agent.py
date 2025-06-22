import os
from typing import Dict, Any, List, Optional, Union
from datetime import datetime
from llama_index.core import SQLDatabase, Settings
from llama_index.core.query_engine import NLSQLTableQueryEngine
from langgraph.graph import Graph, END
from sqlalchemy import create_engine, text, Table, MetaData, select, insert, and_, or_, func
from sqlalchemy.engine.base import Engine
from transformers import pipeline
# Import Hugging Face LLM
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from llama_index.llms.huggingface.base import HuggingFaceLLM
from llama_index.embeddings.huggingface.base import HuggingFaceEmbedding

class ImprovedReservationAgent:
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
            
            # Initialize metadata for direct table access
            self.metadata = MetaData()
            self.metadata.reflect(bind=self.engine)
            
            # Get table references
            self.user_table = self.metadata.tables['user']
            self.pet_table = self.metadata.tables['pet']
            self.service_table = self.metadata.tables['service']
            self.reservation_table = self.metadata.tables['reservation']
            self.reservation_services_table = self.metadata.tables['reservation_services']
            
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
            tables=["pet", "service", "reservation", "reservation_services", "user"],
            llm=self.llm
        )
        
        self.workflow = self._create_workflow()
    
    def _create_workflow(self) -> Any:
        workflow = Graph()
        
        # Define nodes
        workflow.add_node("identify_intent", self._identify_intent)
        workflow.add_node("list_reservations", self._list_reservations)
        workflow.add_node("parse_reservation_request", self._parse_reservation_request)
        workflow.add_node("check_availability", self._check_availability)
        workflow.add_node("create_reservation", self._create_reservation)
        workflow.add_node("confirm_reservation", self._confirm_reservation)
        
        # Define conditional edges with mapping of condition values to target nodes
        workflow.add_conditional_edges(
            "identify_intent",
            lambda state: state.get("intent_type", ""),
            {
                "list": "list_reservations",
                "create": "parse_reservation_request"
            }
        )
        
        # Add regular edges for the rest of the workflow
        workflow.add_edge("parse_reservation_request", "check_availability")
        workflow.add_edge("check_availability", "create_reservation")
        workflow.add_edge("create_reservation", "confirm_reservation")
        
        workflow.set_entry_point("identify_intent")
        
        # Connect to END node (terminal nodes)
        workflow.add_edge("list_reservations", END)
        workflow.add_edge("confirm_reservation", END)
        
        return workflow.compile()
    
    async def _identify_intent(self, state: Dict[str, Any]) -> Dict[str, Any]:
        # Use LLM to identify what the user wants
        query = state.get("query", "")
        try:
            # Simple intent classification
            if any(word in query.lower() for word in ["list", "show", "get", "view", "display"]):
                state["intent_type"] = "list"
            else:
                state["intent_type"] = "create"
                
            print(f"Identified intent: {state['intent_type']}")
        except Exception as e:
            print(f"Error in _identify_intent: {e}")
            state["error"] = f"Error identifying intent: {str(e)}"
            state["intent_type"] = "create"  # Default to create
        return state
    
    async def _list_reservations(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """List reservations with proper error handling and data conversion."""
        query = state.get("query", "")
        try:
            # Validate database connection
            if not self.engine:
                raise ValueError("Database engine not initialized")

            # Extract user information if present
            user_info = None
            for word in ["user", "client", "owner"]:
                if word in query.lower():
                    parts = query.split(word)[1].strip().split()
                    if parts:
                        user_info = parts[0].strip(".,;:'\"").lower()
                        break

            with self.engine.connect() as conn:
                # Build base query
                stmt = select(
                    self.reservation_table.c.idreserv,
                    self.reservation_table.c.date,
                    self.reservation_table.c.time,
                    self.reservation_table.c.lieu,
                    self.user_table.c.email.label('user_email'),
                    self.user_table.c.firstName.label('user_first_name'),
                    self.user_table.c.lastName.label('user_last_name'),
                    self.pet_table.c.nom.label('pet_name'),
                    self.pet_table.c.type.label('pet_type')
                ).select_from(
                    self.reservation_table
                    .join(self.user_table, self.reservation_table.c.userId == self.user_table.c.id)
                    .join(self.pet_table, self.reservation_table.c.petId == self.pet_table.c.idPet)
                )

                # Apply filters
                if user_info:
                    stmt = stmt.where(
                        or_(
                            self.user_table.c.email.ilike(f"%{user_info}%"),
                            self.user_table.c.firstName.ilike(f"%{user_info}%"),
                            self.user_table.c.lastName.ilike(f"%{user_info}%")
                        )
                    )

                stmt = stmt.order_by(self.reservation_table.c.date.desc())

                # Execute and convert results SAFELY
                result = conn.execute(stmt)
                if not result:
                    state["reservations"] = "No reservations found."
                    return state

                reservations = []
                for row in result:
                    try:
                        row_dict = dict(row._mapping)  # Proper conversion
                        
                        # Get services for this reservation
                        service_stmt = select(
                            self.service_table.c.nomservice,
                            self.service_table.c.prixService
                        ).select_from(
                            self.service_table
                            .join(
                                self.reservation_services_table,
                                self.service_table.c.idservice == self.reservation_services_table.c.serviceId
                            )
                        ).where(
                            self.reservation_services_table.c.reservationId == row_dict['idreserv']
                        )
                        
                        service_result = conn.execute(service_stmt)
                        row_dict['services'] = [dict(s._mapping) for s in service_result]
                        
                        reservations.append(row_dict)
                    except Exception as row_error:
                        print(f"Error processing row: {row_error}")
                        continue

                # Format results
                if not reservations:
                    state["reservations"] = "No reservations found."
                    return state

                formatted = []
                for r in reservations:
                    try:
                        services_str = ", ".join([
                            f"{s.get('nomservice', 'Unknown')} (${s.get('prixService', '0')})" 
                            for s in r.get('services', [])
                        ])
                        
                        formatted.append(
                            f"Reservation #{r.get('idreserv', 'N/A')}:\n"
                            f"Date: {r.get('date', 'Unknown').strftime('%Y-%m-%d')}\n"
                            f"Time: {r.get('time', 'Unknown')}\n"
                            f"Location: {r.get('lieu', 'Unknown')}\n"
                            f"Pet: {r.get('pet_name', 'Unknown')} ({r.get('pet_type', 'Unknown')})\n"
                            f"Owner: {r.get('user_first_name', 'Unknown')} {r.get('user_last_name', 'Unknown')} "
                            f"({r.get('user_email', 'Unknown')})\n"
                            f"Services: {services_str}\n"
                        )
                    except Exception as format_error:
                        print(f"Error formatting reservation: {format_error}")
                        continue

                state["reservations"] = "\n\n".join(formatted) if formatted else "No valid reservations found."

        except Exception as e:
            error_msg = f"Error listing reservations: {str(e)}"
            print(error_msg)
            import traceback
            traceback.print_exc()
            state["reservations"] = error_msg

        return state
    
    async def _parse_reservation_request(self, state: Dict[str, Any]) -> Dict[str, Any]:
        # Parse the reservation request to extract details
        query = state.get("query", "")
        try:
            # Use the LLM to extract structured information
            prompt = f"""
            Extract the following information from this reservation request: "{query}"
            
            1. User email or name
            2. Pet name or type
            3. Date (in YYYY-MM-DD format)
            4. Time
            5. Service name(s)
            6. Location (if specified)
            
            Format the response as JSON with these fields: user, pet, date, time, services, location
            """
            
            response = self.llm.complete(prompt)
            print(f"LLM extraction response: {response}")
            
            # Fallback to manual parsing if LLM fails
            # This is a simplified extraction and would need to be more robust in production
            extracted = {
                "user": None,
                "pet": None,
                "date": None,
                "time": None,
                "services": [],
                "location": None
            }
            
            # Extract user
            for word in ["user", "client", "owner", "for"]:
                if word in query.lower():
                    parts = query.split(word)[1].strip().split()
                    if parts:
                        extracted["user"] = parts[0].strip(".,;:'\"").lower()
                        break
            
            # Extract pet
            for word in ["pet", "dog", "cat", "animal"]:
                if word in query.lower():
                    parts = query.split(word)[1].strip().split()
                    if parts:
                        extracted["pet"] = parts[0].strip(".,;:'\"").lower()
                        break
            
            # Extract date - look for date patterns
            import re
            date_patterns = [
                r'\d{4}-\d{2}-\d{2}',  # YYYY-MM-DD
                r'\d{2}/\d{2}/\d{4}',  # MM/DD/YYYY
                r'\d{2}-\d{2}-\d{4}'   # DD-MM-YYYY
            ]
            
            for pattern in date_patterns:
                match = re.search(pattern, query)
                if match:
                    extracted["date"] = match.group(0)
                    break
            
            # Extract time
            time_pattern = r'\d{1,2}:\d{2}|\d{1,2}(am|pm|AM|PM)'
            match = re.search(time_pattern, query)
            if match:
                extracted["time"] = match.group(0)
            
            # Extract services
            service_keywords = ["checkup", "vaccination", "grooming", "dental", "cleaning"]
            for keyword in service_keywords:
                if keyword in query.lower():
                    extracted["services"].append(keyword)
            
            # Extract location
            location_keywords = ["clinic", "hospital", "center", "spa"]
            for keyword in location_keywords:
                if keyword in query.lower():
                    # Get the full phrase containing the location
                    parts = query.split(keyword)
                    if len(parts) > 1:
                        # Take a few words before and after the keyword
                        before = parts[0].split()[-3:] if len(parts[0].split()) > 3 else parts[0].split()
                        after = parts[1].split()[:3] if len(parts[1].split()) > 3 else parts[1].split()
                        location = " ".join(before + [keyword] + after).strip(".,;:'\"").strip()
                        extracted["location"] = location
                        break
            
            state["extracted_info"] = extracted
            print(f"Extracted information: {extracted}")
            
        except Exception as e:
            print(f"Error in _parse_reservation_request: {e}")
            state["error"] = f"Error parsing reservation request: {str(e)}"
        
        return state
    
    async def _check_availability(self, state: Dict[str, Any]) -> Dict[str, Any]:
        # Check if the requested time slot is available
        extracted = state.get("extracted_info", {})
        try:
            date_str = extracted.get("date")
            time_str = extracted.get("time")
            
            if not date_str or not time_str:
                state["availability"] = "Missing date or time information."
                state["is_available"] = False
                return state
            
            # Convert date string to datetime object
            try:
                # Try different date formats
                date_formats = ['%Y-%m-%d', '%m/%d/%Y', '%d-%m-%Y']
                parsed_date = None
                
                for fmt in date_formats:
                    try:
                        parsed_date = datetime.strptime(date_str, fmt).date()
                        break
                    except ValueError:
                        continue
                
                if not parsed_date:
                    raise ValueError(f"Could not parse date: {date_str}")
                
                # Standardize time format
                if 'am' in time_str.lower() or 'pm' in time_str.lower():
                    # Convert 12-hour format to 24-hour format
                    if ':' not in time_str:
                        # Handle format like "2pm"
                        hour = int(time_str.lower().replace('am', '').replace('pm', ''))
                        if 'pm' in time_str.lower() and hour < 12:
                            hour += 12
                        if 'am' in time_str.lower() and hour == 12:
                            hour = 0
                        time_str = f"{hour}:00"
                    else:
                        # Handle format like "2:30pm"
                        time_parts = time_str.lower().replace('am', '').replace('pm', '').split(':')
                        hour = int(time_parts[0])
                        minute = int(time_parts[1])
                        if 'pm' in time_str.lower() and hour < 12:
                            hour += 12
                        if 'am' in time_str.lower() and hour == 12:
                            hour = 0
                        time_str = f"{hour}:{minute:02d}"
                
                # Check if there are any existing reservations at the same time
                with self.engine.connect() as conn:
                    stmt = select(func.count()).select_from(self.reservation_table).where(
                        and_(
                            self.reservation_table.c.date == parsed_date,
                            self.reservation_table.c.time == time_str
                        )
                    )
                    
                    result = conn.execute(stmt)
                    count = result.scalar()
                    
                    if count > 0:
                        state["availability"] = f"The requested time slot ({parsed_date}, {time_str}) is already booked."
                        state["is_available"] = False
                    else:
                        state["availability"] = f"The requested time slot ({parsed_date}, {time_str}) is available."
                        state["is_available"] = True
                        state["formatted_date"] = parsed_date
                        state["formatted_time"] = time_str
            
            except ValueError as ve:
                state["availability"] = f"Invalid date or time format: {ve}"
                state["is_available"] = False
            
        except Exception as e:
            print(f"Error in _check_availability: {e}")
            state["availability"] = f"Error checking availability: {str(e)}"
            state["is_available"] = False
        
        return state
    
    async def _create_reservation(self, state: Dict[str, Any]) -> Dict[str, Any]:
        # Create reservation in database
        if not state.get("is_available", False):
            state["reservation_result"] = "Cannot create reservation: time slot is not available."
            return state
        
        extracted = state.get("extracted_info", {})
        try:
            # Get user information
            user_info = extracted.get("user")
            if not user_info:
                state["reservation_result"] = "Cannot create reservation: missing user information."
                return state
            
            # Find user in database
            with self.engine.connect() as conn:
                user_stmt = select(self.user_table).where(
                    or_(
                        self.user_table.c.email.ilike(f"%{user_info}%"),
                        self.user_table.c.firstName.ilike(f"%{user_info}%"),
                        self.user_table.c.lastName.ilike(f"%{user_info}%")
                    )
                )
                
                user_result = conn.execute(user_stmt)
                user = user_result.fetchone()
                
                if not user:
                    state["reservation_result"] = f"Cannot create reservation: user '{user_info}' not found."
                    return state
                
                # Get pet information
                pet_info = extracted.get("pet")
                if not pet_info:
                    state["reservation_result"] = "Cannot create reservation: missing pet information."
                    return state
                
                # Find pet in database
                pet_stmt = select(self.pet_table).where(
                    and_(
                        self.pet_table.c.userId == user.id,
                        or_(
                            self.pet_table.c.nom.ilike(f"%{pet_info}%"),
                            self.pet_table.c.type.ilike(f"%{pet_info}%"),
                            self.pet_table.c.race.ilike(f"%{pet_info}%")
                        )
                    )
                )
                
                pet_result = conn.execute(pet_stmt)
                pet = pet_result.fetchone()
                
                if not pet:
                    state["reservation_result"] = f"Cannot create reservation: pet '{pet_info}' not found for user '{user.email}'."
                    return state
                
                # Get service information
                service_info = extracted.get("services", [])
                if not service_info:
                    state["reservation_result"] = "Cannot create reservation: missing service information."
                    return state
                
                # Find services in database
                services = []
                for service_name in service_info:
                    service_stmt = select(self.service_table).where(
                        or_(
                            self.service_table.c.nomservice.ilike(f"%{service_name}%"),
                            self.service_table.c.description.ilike(f"%{service_name}%")
                        )
                    )
                    
                    service_result = conn.execute(service_stmt)
                    service = service_result.fetchone()
                    
                    if service:
                        services.append(service)
                
                if not services:
                    state["reservation_result"] = f"Cannot create reservation: no matching services found for '{', '.join(service_info)}'."
                    return state
                
                # Get location information
                location = extracted.get("location", "Main Clinic")
                
                # Create reservation
                reservation_stmt = insert(self.reservation_table).values(
                    date=state.get("formatted_date"),
                    time=state.get("formatted_time"),
                    lieu=location,
                    userId=user.id,
                    petId=pet.idPet
                )
                
                result = conn.execute(reservation_stmt)
                conn.commit()
                
                # Get the ID of the newly created reservation
                reservation_id = result.inserted_primary_key[0]
                
                # Add services to reservation
                for service in services:
                    reservation_service_stmt = insert(self.reservation_services_table).values(
                        reservationId=reservation_id,
                        serviceId=service.idservice
                    )
                    
                    conn.execute(reservation_service_stmt)
                
                conn.commit()
                
                # Format the result
                service_names = [service.nomservice for service in services]
                state["reservation_result"] = (
                    f"Reservation created successfully!\n"
                    f"Reservation #{reservation_id}\n"
                    f"Date: {state.get('formatted_date')}\n"
                    f"Time: {state.get('formatted_time')}\n"
                    f"Location: {location}\n"
                    f"Pet: {pet.nom} ({pet.type})\n"
                    f"Owner: {user.firstName} {user.lastName} ({user.email})\n"
                    f"Services: {', '.join(service_names)}"
                )
                
        except Exception as e:
            import traceback
            print(f"Error in _create_reservation: {e}")
            print(traceback.format_exc())
            state["reservation_result"] = f"Error creating reservation: {str(e)}"
        
        return state
    
    async def _confirm_reservation(self, state: Dict[str, Any]) -> Dict[str, Any]:
        # Confirm reservation details
        state["confirmation"] = state.get("reservation_result", "No reservation was created.")
        return state
    
    async def process_reservation(self, query: str) -> Dict[str, Any]:
        try:
            result = await self.workflow.ainvoke({"query": query})
            
            # Format the response based on the intent
            if result.get("intent_type") == "list":
                return {
                    "success": True,
                    "message": "Here are the reservations:",
                    "data": result.get("reservations", "No reservations found.")
                }
            else:
                return {
                    "success": True,
                    "message": "Reservation request processed",
                    "data": result.get("confirmation", "No confirmation available.")
                }
            
        except Exception as e:
            import traceback
            print(f"Error in process_reservation: {str(e)}")
            print(traceback.format_exc())
            return {"success": False, "error": str(e)}