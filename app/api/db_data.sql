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
        'Caneca do Deti',
        15,
        'Ganda caneca para representar o departamento de informática ( e do resto ) e pa beber café no aquário',
        'caneca_deti.jpg',
        36
    );

insert into
    Products
values
    (
        'Pin do Deti',
        5,
        'Ganda pin para representar o departamento de informática ( e do resto ) e pa meter na mochila',
        'brooch_deti.jpg',
        60
    );

insert into
    Products
values
    (
        'T-shirt do Deti',
        20,
        'T-shirt bue fixe do deti, até manda rateres oh filho',
        'tshirt_deti1.jpg',
        53
    );

Insert into
    Products
values
    (
        'Chapéu do Deti',
        10,
        'Chapéu bue cool nice para derramar azeite',
        'cap_deti.jpg',
        86
    );


Insert into
    Products
values
    ('Sweat do Deti', 25, 'Descrição bue fixe', 'sweat_deti1.jpg', 45);

    Insert into
    Products
values
    ('Capa pro Telemobil do Deti', 25, 'Ganda capa bue cool nice fixe swag', 'capa_deti.jpg', 69);

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
    products_info TEXT NOT NULL, -- cart json
    total_price INTEGER NOT NULL,
    payment_type TEXT NOT NULL,
    FOREIGN KEY (username) REFERENCES Users(username)
    
);


