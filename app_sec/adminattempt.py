import requests


# testar se um user consegue aceder aos endpoints de admin
# logar como um user no site, ctrl shift i -> Application -> Local Storage e copiar o access token para esta variável
# deve dar erro 401 Unauthorized
jwt_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY5ODMyODI3MiwianRpIjoiNDBkZDNiM2YtMjU1Mi00NjhhLWExYWYtZTU3ZWViYzAyMTMxIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6InByZXRvIiwibmJmIjoxNjk4MzI4MjcyLCJleHAiOjE2OTgzMjkxNzIsInJvbGUiOiJ1c2VyIn0.QzuL-cMmlPP30zCYCTwlZA2siZGpBzdPz6_iOk7VwUQ'


headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {jwt_token}'
}

response = requests.get('http://localhost:5000/get_all_orders', headers=headers)

# print the status code and the response
print(response.status_code)
print(response.json())
