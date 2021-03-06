create table user
(
	UserID integer primary key autoincrement,
	Username text not null default '',
	Password varchar(65) not null default '',
	FirstName text not null default '',
	LastName text not null default ''
);

create table trip
(
	TripID integer primary key,
	Origin text,
	Destination text,
	StartDate text,
	EndDate text,
	TripOwner int not null,
	foreign key (TripOwner) references user (UserID)
);

create table expense
(
	ExpenseID integer primary key,
	Item text,
	Price real,
	Quantity int,
	PurchaseDate text,
	ExpenseOwner int not null,
	foreign key (ExpenseOwner) references user (UserID)
);

create table vehicle
(
	VehicleID integer primary key,
	Make text,
	Model text,
	Year int,
	MPG real,
	TankSize real,
	VehicleOwner int not null,
	foreign key (VehicleOwner) references user (UserID)
);