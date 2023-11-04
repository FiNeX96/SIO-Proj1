import json
import random
import sqlite3
from flask import Flask, Response, jsonify, make_response, request
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt,
    verify_jwt_in_request,
)
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import timedelta

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
if app.config["JWT_SECRET_KEY"] is None:
    print("Set the JWT_SECRET_KEY environment variable")
    print("Copiem isto pra bash -> export JWT_SECRET_KEY='siouadeti23' ")
    print("Para remover -> unset JWT_SECRET_KEY ")
    exit(0)
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "*"}})

LOGGEDOUT = (
    set()
)  # isto atribui um token novo a cada login, isto é para o logout "remover" o token em server side


############################ Login


@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        username = data["username"]
        password = data["password"]

        conn = sqlite3.connect("LojaDeti.db")
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM Users WHERE username = ?", (username,))
        user = cursor.fetchone()
        conn.close()

        if user and check_password_hash(user[1], password):  # check the password
            if user[0] == "admin":
                access_token = create_access_token(
                    identity=username,
                    additional_claims={"role": "admin"},
                    expires_delta=timedelta(minutes=30)
                )
                # print("Admin logged in")
            else:
                access_token = create_access_token(
                    identity=username, additional_claims={"role": "user"},
                    expires_delta=timedelta(minutes=30)
                )
                # print("User " + username + " logged in")
            return jsonify(access_token=access_token), 200
        else:
            return Response(
                status=404, response=json.dumps({"error": "Invalid credentials"})
            )

    except Exception as e:
        return Response(status=404, response=json.dumps({"error": "Error while logging in. Please try later."}))


@app.route("/verify", methods=["GET"])
@jwt_required()
def verify():  # verify that the user is logged in
    try:
        current_user = get_jwt_identity()
        return jsonify(logged_in_as=current_user), 200
    except Exception as e:
        return Response(status=404, response=json.dumps({"error": "Error while verifying user. Please try later."}))


############################ End Login

############################ Register


@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        username = data["username"]
        password = data["password"]
        hashed_password = generate_password_hash(password, method="pbkdf2:sha256")

        conn = sqlite3.connect("LojaDeti.db")
        cursor = conn.cursor()

        try:
            cursor.execute(
                "INSERT INTO Users VALUES (?, ?)", (username, hashed_password)
            )
            conn.commit()
            conn.close()
            return jsonify({"message": "User registered successfully"})
        except sqlite3.IntegrityError as e:
            return Response(status=409, response=json.dumps({"error": "This username already exists. Try using a different one"}))
    except Exception as e:
        return jsonify({"error": "Error while registering. Please try again"})


############################ End Register

############################ Logout


@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return jti in LOGGEDOUT


@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    LOGGEDOUT.add(jti)
    return jsonify({"message": "Successfully logged out"}), 200


############################ End logout


############################ Products


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


@app.route("/getinfo/<product_name>", methods=["GET"])
def getCart(product_name):
    conn = sqlite3.connect("LojaDeti.db")
    cursor = conn.cursor()
    # price and
    cursor.execute(
        "SELECT price,imglink FROM Products WHERE name = ? ;", (product_name,)
    )
    product = cursor.fetchone()
    conn.close()
    if product is None:
        return Response(status=404, response=json.dumps({"error": "Product not found"}))
    return Response(
        status=200, response=json.dumps({"price": product[0], "imglink": product[1]})
    )


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


@app.route("/search/<product_name>", methods=["GET"])
def search(product_name):
    conn = sqlite3.connect("LojaDeti.db")
    cursor = conn.cursor()
    cursor.execute(
        "Select name,price FROM Products WHERE name LIKE ?", ("%" + product_name + "%",)
    )
    product = cursor.fetchmany(5)
    # put this in dictionary format
    product_list = []
    for i in product:
        product_list.append({"name": i[0], "price": i[1]})
    conn.close()
    if product is None:
        return Response(status=404, response=json.dumps({"error": "Product not found"}))
    return Response(status=200, response=json.dumps(product_list))


############################ End Products


############################ User Actions ( token needed )


