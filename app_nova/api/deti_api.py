import json
import os
import random
import sqlite3
import threading
import time

from flask import Flask, Response, jsonify, make_response, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/get_products", methods=["GET"])
def get_products():
    conn = sqlite3.connect(
        "LojaDeti.db"
    )  # Change 'your_database.db' to your database file name
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM Products")
    products = cursor.fetchall()

    conn.close()

    # Convert the data to a list of dictionaries
    product_list = []
    for product in products:
        product_dict = {
            "name": product[0],
            "price": product[1],
            "description": product[2],
            "imglink": product[3]
        }
        #print("imglink -> " + product[3])
        
    
        product_list.append(product_dict)

    return jsonify(product_list)

@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        username = data["username"]
        password = data["password"]

        conn = sqlite3.connect("LojaDeti.db")
        cursor = conn.cursor()
        
        try:
            cursor.execute("INSERT INTO Users VALUES (?, ?)", (username, password))
            conn.commit()
            conn.close()
            return jsonify({"message": "User registered successfully"})
        except sqlite3.IntegrityError as e:
            return Response(status=409, response=json.dumps({"error": str(e)}))
    except Exception as e:
        return jsonify({"error": str(e)})
    
@app.route("/login", methods=["OPTIONS"])
def preflight():
    response = make_response()
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    #print("preflight") tá a funcionar 
    return response
    
@app.route("/login", methods=["POST"])
def login():
    try:        
        #print("recebi request")
        data = request.get_json()
        username = data["username"]
        password = data["password"]
        #print("consegui ler o json")

        conn = sqlite3.connect("LojaDeti.db")
        cursor = conn.cursor()

        # Debugging: Print the SQL query and its parameters
        #print("SELECT * FROM Users WHERE username = " + username  "AND pass = " + password)
        query = "SELECT * FROM Users WHERE username ='" + username + "' AND pass ='" + password+"'"
        print(query)

        cursor.execute(query)
        # execute so deixa executar 1, é seguro contra sql injection
        user = cursor.fetchone()
        conn.close()

        if user:
            print("User found")
            return Response(status=200, response=json.dumps({"message": "Login successful"}))
        else:
            print("User not found")
            return Response(status=401, response=json.dumps({"error": "Invalid credentials"}))
        
    except Exception as e:
        print(e)
        return Response(status=404,response = json.dumps({"error": str(e)}))
    
@app.route("/get_product/<product_name>", methods=["GET"])
def get_product(product_name):
    conn = sqlite3.connect(
        "LojaDeti.db"
    )
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Products WHERE name = ?", (product_name,))
    product = cursor.fetchone()
    conn.close()
    if product is None:
        return Response(status=404, response=json.dumps({"error": "Product not found"}))
    else:
        product_dict = {
            "name": product[0],
            "price": product[1],
            "description": product[2],
            "imglink": product[3]
        }
        return jsonify(product_dict)



if __name__ == "__main__":
    conn = sqlite3.connect(
        "LojaDeti.db"
    )  # Change 'your_database.db' to your database file name
    cursor = conn.cursor()

    with open("api/db_data.sql", "r") as sql_file:
        sql_commands = sql_file.read().split(";")

        for command in sql_commands:
            cursor.execute(command)

    conn.commit()
    conn.close()
    app.run( port=5000 )
