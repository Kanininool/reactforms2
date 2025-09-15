# Use official Python base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install required system packages
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install torch transformers

# Create model directory
RUN mkdir -p /app/model

# Download model files using wget
RUN wget https://huggingface.co/anilajax/text2sql_industry_standard/resolve/main/config.json -O model/config.json && \
    wget https://huggingface.co/anilajax/text2sql_industry_standard/resolve/main/pytorch_model.bin -O model/pytorch_model.bin && \
    wget https://huggingface.co/anilajax/text2sql_industry_standard/resolve/main/tokenizer_config.json -O model/tokenizer_config.json && \
    wget https://huggingface.co/anilajax/text2sql_industry_standard/resolve/main/spiece.model -O model/spiece.model && \
    wget https://huggingface.co/anilajax/text2sql_industry_standard/resolve/main/special_tokens_map.json -O model/special_tokens_map.json && \
    wget https://huggingface.co/anilajax/text2sql_industry_standard/resolve/main/generation_config.json -O model/generation_config.json

# Copy the inference script into the container
COPY run_inference.py /app/run_inference.py

# Run the inference script
CMD ["python", "run_inference.py"]
