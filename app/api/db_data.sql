-- SQLLITE


DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Users;

CREATE TABLE Products (
    name TEXT PRIMARY KEY,
    price INTEGER NOT NULL,
    description TEXT NOT NULL,
    imglink TEXT NOT NULL
);


-- inserir produtos q tao À venda na loja

insert into Products  values ('camisola', 15, 'Camisola bue fixe do deti, até manda rateres oh filho','camisola.jpg');
insert into Products  values ('caneca', 10 , 'Ganda caneca pra beberes café oh guedes','caneca.jpg' );
insert into Products  values ('t-shirt', 20, 'T-shirt bue fixe do deti, até manda rateres oh filho','tshirt.jpg' );


CREATE TABLE Users(
    username TEXT PRIMARY KEY,
    pass TEXT NOT NULL
);

insert into Users values ('admin', 'admin');



