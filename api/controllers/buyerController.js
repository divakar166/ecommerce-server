/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search products by name and category
 *     description: Fetches a list of products that match the given name and/or category.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Name of the product to search for (partial match allowed)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category of the product to search for
 *     responses:
 *       200:
 *         description: List of products matching the search criteria
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
 *                   price:
 *                     type: number
 *                     format: float
 *                     example: 99.99
 *                   discount:
 *                     type: number
 *                     format: float
 *                     example: 10.0
 *       500:
 *         description: Failed to search products
 */
const searchProducts = async (req, res) => {
  const { name, category } = req.query;
  try {
    const products = await req.prisma.product.findMany({
      where: {
        AND: [
          name ? { name: { contains: name, mode: 'insensitive' } } : {},
          category ? { category: { equals: category, mode: 'insensitive' } } : {},
        ],
      },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search products' });
  }
};

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the cart of the logged-in user
 *     description: Fetches the cart details for the currently logged-in user, including product details and total value.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved cart details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 buyerId:
 *                   type: integer
 *                   example: 1
 *                 products:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Sample Product"
 *                       category:
 *                         type: string
 *                         example: "Electronics"
 *                       price:
 *                         type: number
 *                         format: float
 *                         example: 99.99
 *                       discount:
 *                         type: number
 *                         format: float
 *                         example: 10.0
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       totalCost:
 *                         type: number
 *                         format: float
 *                         example: 179.98
 *                 totalValue:
 *                   type: number
 *                   format: float
 *                   example: 179.98
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Failed to fetch cart
 */
const getCart = async (req, res) => {
  const buyerId = req.user.id;
  try {
    const cart = await req.prisma.cart.findFirst({
      where: { buyerId: buyerId },
      include: {
        cartProducts: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const products = cart.cartProducts.map(item => {
      const discountAmount = (item.product.price * item.product.discount / 100).toFixed(2);
      const priceAfterDiscount = (item.product.price - discountAmount).toFixed(2);
      const totalCost = (priceAfterDiscount * item.quantity).toFixed(2);
      return {
        productId: item.productId,
        name: item.product.name,
        category: item.product.category,
        price: item.product.price,
        discount: item.product.discount,
        quantity: item.quantity,
        totalCost: parseFloat(totalCost),
      };
    });

    const totalValue = products.reduce((total, item) => {
      return total + item.totalCost;
    }, 0).toFixed(2);

    res.status(200).json({
      buyerId,
      products,
      totalValue: parseFloat(totalValue), // Ensure totalValue is a number
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};


/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add product to cart
 *     description: Allows buyers to add products to their cart.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 description: ID of the product to add
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product
 *                 example: 2
 *     responses:
 *       201:
 *         description: Product added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product added to cart successfully
 *                 cartItem:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     productId:
 *                       type: integer
 *                       example: 1
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Failed to add product to cart
 */
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const buyerId = req.user.id;
  if (!productId || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid product ID or quantity' });
  }
  try {
    // Check if the cart exists for the buyer
    let cart = await req.prisma.cart.findFirst({
      where: { buyerId: buyerId }
    });

    // If the cart does not exist, create one
    if (!cart) {
      cart = await req.prisma.cart.create({
        data: { buyerId }
      });
    }

    // Check if the product already exists in the cart
    const existingCartItem = await req.prisma.cartProduct.findUnique({
      where: { 
        cartId_productId: {
          cartId: cart.id,
          productId: parseInt(productId),
        }
      }
    });

    if (existingCartItem) {
      // Update quantity if product already exists in the cart
      const updatedCartItem = await req.prisma.cartProduct.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity }
      });

      return res.status(200).json({
        message: 'Product quantity updated in cart successfully',
        cartItem: updatedCartItem,
      });
    } else {
      // Create new cart item
      const cartItem = await req.prisma.cartProduct.create({
        data: {
          cart: { connect: { id: cart.id } },
          product: { connect: { id: parseInt(productId) } },
          quantity: quantity || 1,
        },
      });

      res.status(201).json({
        message: 'Product added to cart successfully',
        cartItem,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
};

/**
 * @swagger
 * /api/cart/{productId}:
 *   delete:
 *     summary: Remove a product from the cart
 *     description: Removes a specified product from the cart of the currently logged-in user.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         description: The ID of the product to remove from the cart
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully removed the product from the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Product removed from cart successfully'
 *                 deletedCartItem:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 1
 *       404:
 *         description: Cart item not found
 *       500:
 *         description: Failed to remove product from cart
 */
const removeFromCart = async (req, res) => {
  const { productId } = req.params;
  const buyerId = req.user.id;

  try {
    const deletedCartItem = await req.prisma.cartProduct.deleteMany({
      where: {
        productId: parseInt(productId),
        cart: { buyerId },
      },
    });

    if (deletedCartItem.count === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    res.status(200).json({
      message: 'Product removed from cart successfully',
      deletedCartItem,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to remove product from cart' });
  }
};

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear all items from the cart
 *     description: Removes all items from the cart of the currently logged-in user.
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully cleared the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Cart cleared successfully'
 *                 deletedCartItems:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 3
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Failed to clear cart
 */
const clearCart = async (req, res) => {
  const buyerId = req.user.id;

  try {
    const cart = await req.prisma.cart.findFirst({
      where: {
        buyerId: buyerId,
      },
    });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    const deletedCartItems = await req.prisma.cartProduct.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    res.status(200).json({
      message: 'Cart cleared successfully',
      deletedCartItems,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};

module.exports = {
  searchProducts,
  addToCart,
  removeFromCart,
  getCart,
  clearCart
};
