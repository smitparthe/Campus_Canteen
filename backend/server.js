const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const db = require("./db");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());


// ==========================================
// BASIC TEST ROUTES
// ==========================================

app.get("/", (req, res) => {
  res.send("Campus Canteen Backend is running!");
});

app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working!"
  });
});


// ==========================================
// DATABASE TEST
// ==========================================

app.get("/api/db-test", (req, res) => {
  db.query("SELECT 1 AS test", (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Database connection failed"
      });
    }

    res.json({
      message: "Database connection is working!",
      result: results
    });
  });
});


// ==========================================
// REGISTER
// ==========================================

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required"
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
    `;

    db.query(
      sql,
      [name, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error(err);

          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
              message: "Email already registered"
            });
          }

          return res.status(500).json({
            message: "Registration failed"
          });
        }

        res.status(201).json({
          message: "Registration successful",
          userId: result.insertId
        });
      }
    );

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
});


// ==========================================
// LOGIN
// ==========================================

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  const sql = `
    SELECT id, name, email, password, role
    FROM users
    WHERE email = ?
  `;

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Login failed"
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = results[0];

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    res.json({
      message: "Login successful",

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
});


// ==========================================
// ADD FOOD
// ==========================================

app.post("/api/staff/food", (req, res) => {
  const {
    name,
    price,
    description,
    category
  } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({
      message: "Name, price and category are required"
    });
  }

  const sql = `
    INSERT INTO food
    (name, price, description, category, available)
    VALUES (?, ?, ?, ?, TRUE)
  `;

  db.query(
    sql,
    [
      name,
      price,
      description || "",
      category
    ],
    (err, result) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to add food"
        });
      }

      res.status(201).json({
        message: "Food added successfully",
        foodId: result.insertId
      });

    }
  );
});


// ==========================================
// UPDATE FOOD
// ==========================================

app.put("/api/staff/food/:foodId", (req, res) => {
  const foodId = req.params.foodId;

  const {
    name,
    price,
    description,
    category
  } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({
      message: "Name, price and category are required"
    });
  }

  const sql = `
    UPDATE food
    SET
      name = ?,
      price = ?,
      description = ?,
      category = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      name,
      price,
      description || "",
      category,
      foodId
    ],
    (err, result) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to update food"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Food item not found"
        });
      }

      res.json({
        message: "Food updated successfully"
      });

    }
  );
});


// ==========================================
// DELETE FOOD
// ==========================================

app.delete("/api/staff/food/:foodId", (req, res) => {
  const foodId = req.params.foodId;

  // Soft delete:
  // Instead of permanently deleting the food,
  // we mark it as unavailable.
  const sql = `
    UPDATE food
    SET available = FALSE
    WHERE id = ?
  `;

  db.query(
    sql,
    [foodId],
    (err, result) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to delete food"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Food item not found"
        });
      }

      res.json({
        message: "Food deleted successfully"
      });

    }
  );
});


// ==========================================
// GET AVAILABLE FOOD
// ==========================================

