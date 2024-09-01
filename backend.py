import requests

entries = requests.get("https://itch.io/jam/389387/entries.json")

with open("entries.json", "w") as file :
	file.write(entries.text)
