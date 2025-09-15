from llama_cpp import Llama

MODEL_PATH = "models/llama-2-7b-chat.Q4_K_M.gguf"

def generate_sql_query(prompt_text):
    llm = Llama(model_path=MODEL_PATH)
    prompt = f"""You are an expert SQL generator. Convert the following natural language request into a SQL query:
Request: "{prompt_text}"
SQL:"""
    output = llm(prompt, max_tokens=256)
    print("Generated SQL:\n", output["choices"][0]["text"].strip())

if __name__ == "__main__":
    user_input = input("Enter your natural language request: ")
    generate_sql_query(user_input)
