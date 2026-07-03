-- Artisanect — Week 5 initial migration
-- Generated from: backend/prisma/schema.prisma
-- Applied by:     npx prisma migrate deploy

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'CRAFTER');

-- CreateTable: users
CREATE TABLE "users" (
    "id"        TEXT NOT NULL,
    "name"      TEXT NOT NULL,
    "email"     TEXT NOT NULL,
    "password"  TEXT NOT NULL,
    "role"      "Role" NOT NULL,
    "craft"     TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateTable: products
CREATE TABLE "products" (
    "id"               SERIAL NOT NULL,
    "title"            TEXT NOT NULL,
    "category"         TEXT NOT NULL,
    "description"      TEXT NOT NULL,
    "price"            DOUBLE PRECISION NOT NULL,
    "rating"           DOUBLE PRECISION NOT NULL DEFAULT 0,
    "stock"            INTEGER NOT NULL DEFAULT 0,
    "image"            TEXT NOT NULL,
    "images"           TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "materials"        TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "tags"             TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "dimensions"       TEXT,
    "deliveryEstimate" TEXT,
    "featured"         BOOLEAN NOT NULL DEFAULT false,
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"        TIMESTAMP(3) NOT NULL,
    "crafterId"        TEXT NOT NULL,
    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "products_category_idx" ON "products"("category");
CREATE INDEX "products_crafterId_idx" ON "products"("crafterId");

-- CreateTable: cart_items
CREATE TABLE "cart_items" (
    "id"        SERIAL NOT NULL,
    "quantity"  INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId"    TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "cart_items_userId_productId_key" ON "cart_items"("userId", "productId");

-- CreateTable: wishlist_items
CREATE TABLE "wishlist_items" (
    "id"        SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId"    TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "wishlist_items_userId_productId_key" ON "wishlist_items"("userId", "productId");

-- AddForeignKey: products → users
ALTER TABLE "products" ADD CONSTRAINT "products_crafterId_fkey"
    FOREIGN KEY ("crafterId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: cart_items → users
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: cart_items → products
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: wishlist_items → users
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: wishlist_items → products
ALTER TABLE "wishlist_items" ADD CONSTRAINT "wishlist_items_productId_fkey"
    FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
