
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const products = [
  { id: 1, name: "Full Cream Milk", price: 70 },
  { id: 2, name: "Buffalo Milk", price: 80 },
  { id: 3, name: "Toned Milk", price: 55 },
  { id: 4, name: "Fresh Curd", price: 45 },
  { id: 5, name: "Fresh Paneer", price: 100 },
  { id: 6, name: "Pure Cow Ghee", price: 550 },
  { id: 7, name: "Fresh Butter", price: 60 },
  { id: 8, name: "Buttermilk", price: 25 },
  { id: 9, name: "Mozzarella Cheese", price: 150 },
  { id: 10, name: "Fresh Cream", price: 90 },
  { id: 11, name: "Sweet Lassi", price: 40 },
  { id: 12, name: "Flavoured Milk", price: 35 }
];

let orders = [];

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/orders", (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "Invalid order" });
  }

  const orderItems = [];

  for (const item of items) {
    const product = products.find(
      p => p.id === Number(item.productId)
    );

    const quantity = Number(item.quantity);

    if (!product || !Number.isInteger(quantity) ||
        quantity < 1 || quantity > 100) {
      return res.status(400).json({ message: "Invalid order item" });
    }

    orderItems.push({
      name: product.name,
      quantity,
      subtotal: product.price * quantity
    });
  }

  const total = orderItems.reduce(
    (sum, item) => sum + item.subtotal, 0
  );

  const order = {
    id: orders.length + 1,
    items: orderItems,
    total,
    status: "Order Received"
  };

  orders.push(order);

  res.status(201).json({
    message: "CreamyCrust order placed successfully!",
    order
  });
});

app.get("/api/orders", (req, res) => {
  res.json(orders);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CreamyCrust running on port ${PORT}`);
});
