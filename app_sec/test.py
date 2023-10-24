from werkzeug.security import generate_password_hash, check_password_hash

hash = 'pbkdf2:sha256:600000$We0wHkqarD3rm8d7$941bd2fc805b104dcbe2bfec232168ce7d94a0798d790cf1f134d9b12bd67b1e'
password = '12345'

print(check_password_hash(hash, password))

