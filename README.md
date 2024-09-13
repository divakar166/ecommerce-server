# **Simple E-Commerce REST API**

This project is a simple e-commerce REST API that allows users to sign up as either a Seller or a Buyer. Sellers can add, edit, and delete products, while Buyers can search for products and add/remove them from their cart.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JSON Web Tokens (JWT)
- **ORM**: Prisma
- **Libraries**: bcryptjs, jsonwebtoken, dotenv, swaggerdocs and any other libraries as necessary.

## Features
1. User Authentication
   - Users can sign up as either a Seller or a Buyer.
   - Secure authentication using JWT.
   - Login/Sign-up functionality for both Buyers and Sellers.
2. Seller Functionality
   - Sellers can log in and perform the following operations:
     - **Add Products**: Sellers can add new products to their inventory with details such as name, category (e.g., clothes, shoes), description, price, and discount.
     - **Edit Products**: Sellers can edit their existing products.
     - **Delete Products**: Sellers can remove their products from the database.
3. Buyer Functionality
   - Buyers can log in and perform the following operations:
     - **Search Products**: Buyers can search for products by name or category.
     - **Add to Cart**: Buyers can add products to their cart.
     - **Remove from Cart**: Buyers can remove products from their cart.

## Installation and Setup
#### **Prerequisites**
Ensure that you have the following installed on your system:
- Node.js: [Install Node.js](https://nodejs.org)
- PostgreSQL: [PostgreSQL](https://www.postgresql.org/download/)

## Step-by-Step Setup
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ecommerce-rest-api.git
   cd ecommerce-rest-api
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. **Set up environment variables**: Create a .env file in the root directory of your project with the following contents:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/ecommerce_db
   JWT_SECRET=your_jwt_secret
   ```
4. Set up PostgreSQL database:
   - I'm using [Neon](https://neon.tech/) for cloud postgreSQL.
   - You can use local database also (need to configure Database URL)
6. Run the Prisma or Sequelize migration (if applicable):
   ```
   npx prisma migrate dev   # If using Prisma
   # OR
   npx sequelize db:migrate  # If using Sequelize
   ```
7. Start the server:
   ```
   npm start
   ```
8. Access the API: Your server should now be running at
   ```
   http://localhost:3000/
   ```

## API Endpoints
1. User Authentication
   - **Sign-up (Buyer/Seller)**: `POST /api/auth/signup`
   - **Login**: `POST /api/auth/login` (*Return Authorization Token)
2. Seller Routes
   - **Add Product**: `POST /api/seller/products` (*Require Authorization Token)
   - **Edit Product**: `PUT /api/seller/products/:id` (*Require Authorization Token)
   - **Delete Product**: `DELETE /api/seller/products/:id` (*Require Authorization Token)
3. Buyer Routes
   - **Search Products**: `GET /api/search?name=...&category=...`
   - **Add to Cart**: `POST /api/cart` (*Require Authorization Token)
   - **Remove from Cart**: `DELETE /api/cart/:productId` (*Require Authorization Token)
   - **Clear Cart**: `DELETE /api/cart/clear` (*Require Authorization Token)
4. API Documentation (Swagger Docs):
   - Can be accessed at - `http://localhost:3000/api/docs`
  
### *Note: Authorised API Endpoints, require authorization token, which can be generated only after log in. On successful Login, Authorization token is returned by server which is used to perform further operations. SwaggerDocs provide a better functionalality to authorize user by submitting token in authorize section.
