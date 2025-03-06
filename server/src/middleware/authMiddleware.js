import jwt from "jsonwebtoken"

export const verifyToken = async (req, reply) => {
    try {
        const authHeader = req.header["authorization"]
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return reply.status(401).send({
                message: "Access token is required"
            })
        }

        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.authController = decoded
        return true
    } catch (error) {
        return reply.status(403).send({
            message: "Invalid or expired token"
        })
    }
}