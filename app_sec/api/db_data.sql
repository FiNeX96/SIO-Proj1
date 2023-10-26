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
    ('admin', 'pbkdf2:sha256:600000$xDuAXVM90hrwU66E$b51633c03f2f8ec0f406f481727c51fbb745fa86cfeaf6479ed0b9249c8404c4');

insert into
    Users
values
    ('dev', 'pbkdf2:sha256:600000$We0wHkqarD3rm8d7$941bd2fc805b104dcbe2bfec232168ce7d94a0798d790cf1f134d9b12bd67b1e');

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
    products_info TEXT NOT NULL, -- cart json
    total_price INTEGER NOT NULL,
    payment_type TEXT NOT NULL,
    FOREIGN KEY (username) REFERENCES Users(username)
    
);