@jwt_required()
@app.route("/checkout", methods=["POST"])
def checkout():
    claims = verify_jwt_in_request()
    try:
        data = request.get_json()
        username = data["username"]
        if "user" in claims[1]["role"] and claims[1]["sub"] == get_jwt_identity():
            pass
        else:
            return Response(status=401, response=json.dumps({"error": "Unauthorized"}))
        firstname = data["firstname"]
        lastname = data["lastname"]
        email = data["email"]
        phonenumber = data["phonenumber"]
        shippingaddress = data["shippingaddress"]
        country = data["country"]
        city = data["city"]
        zipcode = data["zipcode"]
        payment_type = data["payment_type"]
        cart = json.dumps(data["cart"])
        cart_dict = json.loads(cart)
        cart_dict_single = {product["product"]: product for product in cart_dict}
        for product in cart_dict_single:
            conn = sqlite3.connect("LojaDeti.db")
            cursor = conn.cursor()
            cursor.execute("SELECT stock FROM Products WHERE name = ? ;", (product,))
            stock = cursor.fetchone()
            # print("wanted = ", cart_dict[product] )
            if stock[0] < cart_dict_single[product]["quantity"]:
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
                (cart_dict_single[product]["quantity"], product),
            )
            conn.commit()
            conn.close()
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
        return Response(status=404, response=json.dumps({"error": "Error while checking out. Please try later."}))


@jwt_required()
@app.route("/updatePassword", methods=["PUT"])
def updatePassword():
    claims = verify_jwt_in_request()
    try:
        data = request.get_json()
        username = data["username"]
        if "user" in claims[1]["role"] and claims[1]["sub"] == get_jwt_identity():
            pass
        else:
            return Response(status=401, response=json.dumps({"error": "Unauthorized"}))
        new_password = data["newPassword"]
        atual_password = data["atualPassword"]
        conn = sqlite3.connect("LojaDeti.db")
        cursor = conn.cursor()
        #print(new_password)
        #print(atual_password)
        cursor.execute("SELECT pass FROM Users WHERE username = ?", (username,))
        password = cursor.fetchone()
        if check_password_hash(password[0], atual_password):
            try:
                new_password = generate_password_hash(
                    new_password, method="pbkdf2:sha256"
                )
                cursor.execute(
                    "UPDATE Users SET pass =  ?  WHERE username = ?",
                    (new_password, username),
                )
                conn.commit()
                conn.close()
                return jsonify({"message": "Password updated successfully"})
            except sqlite3.IntegrityError as e:
                return Response(status=409, response=json.dumps({"error": "Error while updating password. Please try again"}))
            except Exception as e:
                return jsonify({"error": "Error while updating password. Please try again"}),500
        else:
            return Response(
                status=404, response=json.dumps({"error": "Wrong actual password"})
            )
    except Exception as e:
        return jsonify({"error": "Error while updating password. Please try again"}),500


@jwt_required()
@app.route("/resetPassword", methods=["PUT"])
def resetPassword():
    try:
        data = request.get_json()
        username = data["username"]

        claims = verify_jwt_in_request()
        if "user" in claims[1]["role"] and claims[1]["sub"] == get_jwt_identity():
            pass
        else:
            return Response(status=401, response=json.dumps({"error": "Unauthorized"}))
        new_password = data[
            "newPassword"
        ]  # Assuming a field called "newPassword" for the new password
        atual_password = data["atualPassword"]

        conn = sqlite3.connect("LojaDeti.db")
        cursor = conn.cursor()
        cursor.execute("SELECT pass FROM Users WHERE username = ?", (username,))
        password = cursor.fetchone()
        #print(password)
        #print(atual_password)
        #print(check_password_hash(password[0], atual_password))
        if check_password_hash(password[0], atual_password):
            try:
                new_password = generate_password_hash(
                    new_password, method="pbkdf2:sha256"
                )
                cursor.execute(
                    "UPDATE Users SET pass =  ?  WHERE username = ?",
                    (new_password, username),
                )
                conn.commit()
                conn.close()
                return jsonify({"message": "Password updated successfully"})
            except Exception as e:
                print(e)
                return jsonify({"error": "Error while reseting password. Please try again"}),500
        else:
            return Response(
                status=404, response=json.dumps({"error": "Wrong actual password"})
            )
    except Exception as e:
        return jsonify({"error": "Error while reseting password. Please try again"}),500


