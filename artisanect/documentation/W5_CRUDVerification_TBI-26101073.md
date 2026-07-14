# W5_CRUDVerification_65 — Artisanect CRUD Verification Guide

**Intern ID:** 65 | **Week 5** | **Database:** PostgreSQL (Supabase) + Prisma

---

## Setup Before Capturing Screenshots

1. Run `cd backend && npm run dev` — backend on http://localhost:5000
2. Run `npm run dev` from root — frontend on http://localhost:5173
3. Confirm seed is applied: `cd backend && npx prisma db seed`

---

## OPERATION 1 — CREATE (Add Product as Crafter)

### Action
1. Open http://localhost:5173
2. Login with **crafter@artisanect.com / Crafter@123**
3. Click **Upload Product** in the navbar
4. Fill in: Title="Custom Clay Pot", Category="Pottery", Price=350, Description="Handmade", Stock=5
5. Click **Upload Product** button

### Expected Frontend Result
- Toast notification: "Product uploaded successfully"
- Redirect to My Products page showing the new product

### Expected Database Result
```sql
SELECT id, title, price, "crafterId" FROM products WHERE title='Custom Clay Pot';
-- Returns 1 row with the crafter's ID
```

### Screenshot to Capture
- The "Upload Product" form filled in, AND the success toast visible

**Caption:** *CrafterUploadProduct form — after submitting a new product, a success toast confirms the item was saved to the PostgreSQL database.*

---

## OPERATION 2 — READ (Browse Product Catalog)

### Action
1. Logout → Login as **customer@artisanect.com / Customer@123**
2. Click **Shop** in the navbar
3. The product grid should display all seeded products

### Expected Frontend Result
- 24 products (or more if you added one) displayed as cards with images, prices, and artisan names

### Expected Database Result
```sql
SELECT COUNT(*) FROM products;
-- Returns 24 (or 25 if you added the Custom Clay Pot above)
```

### Screenshot to Capture
- The Shop page with the product grid fully loaded showing multiple handcrafted products

**Caption:** *Shop page reading from the PostgreSQL products table — 24 seeded handcrafted products are fetched via GET /api/products and displayed in the catalog grid.*

---

## OPERATION 3 — UPDATE (Edit a Product as Crafter)

### Action
1. Login as **crafter@artisanect.com / Crafter@123**
2. Go to **My Products**
3. Find any product and click **Edit**
4. Change the price from its current value to a new value (e.g., 499)
5. Click **Save Changes**

### Expected Frontend Result
- Toast: "Product updated successfully"
- The product card now shows the new price

### Expected Database Result
```sql
SELECT title, price, "updatedAt" FROM products WHERE "crafterId" = 'demo-crafter';
-- Shows updated price and a recent updatedAt timestamp
```

### Screenshot to Capture
- The edit modal open with the new price entered, AND the product card showing the updated price

**Caption:** *CrafterMyProducts edit modal — price update triggers PUT /api/products/:id which writes the new value to the database. The updatedAt timestamp confirms the DB record was modified.*

---

## OPERATION 4 — DELETE (Remove a Product as Crafter)

### Action
1. Login as **crafter@artisanect.com / Crafter@123**
2. Go to **My Products**
3. Click **Delete** on the Custom Clay Pot product created in Operation 1
4. Confirm deletion in the modal

### Expected Frontend Result
- Toast: "Product deleted"
- Product no longer appears in the My Products list

### Expected Database Result
```sql
SELECT id FROM products WHERE title='Custom Clay Pot';
-- Returns 0 rows — product is permanently removed
```
Also, if any customer had this product in their cart:
```sql
SELECT * FROM cart_items WHERE "productId" = [deleted_id];
-- Returns 0 rows — CASCADE DELETE removed dependent cart rows automatically
```

### Screenshot to Capture
- My Products page showing the product missing from the list after deletion

**Caption:** *Product deleted from the database — DELETE /api/products/:id removes the row from PostgreSQL, and the ON DELETE CASCADE constraint automatically cleans up any cart_items or wishlist_items referencing this product.*

---

## OPERATION 5 — CART (Full CRUD — Bonus Screenshot)

### Action
1. Login as customer, go to **Shop**, click **Add to Cart** on any product
2. Go to **Cart** page
3. Increase quantity using the + button
4. Remove one item using the trash icon

### Expected Frontend Result
- Cart badge in navbar updates in real time
- Total price recalculates on quantity change

### Expected Database Result
```sql
SELECT ci.quantity, p.title, p.price
FROM cart_items ci JOIN products p ON ci."productId" = p.id
WHERE ci."userId" = 'demo-customer';
-- Shows current cart rows persisted in the DB
```

**Caption:** *Customer cart persisted in PostgreSQL — cart operations sync with the database in real time. Refreshing the browser still shows the same cart (no data loss on restart).*

---

## PDF Assembly Order

Arrange your screenshots in this order for **W5_CRUDVerification_65.pdf**:

| Page | Screenshot | Caption |
|------|-----------|---------|
| 1    | Cover page with your name, Intern ID, Week 5 | — |
| 2    | CREATE — Upload Product form + success toast | Operation 1 caption |
| 3    | READ — Shop page with full product grid | Operation 2 caption |
| 4    | UPDATE — Edit modal open + updated product card | Operation 3 caption |
| 5    | DELETE — My Products after deletion | Operation 4 caption |
| 6    | CART — Cart page with persisted items | Operation 5 caption |
| 7    | Supabase Table Editor showing the `products` table | "Database records visible in Supabase dashboard" |

**Tool to create PDF:** Use any of — Google Slides, Microsoft Word, LibreOffice Impress → Export as PDF.

File name: `W5_CRUDVerification_65.pdf`
