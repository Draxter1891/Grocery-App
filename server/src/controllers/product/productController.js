import Product from "../../models/products.js"

export const getProductsByCategoryId = async (req,reply) =>{
    const {categoryId} = req.params
    
    try {

        //-category means that category will be removed and exec() means execute all

        const products = await Product.find({category: categoryId}).select("-category").exec()
        reply.status(200).send(products)
    } catch (error) {
        return reply.status(500).send({
            message: "An error occured getProductsByCategoryId api", error
        })
    }
}