@jwt_required()
@app.route("/get_orders/<username>", methods=["GET"])
def get_orders(username):
    claims = verify_jwt_in_request()

    # only the user can access this endpoint

    if "user" in claims[1]["role"] and claims[1]["sub"] == get_jwt_identity():
        pass
    else:
        return Response(status=401, response=json.dumps({"error": "Unauthorized"}))

    conn = sqlite3.connect("LojaDeti.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Orders WHERE username = ?", (username,))
    orders = cursor.fetchall()
    conn.close()
    if orders is None or orders == []:
        return Response(status=404, response=json.dumps({"error": "Orders not found"}))
    else:
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
        return jsonify(order_list), 200


############################ End User Actions

############################ Admin endpoints


@jwt_required()
@app.route("/get_all_orders", methods=["GET"])
def get_all_orders():
    claims = verify_jwt_in_request()

    # only admin can access this endpoint
    if "admin" == claims[1]["role"] and claims[1]["sub"] == get_jwt_identity():
        pass
    else:
        return Response(status=401, response=json.dumps({"error": "Unauthorized"}))

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

@jwt_required()
@app.route('/update_stock/<product_name>', methods=['PUT'])
def update_stock(product_name):
    # only admin can access this endpoint
    claims = verify_jwt_in_request()
    if "admin" == claims[1]["role"] and claims[1]["sub"] == get_jwt_identity():
        pass
    else:
        return Response(status=401, response=json.dumps({"error": "Unauthorized"}))
    try:
        data = request.get_json()
        new_stock = data.get("newStock")
        #print(data)

        if new_stock is None:
            return jsonify({"error": "Invalid data. 'newStock' field is missing."}), 400

        conn = sqlite3.connect("LojaDeti.db")
        cursor = conn.cursor()

        cursor.execute("UPDATE Products SET stock = ? WHERE name = ?", (new_stock, product_name))
        conn.commit()
        conn.close()

        return jsonify({"message": "Stock updated successfully"})

    except Exception as e:
        return jsonify({"error": "Error updating stock"}, 404)
    
@jwt_required()    
@app.route('/update_price/<product_name>', methods=['PUT'])
def update_price(product_name):
    claims = verify_jwt_in_request()
    if "admin" == claims[1]["role"] and claims[1]["sub"] == get_jwt_identity():
        pass
    else:
        return Response(status=401, response=json.dumps({"error": "Unauthorized"}))
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
        return jsonify({"error": "Error updating price"}, 404)
    
    
@jwt_required()
@app.route("/change_order", methods=["PUT"])
def change_order():
    claims = verify_jwt_in_request()
    if "admin" == claims[1]["role"] and claims[1]["sub"] == get_jwt_identity():
        pass
    else:
        return Response(status=401, response=json.dumps({"error": "Unauthorized"}))
    data = request.get_json()
    conn = sqlite3.connect("LojaDeti.db")
    cursor = conn.cursor()

    order_id = data["order_id"]
    firstname = data["firstname"]
    lastname = data["lastname"]
    email = data["email"]
    phonenumber = data["phonenumber"]
    ship_address = data["ship_address"]
    country = data["country"]
    city = data["city"]
    zip_code = data["zip_code"]
    products_info = data["products_info"]

    cursor.execute(
        "UPDATE Orders SET firstname=?, lastname=?, email=?, phonenumber=?, ship_address=?, country=?, city=?, zipcode=?, products_info=? WHERE ORDER_id=?",
        (
            firstname,
            lastname,
            email,
            phonenumber,
            ship_address,
            country,
            city,
            zip_code,
            products_info,
            order_id,
        ),
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "Order updated successfully"})


############################ End Admin Endpoints


if __name__ == "__main__":
    conn = sqlite3.connect("LojaDeti.db")
    cursor = conn.cursor()


    cursor.executescript(open("api/db_data.sql", "r").read())

    conn.commit()
    conn.close()
    app.run(debug=True, host="0.0.0.0", port=5000)
