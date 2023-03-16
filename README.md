# Capstone : Restaurant Reservation Application

This full-stack web application I worked on as my capstone project for Thinkful's Bootcamp Engineering Program. This is s reservation and seating system for restaurant managers and employees. A user can view reservations by date, add new reservations, edit/cancel/search for existing reservations, add new tables, and seat/unseat reservations at tables.

Thinkful provided a series of user stories to help building the app based on what the user needed.  There were also tests provided to allow for test-driven development.

The original assignment can be found at (https://github.com/Thinkful-Ed/starter-restaurant-reservation)

## Links for deployed application

[Frontend] (https://restaurant-reservation-app-frontend.vercel.app) deployed via Vercel

[Backend] (https://restaurant-reservation-app-backend-qs5flnikc-meshkatul.vercel.app/tables) deployed via Vercel

## Technology Used

### Frontend: 
    Javascript, React, Bootstrap, HTML, CSS

### Backend:
    Node.js, Express, Postgres

## Installation

1. Fork and clone this repository.
2. Run `cp ./back-end/.env.sample ./back-end/.env`.
3. Update the `./back-end/.env` file with the connection URL's to your ElephantSQL database instance.
4. Run `cp ./front-end/.env.sample ./front-end/.env`.
5. You should not need to make changes to the `./front-end/.env` file unless you want to connect to a backend at a location other than `http://localhost:5001`.
6. Run `npm install` to install project dependencies.
7. Run `npm run start:dev` in the backend directory to start the server locally in development mode.


## How the app works

### Pages
#### 1. Dashboard

This is the homepage of the app. The left navigation bar has the links to navigate to **Dashboard**, **Search**, **New Reservation**, and **New Table** pages. 
In dashboard, the user can see the reservations according to the date. The user can select the **Previous Date**, **Today**, and **Next Date** by clicking the button or select a date from the datepicker. The Dashboard page lists all reservations for a particular date, and each reservation contains buttons to Seat, Edit, or Cancel the reservation. The dashboard also lists all tables and each occupied table has a finish button so the client can free up the table.

#### 2. Search

In search page, the user can search the reservations by phone number. If there is any reservation/reservations found, those are displayed as a list. If there are no matching reservations, the page will show "No reservations found" message.

#### 3. New Reservation

The New Reservation page allows a user to create a new reservation. All fields are required and have some constraints. The Reservation Date must be today or future date. The reservation time must be in between 10:30am to 9:30pm. The reservation date and time combination must be in future. Only future reservations are allowed. E.g., if it is noon, only allow reservations starting after noon today. The number of people must be at least 1. If any of the inputs is/are invalid, the user will get an error message.

#### 4. New Table

The New Table page allows a user to create a new table in the restaurant. Both fields are required. The Table Name must be at least two characters. The Capacity must be at least 1. If any inputs is/are invalid the user will get an error message.

#### 5. Edit Reservation

The edit button on the reservation will take the user to another page which will allow the user to edit the existing reservation. The reservation field will pre-populated with the existing reservation value which the user can edit. All the validations from create new reservation will also present here. If any inputs are invalid, the user will get an error message. Upon submission the form, the reservation fields will be updated. The cancel button will take to the previous page.

#### 6. Seat Reservation

The seat button on the reservation will take the user to another page which allows the user to select the specific table to seat a specific reservation. The user can select the table from a drop-down list. If the table is currently occupied or has not sufficient capacity for that specific reservation, the user will get an informative error message. The cancel button will take to the previous page.


### Routes

The API allows for the following routes:

Method | Route | Description
 -|-|-
| `GET` | `/reservations` | Lists all reservations for the current date.
| `GET` | `/reservations?date=YYYY-MM-DD` | Lists all reservations on the query date.
| `POST` | `/reservations` | Creates a new reservation. No `reservation_id` or `status` need to be provided. All other fields are required.
| `GET` | `/reservations/:reservation_id` | Reads a specific reservation by `reservation_id`.
| `PUT` | `/reservations/:reservation_id` | Updates a specific reservation by `reservation_id`.
| `PUT` | `/reservations/:reservation_id/status` | Updates the status of a specific reservation by `reservation_id`.
| `GET` | `/tables` | Lists all tables.
| `POST` | `/tables` | Creates a new table. 
| `PUT` | `/tables/:table_id/seat` | Assigns a table to a reservation and changes that reservation's `status` to *seated*.
| `DELETE` | `/tables/:table_id/seat` | Removes a reservation from a table and changes that reservation's `status` to *finished*.
