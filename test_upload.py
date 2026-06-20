import requests

url = "http://localhost:8000/api/v1/analyze"
file_path = "c:\\Users\\Qayoom\\Desktop\\AI log Analyzer and Incident Explainer\\sample_ibft.log"

try:
    with open(file_path, 'rb') as f:
        files = {'file': f}
        print("Sending request...")
        response = requests.post(url, files=files)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
