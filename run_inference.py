from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch

# Load the tokenizer and model from local directory
model_dir = "./model"
tokenizer = AutoTokenizer.from_pretrained(model_dir)
model = AutoModelForSeq2SeqLM.from_pretrained(model_dir)

# Sample input query
input_text = "translate to SQL: Show all customers who made a purchase in the last 30 days"

# Tokenize input
inputs = tokenizer.encode(input_text, return_tensors="pt")

# Generate output
outputs = model.generate(inputs, max_length=100, num_beams=4, early_stopping=True)

# Decode and print the result
sql_query = tokenizer.decode(outputs[0], skip_special_tokens=True)
print("Generated SQL Query:")
print(sql_query)
