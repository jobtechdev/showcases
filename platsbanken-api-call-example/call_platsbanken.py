import requests

url = "http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesgrupper"

parameters = {"yrkesomradeid":4}

headers = {"Accept-Language":"application/json" }

response = requests.get(url, headers=headers, params=parameters)




print( response.status_code, response.content)
