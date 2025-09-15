
from llama_cpp import Llama

llm = Llama(
    model_path="./models/llama-2-7b-chat.Q4_K_M.gguf",  # Adjust path as needed
    n_ctx=4096,             # Context window size
    n_batch=512,            # Batch size for inference
    n_gpu_layers=30,        # Number of layers offloaded to GPU (set to 0 for CPU-only)
    f16_kv=True,            # Use fp16 for key/value cache
    verbose=True            # Print debug info
)

response = llm("What is the capital of France?")
print(response)
