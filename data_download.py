import requests
import json

url = "https://api.themoviedb.org/3/trending/all/day"

headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhZGQwYWZmOWY0N2I0ZWJiZTAwM2M1OTVmNWQwZjNjMiIsIm5iZiI6MTcyMDQ0NjAxNC40OTk3ODgsInN1YiI6IjY2OGFiODg2ODE1Yjk4NTEyMTE4MjcyMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FuJxCvc0kIgNHU7Fl32BQF5dAUaBXmdhXHkFQ9ciMJ8"
}

response = requests.get(url, headers=headers)

if response.status_code == 200:
    data = response.json()  # Parse JSON response

    with open('data.json', 'w') as json_file:
        json.dump(data, json_file, indent=4)  # Save JSON to file with pretty formatting

    print("JSON data saved successfully.")
else:
    print(f"Failed to retrieve data. Status code: {response.status_code}")