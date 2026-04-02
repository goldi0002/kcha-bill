CREATE TABLE Categories (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name NVARCHAR(100) NOT NULL
);

CREATE TABLE Products (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name NVARCHAR(150) NOT NULL,
    CategoryId INTEGER NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    DefaultDiscount DECIMAL(18,2) NULL,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);

CREATE TABLE Bills (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    InvoiceNumber NVARCHAR(30) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    TotalAmount DECIMAL(18,2) NOT NULL,
    DiscountAmount DECIMAL(18,2) NOT NULL,
    TaxAmount DECIMAL(18,2) NOT NULL,
    FinalAmount DECIMAL(18,2) NOT NULL
);

CREATE TABLE BillItems (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    BillId INTEGER NOT NULL,
    ProductId INTEGER NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    Total DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (BillId) REFERENCES Bills(Id),
    FOREIGN KEY (ProductId) REFERENCES Products(Id)
);

INSERT INTO Categories (Name) VALUES
('Grocery'), ('Biscuits'), ('Electronics');

INSERT INTO Products (Name, CategoryId, Price, DefaultDiscount, IsActive) VALUES
('Basmati Rice',1,120,5,1),
('Atta (Wheat Flour)',1,55,2,1),
('Mustard Oil',1,180,5,1),
('Sugar',1,45,0,1),
('Dal Chana',1,95,0,1),
('Parle-G',2,10,0,1),
('Oreo',2,40,2,1),
('Bourbon Biscuit',2,25,1,1),
('Monaco Salted',2,20,1,1),
('Good Day',2,30,1,1),
('USB Cable (1m)',3,149,10,1),
('Earphones',3,299,15,1),
('Bulb LED 9W',3,75,5,1),
('Extension Board',3,349,20,1),
('Phone Stand',3,199,10,1);
