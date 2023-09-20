# [Udemy] Proshop App
A small eCommerce platform build with the MERN stack. This is my version of the project created from the Udemy course: [MERN From Scratch 2023 | eCommerce Platform](https://www.udemy.com/course/mern-ecommerce/)

Instead of using plain Javascript, I tried to use Typescript instead. There are parts unpolished as I was following the course and haven't gotten around to clean up.

Udemy Instructor's Github Repo of the project: https://github.com/bradtraversy/proshop-v2/tree/main

## Tech Stack
- Typescript
- React JS | Redux
- Node JS | Express JS
- MongoDB

## Usage
### Prerequisites
- MongoDB Database and the MongoDB URI - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
- Paypal Account and obtain Client ID - [Paypal Developer](https://developer.paypal.com/home)
- Install the ff on your PC
  * Node
  * MongoDBCompass
- Copy contents of `example.env` to `.env` file and update variables

### Install Dependencies
Run the ff on the terminal
```cmd
npm install
cd frontend
npm install
```

### Seeding
Use the following commands to seed the database with sample users and products
```
# Import data
npm run data:import

# Destroy data
npm run data:destroy
```
Sample user logins
- `admin@email.com (Admin) - 123456`
- `john@email.com (Customer) - 123456`
- `jane@email.com (Customer) - 123456`

### Run
1. Run `npm run build` under root folder to build the backend
2. Run `npm run server` and `npm run client` to run both backend and frontend. Alternatively, run `npm run dev` for both
3. If changes are made in the backend, make sure to run `npm run build` again for changes to take effect

### Deploy
Run `npm run build:prod` in the root folder.

## TODO
Changes I plan to make in the future
- Infer Types from Mongoose schemas
- Code cleanup for Typescript (e.g. using proper types)
- Add Category filtering
- Enhance layout designs
- Filtering in Users List and Orders List
- Fix listed known bugs

## Known Bugs
1. File uploaded not shown properly due to `/` and `\` interchanged upon saving the image paths
2. Carousel images not filling the carousel width
3. Some error messages are not displayed correctly