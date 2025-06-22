from langgraph.graph import Graph, END

def test_conditional_edges():
    # Create a simple workflow
    workflow = Graph()
    
    # Define some simple functions for our nodes
    def identify_intent(state):
        print("Identifying intent...")
        # Return a state with an intent_type
        return {"intent_type": "list"}
    
    def list_reservations(state):
        print("Listing reservations...")
        return {"result": "Here are your reservations"}
    
    def create_reservation(state):
        print("Creating reservation...")
        return {"result": "Reservation created"}
    
    # Add nodes
    workflow.add_node("identify_intent", identify_intent)
    workflow.add_node("list_reservations", list_reservations)
    workflow.add_node("create_reservation", create_reservation)
    
    # Define conditional edges with mapping
    workflow.add_conditional_edges(
        "identify_intent",
        lambda state: state.get("intent_type", ""),
        {
            "list": "list_reservations",
            "create": "create_reservation"
        }
    )
    
    workflow.set_entry_point("identify_intent")
    
    # Connect to END node (terminal node)
    workflow.add_edge("list_reservations", END)
    workflow.add_edge("create_reservation", END)
    
    # Compile and run
    compiled = workflow.compile()
    result = compiled.invoke({})
    print("Result:", result)
    return result

if __name__ == "__main__":
    print("Testing conditional edges in LangGraph 0.0.19...")
    test_conditional_edges()