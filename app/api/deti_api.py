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
    conn = sqlite3.connect("LojaDeti.db")
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
            "imglink": product[3],
            "stock": product[4],
        }

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


@app.route("/getinfo/<product_name>", methods=["GET"])
def getCart(product_name):
    conn = sqlite3.connect("LojaDeti.db")
    cursor = conn.cursor()
    # price and
    cursor.execute(
        "SELECT price,imglink FROM Products WHERE name = '" + product_name + "'"
    )
    product = cursor.fetchone()
    conn.close()
    if product is None:
        return Response(status=404, response=json.dumps({"error": "Product not found"}))
    return Response(
        status=200, response=json.dumps({"price": product[0], "imglink": product[1]})
    )
    
@app.route("/search/<product_name>", methods=["GET"])
def search(product_name):
    conn = sqlite3.connect("LojaDeti.db")
    cursor = conn.cursor()
    
    cursor.execute(
    "SELECT name,price FROM Products WHERE name LIKE '%" + product_name + "%'"
)
    product = cursor.fetchmany(10)
    # put this in dictionary format
    product_list = []
    for i in product:
        product_list.append({"name": i[0], "price": i[1]})     
    conn.close()
    if product is None:
        return Response(status=404, response=json.dumps({"error": "Product not found"}))
    return Response(
        status=200, response=json.dumps(product_list)
    )


@app.route("/login", methods=["OPTIONS"])
def preflight():
    response = make_response()
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type"
    # print("preflight") tá a funcionar
    return response

@app.route("/updatePassword", methods=["PUT"])
def updatePassword():
    try:
        data = request.get_json()
        username = data["username"]
        new_password = data["newPassword"]  # Assuming a field called "newPassword" for the new password

        conn = sqlite3.connect("LojaDeti.db")
        cursor = conn.cursor()
        print("UPDATE Users SET password = " + new_password + " WHERE username = " + username)
        try:
            cursor.execute("UPDATE Users SET pass =  ?  WHERE username = ?", (new_password, username))
            conn.commit()
            conn.close()
            return jsonify({"message": "Password updated successfully"})
        except sqlite3.IntegrityError as e:
            print(e)
            return Response(status=409, response=json.dumps({"error": str(e)}))
        except Exception as e:
            print(e)
            return jsonify({"error": str(e)})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)})
    
@app.route("/resetPassword", methods=["PUT"])
def resetPassword():
    try:
        data = request.get_json()
        username = data["username"]
        new_password = data["newPassword"]  # Assuming a field called "newPassword" for the new password

        conn = sqlite3.connect("LojaDeti.db")
        cursor = conn.cursor()
        print("UPDATE Users SET password = " + new_password + " WHERE username = " + username)
        try:
            cursor.execute("UPDATE Users SET pass =  ?  WHERE username = ?", (new_password, username))
            conn.commit()
            conn.close()
            return jsonify({"message": "Password updated successfully"})
        except sqlite3.IntegrityError as e:
            print(e)
            return Response(status=409, response=json.dumps({"error": str(e)}))
        except Exception as e:
            print(e)
            return jsonify({"error": str(e)})
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)})

