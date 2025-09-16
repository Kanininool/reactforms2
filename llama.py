from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

# Load TinyLlama model
model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name)

# Create text generation pipeline
generator = pipeline("text-generation", model=model, tokenizer=tokenizer)

# Define schema context
schema_context = """
Database: employee_db
Tables:
- personal(id, name, city, dob)
- work(id, designation, doj, salary)
- asset(id, laptop_id, phone_id)
- project(id, project_name, start_date, end_date)

Convert the following natural language question into a SQL query:
"""

def nl_to_sql(nl_query):
    prompt = f"{schema_context}\nQuestion: {nl_query}\nSQL:"
    response = generator(prompt, max_new_tokens=150, do_sample=False)
    sql_query = response[0]['generated_text'].split("SQL:")[-1].strip()
    return sql_query

# Example usage
if __name__ == "__main__":
    user_input = "List all employees who joined after 2020 and work in Bangalore"
    sql = nl_to_sql(user_input)
    print("Generated SQL Query:\n", sql)
