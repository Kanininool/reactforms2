from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
import time

# Set up Chrome options for headless mode
options = Options()
options.add_argument("--headless")  # Run in headless mode
options.add_argument("--no-sandbox")  # Bypass OS security model
options.add_argument("--disable-dev-shm-usage")  # Overcome limited resource problems
options.add_argument("--disable-gpu")  # Disable GPU acceleration
options.add_argument("--window-size=1920,1080")  # Set window size

# Initialize WebDriver
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# Navigate to Google
driver.get("https://www.google.com")
time.sleep(2)

# Search for "react"
search_box = driver.find_element(By.NAME, "q")
search_box.send_keys("react")
search_box.send_keys(Keys.RETURN)
time.sleep(3)

# Optionally, print the title of the results page
print(driver.title)

# Close the browser
driver.quit()