@app.route('/update_stock/<product_name>', methods=['PUT'])
def update_stock(product_name):
    try:
        data = request.get_json()
        new_stock = data.get("newStock")
        print(data)

        if new_stock is None:
            return jsonify({"error": "Invalid data. 'newStock' field is missing."}), 400

        conn = sqlite3.connect("LojaDeti.db")
        cursor = conn.cursor()

        cursor.execute("UPDATE Products SET stock = ? WHERE name = ?", (new_stock, product_name))
        conn.commit()
        conn.close()

        return jsonify({"message": "Stock updated successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}, 404)
    
@app.route('/update_price/<product_name>', methods=['PUT'])
def update_price(product_name):
    try:
        data = request.get_json()
        new_price = data.get("newPrice")
        print(data)

        if new_price is None:
            return jsonify({"error": "Invalid data. 'newPrice' field is missing."}), 400

        conn = sqlite3.connect("LojaDeti.db")
        cursor = conn.cursor()

        cursor.execute("UPDATE Products SET price = ? WHERE name = ?", (new_price, product_name))
        conn.commit()
        conn.close()

        return jsonify({"message": "Price updated successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}, 404)


@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        username = data["username"]
        password = data["password"]

        conn = sqlite3.connect("LojaDeti.db")
        cursor = conn.cursor()

        query = (
            "SELECT * FROM Users WHERE username ='"
            + username
            + "' AND pass ='"
            + password
            + "'"
        )

        cursor.execute(query)
        # execute so deixa executar 1, é seguro contra sql injection
        user = cursor.fetchone()
        conn.close()

        if user:
            print("User found")
            return Response(
                status=200, response=json.dumps({"message": "Login successful"})
            )
        else:
            print("User not found")
            return Response(
                status=401, response=json.dumps({"error": "Invalid credentials"})
            )

    except Exception as e:
        print(e)
        return Response(status=404, response=json.dumps({"error": str(e)}))


@app.route("/get_product/<product_name>", methods=["GET"])
def get_product(product_name):
    conn = sqlite3.connect("LojaDeti.db")
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
            "imglink": product[3],
        }
        return jsonify(product_dict)

@app.route("/get_all_orders", methods=["GET"])
def get_all_orders():
    conn = sqlite3.connect("LojaDeti.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Orders")
    orders = cursor.fetchall()
    conn.close()
    
    order_list = []
    for order in orders:
        order_dict = {
            "ORDER_id": order[0],
            "firstname": order[1],
            "lastname": order[2],
            "email": order[3],
            "phonenumber": order[4],
            "ship_address": order[5],
            "country": order[6],
            "city": order[7],
            "zip_code": order[8],
            "username": order[9],
            "products_info": order[10],
            "total_price": order[11],
            "payment_type": order[12],
        }
        order_list.append(order_dict)
    
    return jsonify(order_list)


@app.route('/change_order', methods=['PUT'])
def change_order():
    data = request.get_json()
    conn = sqlite3.connect("LojaDeti.db")
    cursor = conn.cursor()

    print(data)
    order_id = data['order_id']
    firstname = data['firstname']
    lastname = data['lastname']
    email = data['email']
    phonenumber = data['phonenumber']
    ship_address = data['ship_address']
    country = data['country']
    city = data['city']
    zip_code = data['zip_code']
    products_info = data['products_info']

    cursor.execute("UPDATE Orders SET firstname=?, lastname=?, email=?, phonenumber=?, ship_address=?, country=?, city=?, zipcode=?, products_info=? WHERE ORDER_id=?", (firstname, lastname, email, phonenumber, ship_address, country, city, zip_code, products_info, order_id))

    conn.commit()
    conn.close()

    return jsonify({"message": "Order updated successfully"})

@app.route("/checkout", methods=["POST"])
def checkout():
    try:
        data = request.get_json()
        username = data["username"]
        firstname = data["firstname"]
        lastname = data["lastname"]
        email = data["email"]
        phonenumber = data["phonenumber"]
        shippingaddress = data["shippingaddress"]
        country = data["country"]
        city = data["city"]
        zipcode = data["zipcode"]
        cart = json.dumps(data["cart"])
        cart_dict = json.loads(cart)
        cart_dict_single = {product['product']: product for product in cart_dict}
        for product in cart_dict_single:
             conn = sqlite3.connect("LojaDeti.db")
             cursor = conn.cursor()
             cursor.execute(
                 "SELECT stock FROM Products WHERE name = '" + product + "' ;"
             )
             stock = cursor.fetchone()
             #print("wanted = ", cart_dict[product] )
             if stock[0] < cart_dict_single[product]['quantity']:
                 return Response(
                     status=409,
                     response=json.dumps(
                         {
                             "message": "Not enough stock for product "
                            + product
                            + " to fullfill this order!"
                         }
                     ),
                 )
        for product in cart_dict_single:
            # remove stock from db
            conn = sqlite3.connect("LojaDeti.db")
            cursor = conn.cursor()
            cursor.execute(
                "UPDATE Products SET stock = stock - ? WHERE name = ? ;",
                (cart_dict_single[product]['quantity'], product),
            )
            conn.commit()
            conn.close()
        payment_type = data["payment_type"]
        total = data["total"]
        order_id = "".join(random.choice("0123456789ABCDEF") for i in range(16))
        conn = sqlite3.connect("LojaDeti.db")
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO Orders (username,ORDER_id,firstname,lastname,email,phonenumber,ship_address,country,city,zipcode,products_info,total_price,payment_type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (
                username,
                order_id,
                firstname,
                lastname,
                email,
                phonenumber,
                shippingaddress,
                country,
                city,
                zipcode,
                cart,
                total,
                payment_type
            ),
        )
        conn.commit()
        return Response(
            status=200,
            response=json.dumps({"message": "Order registered successfully"}),
        )

    except Exception as e:
        print (e)
        return Response(status=404, response=json.dumps({"error": str(e)}))


if __name__ == "__main__":
    conn = sqlite3.connect("LojaDeti.db")
    cursor = conn.cursor()

    # load database
    # with open("api/db_data.sql", "r") as sql_file:
    #     sql_commands = sql_file.read().split(";")

    #     for command in sql_commands:
    #         cursor.execute(command)
    cursor.executescript(open('api/db_data.sql', 'r').read())

    conn.commit()
    conn.close()
    app.run(debug=True,host='0.0.0.0', port=5000)
