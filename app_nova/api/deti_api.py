import json
from flask_cors import CORS
import os
import threading
import random
import time
import sqlite3
from flask import Flask, jsonify, request, Response

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
    
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        username = data["username"]
        password = data["password"]

        conn = sqlite3.connect("LojaDeti.db")
        cursor = conn.cursor()

        # Debugging: Print the SQL query and its parameters
        print("SQL Query:", "SELECT * FROM Users WHERE username = ? AND password = ?", (username, password))

        cursor.execute("SELECT * FROM Users WHERE username = ? AND password = ?", (username, password))
        user = cursor.fetchone()

        print("User:", user)  # Debugging: Print the user variable

        conn.close()

        if user is None:
            return Response(status=401, response=json.dumps({"error": "Invalid credentials"}))
        else:
            print ("Login successful")
            return Response(status=200, response=json.dumps({"message": "Login successful"}))
    except Exception as e:
        return jsonify({"error": str(e)})
    
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
    app.run(debug=True, port=5000)
