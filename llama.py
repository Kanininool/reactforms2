from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# Load Phi-2 model and tokenizer
model_name = "microsoft/phi-2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16, device_map="auto")

# Define schema
schema = """
Database: employee_db
Tables:
- personal(emp_id, name, age, city)
- work(emp_id, department, designation, doj)
- asset(emp_id, laptop_id, phone_id)
- project(emp_id, project_name, role, start_date, end_date)
"""

def generate_sql(nl_query: str, schema: str = schema) -> str:
    prompt = f"""You are a helpful assistant that converts natural language to SQL.

Schema:
{schema}

Question:
{nl_query}

SQL:"""

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    outputs = model.generate(**inputs, max_new_tokens=256, temperature=0.2)
    sql = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Extract only the SQL part
    sql_lines = sql.split("SQL:")
    return sql_lines[-1].strip() if len(sql_lines) > 1 else sql.strip()

# Example usage
if __name__ == "__main__":
    question = input("Enter your question: ")
    sql_query = generate_sql(question)
    print("\nGenerated SQL:\n", sql_query)
