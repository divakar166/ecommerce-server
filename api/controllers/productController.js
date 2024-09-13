/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Retrieve a list of all products
 *     description: Fetches a list of all products available in the inventory, including their details.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully fetched the list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Sample Product"
 *                   category:
 *                     type: string
 *                     example: "Electronics"
 *                   description:
 *                     type: string
 *                     example: "A detailed description of the product."
 *                   price:
 *                     type: number
 *                     format: float
 *                     example: 199.99
 *                   discount:
 *                     type: number
 *                     format: float
 *                     example: 10
 *       500:
 *         description: Failed to fetch products
 */
const getAllProducts = async (req, res) => {
  try{
    const products = await req.prisma.product.findMany({
      select:{
        id:true,
        name:true,
        category:true,
        description:true,
        price:true,
        discount:true
      }
    })
    res.status(200).json(products)
  }catch(error){
    console.log(error)
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add a new product
 *     description: Creates a new product and adds it to the inventory. Requires seller authentication.
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Product"
 *               category:
 *                 type: string
 *                 example: "Home Appliances"
 *               description:
 *                 type: string
 *                 example: "An amazing new product with advanced features."
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 299.99
 *               discount:
 *                 type: number
 *                 format: float
 *                 example: 15
 *     responses:
 *       201:
 *         description: Product successfully added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product added successfully"
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "New Product"
 *                     category:
 *                       type: string
 *                       example: "Home Appliances"
 *                     description:
 *                       type: string
 *                       example: "An amazing new product with advanced features."
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 299.99
 *                     discount:
 *                       type: number
 *                       format: float
 *                       example: 15
 *                     sellerId:
 *                       type: integer
 *                       example: 2
 *       500:
 *         description: Failed to add product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to add product"
 */
const addProduct = async (req, res) => {
  const { name, category, description, price, discount } = req.body;
  const sellerId = req.user.id;

  try {
    // Create a new product in the database
    const product = await req.prisma.product.create({
      data: {
        name,
        category,
        description,
        price,
        discount,
        sellerId,
      },
    });
    res.status(201).json({
      message: 'Product added successfully',
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add product' });
  }
};


/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Edit an existing product
 *     description: Updates details of an existing product. Requires seller authentication and authorization to ensure the seller can only update their own products.
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Product Name"
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *               description:
 *                 type: string
 *                 example: "Updated description of the product."
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 199.99
 *               discount:
 *                 type: number
 *                 format: float
 *                 example: 10
 *     responses:
 *       200:
 *         description: Product successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product updated successfully"
 *                 product:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Updated Product Name"
 *                     category:
 *                       type: string
 *                       example: "Electronics"
 *                     description:
 *                       type: string
 *                       example: "Updated description of the product."
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 199.99
 *                     discount:
 *                       type: number
 *                       format: float
 *                       example: 10
 *                     sellerId:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Invalid request or missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request"
 *       403:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "You are not authorized to update this product"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Failed to update product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to update product"
 */
const editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, description, price, discount } = req.body;
  const sellerId = req.user.id;

  try {
    // Find the product first
    const existingProduct = await req.prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if the product belongs to the logged-in seller
    if (existingProduct.sellerId !== sellerId) {
      return res.status(403).json({ error: 'You are not authorized to update this product' });
    }

    const product = await req.prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: name || existingProduct.name,
        category: category || existingProduct.category,
        description: description || existingProduct.description,
        price: price || existingProduct.price,
        discount: discount || existingProduct.discount,
      },
    });

    res.status(200).json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product from the database. Requires seller authentication and authorization to ensure the seller can only delete their own products.
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the product to delete
 *     responses:
 *       200:
 *         description: Product successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product deleted successfully"
 *                 deletedProduct:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Product Name"
 *                     category:
 *                       type: string
 *                       example: "Category"
 *                     description:
 *                       type: string
 *                       example: "Product description"
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 100.00
 *                     discount:
 *                       type: number
 *                       format: float
 *                       example: 10
 *                     sellerId:
 *                       type: integer
 *                       example: 2
 *       403:
 *         description: Unauthorized access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "You are not authorized to delete this product"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Product not found"
 *       500:
 *         description: Failed to delete product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to delete product"
 */
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const sellerId = req.user.id;

  try {
    const product = await req.prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (product.sellerId !== sellerId) {
      return res.status(403).json({ error: 'You are not authorized to delete this product' });
    }
    const deletedProduct = await req.prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({
      message: 'Product deleted successfully',
      deletedProduct,
    });
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

module.exports = {
  addProduct,
  editProduct,
  deleteProduct,
  getAllProducts
};