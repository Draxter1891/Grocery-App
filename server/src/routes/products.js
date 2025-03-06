import { getAllCategories } from "../controllers/product/categoryController.js"
import { getProductsByCategoryId } from "../controllers/product/productController.js"

export const categoryRoutes = async (fastify, options) => {
    fastify.get("/categories", getAllCategories)
}

export const productRoutes = async (fastify, options) => {
    fastify.get("/products/:categoryId", getProductsByCategoryId)
}