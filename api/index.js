// app.js
const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const buyerRoutes = require('./routes/buyerRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec,{customCSSUrl: CSS_URL}));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/', buyerRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('REST API Server for e-commerce application');
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
