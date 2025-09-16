from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline

# Replace with your local path
local_model_path = "/path/to/TinyLlama-1.1B-Chat-v1.0"

tokenizer = AutoTokenizer.from_pretrained(local_model_path)
model = AutoModelForCausalLM.from_pretrained(local_model_path)

generator = pipeline("text-generation", model=model, tokenizer=tokenizer)

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

if __name__ == "__main__":
    user_input = "Show all employees working on the Apollo project"
    print("Generated SQL:\n", nl_to_sql(user_input))