app.get("/api/food", (req, res) => {
  const sql = `
    SELECT
      id,
      name,
      description,
      price,
      category,
      image_url,
      available
    FROM food
    WHERE available = TRUE
    ORDER BY category, name
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch food"
      });
    }

    res.json(results);
  });
});


// ==========================================
// CREATE ORDER
// ==========================================

app.post("/api/orders", (req, res) => {
  const { userId, items } = req.body;

  if (!userId || !items || items.length === 0) {
    return res.status(400).json({
      message: "User and cart items are required"
    });
  }

  const foodIds = items.map((item) => item.id);

  const placeholders = foodIds
    .map(() => "?")
    .join(",");

  const foodSql = `
    SELECT id, price
    FROM food
    WHERE id IN (${placeholders})
    AND available = TRUE
  `;

  db.query(
    foodSql,
    foodIds,
    (foodError, foodResults) => {

      if (foodError) {
        console.error(foodError);

        return res.status(500).json({
          message: "Failed to verify food items"
        });
      }

      if (foodResults.length !== items.length) {
        return res.status(400).json({
          message: "One or more food items are unavailable"
        });
      }

      const priceMap = {};

      foodResults.forEach((food) => {
        priceMap[food.id] = Number(food.price);
      });

      let totalAmount = 0;

      for (const item of items) {

        if (!priceMap[item.id]) {
          return res.status(400).json({
            message: "Invalid food item"
          });
        }

        if (
          !Number.isInteger(item.quantity) ||
          item.quantity <= 0
        ) {
          return res.status(400).json({
            message: "Invalid quantity"
          });
        }

        totalAmount +=
          priceMap[item.id] * item.quantity;
      }


      db.beginTransaction((transactionError) => {

        if (transactionError) {
          console.error(transactionError);

          return res.status(500).json({
            message: "Could not start order"
          });
        }


        const orderSql = `
          INSERT INTO orders
          (user_id, total_amount)
          VALUES (?, ?)
        `;

        db.query(
          orderSql,
          [userId, totalAmount],
          (orderError, orderResult) => {

            if (orderError) {

              return db.rollback(() => {
                console.error(orderError);

                res.status(500).json({
                  message: "Failed to create order"
                });
              });

            }

            const orderId = orderResult.insertId;


            const itemValues = items.map((item) => [
              orderId,
              item.id,
              item.quantity,
              priceMap[item.id]
            ]);

            const itemsSql = `
              INSERT INTO order_items
              (order_id, food_id, quantity, price)
              VALUES ?
            `;

            db.query(
              itemsSql,
              [itemValues],
              (itemsError) => {

                if (itemsError) {

                  return db.rollback(() => {
                    console.error(itemsError);

                    res.status(500).json({
                      message: "Failed to save order items"
                    });
                  });

                }


                db.commit((commitError) => {

                  if (commitError) {

                    return db.rollback(() => {
                      console.error(commitError);

                      res.status(500).json({
                        message: "Failed to complete order"
                      });
                    });

                  }

                  res.status(201).json({
                    message: "Order placed successfully",
                    orderId: orderId,
                    totalAmount: totalAmount
                  });

                });

              }
            );

          }
        );

      });


    }
  );
});


// ==========================================
// GET ORDERS FOR A STUDENT
// ==========================================

app.get("/api/orders/:userId", (req, res) => {

  const userId = req.params.userId;

  const sql = `
    SELECT
      o.id AS order_id,
      o.total_amount,
      o.status,
      o.created_at,
      f.name AS food_name,
      oi.quantity,
      oi.price
    FROM orders o
    JOIN order_items oi
      ON o.id = oi.order_id
    JOIN food f
      ON oi.food_id = f.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;

  db.query(
    sql,
    [userId],
    (err, results) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to fetch orders"
        });
      }

      res.json(results);

    }
  );
});


// ==========================================
// GET ALL ORDERS FOR STAFF
// ==========================================

app.get("/api/staff/orders", (req, res) => {

  const sql = `
    SELECT
      o.id AS order_id,
      o.user_id,
      u.name AS customer_name,
      u.email AS customer_email,
      o.total_amount,
      o.status,
      o.created_at,
      f.name AS food_name,
      oi.quantity,
      oi.price
    FROM orders o
    JOIN users u
      ON o.user_id = u.id
    JOIN order_items oi
      ON o.id = oi.order_id
    JOIN food f
      ON oi.food_id = f.id
    ORDER BY o.created_at DESC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.error(err);

      return res.status(500).json({
        message: "Failed to fetch staff orders"
      });
    }

    res.json(results);

  });
});


// ==========================================
// UPDATE ORDER STATUS
// ==========================================

app.patch("/api/staff/orders/:orderId/status", (req, res) => {

  const orderId = req.params.orderId;
  const { status } = req.body;

  const allowedStatuses = [
    "Pending",
    "Preparing",
    "Ready",
    "Completed",
    "Cancelled"
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid order status"
    });
  }

  const sql = `
    UPDATE orders
    SET status = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [status, orderId],
    (err, result) => {

      if (err) {
        console.error(err);

        return res.status(500).json({
          message: "Failed to update order status"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Order not found"
        });
      }

      res.json({
        message: "Order status updated successfully"
      });

    }
  );
});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
  console.log(
    `Server running on http://localhost:${PORT}`
  );
});