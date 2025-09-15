# Use official Python base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Install required system packages
RUN apt-get update && apt-get install -y \
    wget \
    git \
    git-lfs \
    build-essential \
    cmake && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
RUN pip install torch transformers sentencepiece


# Clone the model repository using git-lfs to get all files
RUN git lfs install && \
    git clone https://huggingface.co/prem-research/prem-1B-SQL model && \
    cd model && git lfs pull

# Copy the inference script into the container
COPY run_inference.py /app/run_inference.py

# Run the inference script
CMD ["python", "run_inference.py"]
