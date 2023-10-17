DROP TABLE IF EXISTS Products;

DROP TABLE IF EXISTS Users;

DROP TABLE IF EXISTS Orders;

DROP TABLE IF EXISTS Payments;

CREATE TABLE Products (
    name TEXT PRIMARY KEY,
    price INTEGER NOT NULL,
    description TEXT NOT NULL,
    imglink TEXT NOT NULL,
    stock INTEGER NOT NULL
);

-- inserir produtos q tao À venda na loja
insert into
    Products
values
    (
        'camisola',
        15,
        'Camisola bue fixe do deti, até manda rateres oh filho',
        'camisola.jpg',
        36
    );

insert into
    Products
values
    (
        'caneca',
        10,
        'Ganda caneca pra beberes café oh guedes',
        'caneca.jpg',
        6
    );

insert into
    Products
values
    (
        't-shirt',
        20,
        'T-shirt bue fixe do deti, até manda rateres oh filho',
        'tshirt.jpg',
        53
    );

Insert into
    Products
values
    (
        'hoodie',
        30,
        'Hoodie bue fixe do deti, até manda rateres oh filho',
        'hoodie.jpg',
        0
    );

Insert into
    Products
values
    ('cringe', 0, 'DiesOfCringe', 'homem.jpg', 99);

CREATE TABLE Users(
    username TEXT PRIMARY KEY,
    pass TEXT NOT NULL
);

insert into
    Users
values
    ('admin', 'admin');

insert into
    Users
values
    ('dev', '12345');

Create table Orders(
    ORDER_id TEXT PRIMARY KEY,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    email TEXT NOT NULL,
    phonenumber TEXT NOT NULL,
    ship_address TEXT NOT NULL,
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    zipcode TEXT NOT NULL,
    username TEXT NOT NULL,
    products_info TEXT NOT NULL,     -- json tipo o do cart
    total_price INTEGER NOT NULL,
    FOREIGN KEY (username) REFERENCES Users(username)
    
);

Create table Payments(
    ORDER_id INTEGER PRIMARY KEY,
    payment_method TEXT NOT NULL,
    payment_amount INTEGER NOT NULL,
    FOREIGN KEY (ORDER_id) REFERENCES Orders(ORDER_id)
);

INSERT INTO Orders (firstname, lastname, email, phonenumber, ship_address, country, city, zip_code, username, products_info)
VALUES
    ('John', 'Doe', 'john@example.com', '555-123-4567', '123 Main St', 'USA', 'New York', '10001', 'johndoe', '["Product A", "Product B"]'),
    ('Alice', 'Smith', 'alice@example.com', '555-987-6543', '456 Elm St', 'USA', 'Los Angeles', '90001', 'alicesmith', '["Product C", "Product D"]'),
    ('Bob', 'Johnson', 'bob@example.com', '555-789-1234', '789 Oak St', 'Canada', 'Toronto', 'M1M 1M1', 'bobjohnson', '["Product E", "Product F"]'),
    ('Eva', 'Williams', 'eva@example.com', '555-234-5678', '567 Birch St', 'UK', 'London', 'SW1A 1AA', 'evawilliams', '["Product G", "Product H"]'),
    ('Mike', 'Brown', 'mike@example.com', '555-345-6789', '890 Pine St', 'Australia', 'Sydney', '2000', 'mikebrown', '["Product I", "Product J"]');
