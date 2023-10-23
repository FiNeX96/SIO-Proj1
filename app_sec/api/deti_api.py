import json
import random
import sqlite3
from flask import Flask, Response, jsonify, make_response, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, get_jwt, verify_jwt_in_request
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'siouadeti23'
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "*"}})

LOGGEDOUT= set() # isto atribui um token novo a cada login, isto é para o logout "remover" o token em server side


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

        if user and check_password_hash(user[1], password): # check the password
            print("User found")
            if user == "admin":
                access_token = create_access_token(identity=username, additional_claims={"role": "admin"})
            else:
                access_token = create_access_token(identity=username, additional_claims={"role": "user"})
            return jsonify(access_token=access_token), 200
        else:
            print("User not found")
            return Response(
                status=404, response=json.dumps({"error": "Invalid credentials"})
            )

    except Exception as e:
        print(e)
        return Response(status=404, response=json.dumps({"error": str(e)}))


@app.route('/verify', methods=['GET'])
@jwt_required()
def verify(): # verify that the user is logged in
    try:
        current_user = get_jwt_identity()
        return jsonify(logged_in_as=current_user), 200
    except Exception as e:
        print(e)
        return Response(status=404, response=json.dumps({"error": str(e)}))


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
            cursor.execute("INSERT INTO Users VALUES (?, ?)", (username, hashed_password))
            conn.commit()
            conn.close()
            return jsonify({"message": "User registered successfully"})
        except sqlite3.IntegrityError as e:
            print(e)
            return Response(status=409, response=json.dumps({"error": str(e)}))
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)})
    
############################ End Register

############################ Logout


@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return jti in LOGGEDOUT

@app.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    LOGGEDOUT.add(jti)
    return jsonify({"message": "Successfully logged out"}), 200



############################ End logout



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
        # print("imglink -> " + product[3])

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
    
@app.route("/search/<product_name>", methods=["GET"])
def search(product_name):
    conn = sqlite3.connect("LojaDeti.db")
    cursor = conn.cursor()
    cursor.execute("Select name,price FROM Products WHERE name LIKE ?", ('%'+product_name+'%',))
    product = cursor.fetchmany(5)
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




@app.route("/updatePassword", methods=["PUT"])
def updatePassword():
    try:
        data = request.get_json()
        username = data["username"]
        new_password = data["newPassword"]
        atual_password = data["atualPassword"]
        conn = sqlite3.connect("LojaDeti.db")
        cursor = conn.cursor()
        cursor.execute("SELECT pass FROM Users WHERE username = ?", (username,))
        password = cursor.fetchone()
        if check_password_hash(password[0], atual_password):
            try:
                new_password = generate_password_hash(new_password, method="pbkdf2:sha256")
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
        else:
            return Response(status=404, response=json.dumps({"error": "Wrong actual password"}))
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)})
    
@app.route("/resetPassword", methods=["PUT"])
def resetPassword():
    try:
        data = request.get_json()
        username = data["username"]
        new_password = data["newPassword"]  # Assuming a field called "newPassword" for the new password
        atual_password = data["atualPassword"]

        conn = sqlite3.connect("LojaDeti.db")
        cursor = conn.cursor()
        cursor.execute("SELECT pass FROM Users WHERE username = ?", (username,))
        password = cursor.fetchone()
        print(password)
        print(atual_password)
        print(check_password_hash(password[0], atual_password))
        if check_password_hash(password[0], atual_password):
            try:
                new_password = generate_password_hash(new_password, method="pbkdf2:sha256")
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
        else:
            return Response(status=404, response=json.dumps({"error": "Wrong actual password"}))
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)})
    




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
    
    claims = verify_jwt_in_request()

    # if 'roles' in claims and 'admin' in claims['roles']:
    #      pass
    # else:
    #     return Response(status=401, response=json.dumps({"error": "Unauthorized"}))
        
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
                 "SELECT stock FROM Products WHERE name = ? ;", (product,)
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
        total = data["total"]
        order_id = "".join(random.choice("0123456789ABCDEF") for i in range(16))
        conn = sqlite3.connect("LojaDeti.db")
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO Orders (username,ORDER_id,firstname,lastname,email,phonenumber,ship_address,country,city,zipcode,products_info,total_price) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
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
    with open("api/db_data.sql", "r") as sql_file:
        sql_commands = sql_file.read().split(";")

        for command in sql_commands:
            cursor.execute(command)

    conn.commit()
    conn.close()
    app.run(debug=True, port=5000)
