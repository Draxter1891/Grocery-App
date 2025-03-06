import { Customer, DeliveryPartner } from '../../models/user.js'
import jwt from 'jsonwebtoken'

const generateToken = (user) => {
    const accessToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    )
    const refreshToken = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )
    return { accessToken, refreshToken }
}

//Customer login
export const loginCustomer = async (req, reply) => {
    try {
        const { phone } = req.body;
        let customer = await Customer.findOne({ phone })

        if (!customer) {
            customer = new Customer({
                phone,
                role: "Customer",
                isActivated: true
            })

            await customer.save()
        }
        const { accessToken, refreshToken } = generateToken(customer)

        return reply.status(200).send({
            message: "Login Successful",
            accessToken,
            refreshToken,
            customer,
        })

    } catch (error) {
        return reply.status(500).send({
            message: "An error occured in customer login api", error
        })
    }
}

//Delivery partner login
export const loginDeliveryPartner = async (req, reply) => {
    try {
        const { email, password } = req.body;
        const deliveryPartner = await DeliveryPartner.findOne({ email })

        if (!deliveryPartner) {
            return reply.status(404).send({
                message: "Delivery partner not found"
            })
        }

        const isMatch = password === deliveryPartner.password

        if (!isMatch) {
            return reply.status(400).send({
                message: "Invalid Credentials!"
            })
        }

        const { accessToken, refreshToken } = generateToken(deliveryPartner)

        return reply.status(200).send({
            message: "Login Successful",
            accessToken,
            refreshToken,
            deliveryPartner,
        })
    } catch (error) {
        return reply.status(500).send({
            message: "An error occured D Partner login api", error
        })
    }
}

export const refreshToken = async (req, reply) => {
    const { refreshToken } = req.body

    if (!refreshToken) {
        return reply.status(401).send({
            message: "Refresh Token Required"
        })
    }

    try {
        const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        let user;

        if (decode.role === "Customer") {
            user = await Customer.findById(decode.userId)
        } else if (decode.role === "DeliveryPartner") {
            user = await DeliveryPartner.findById(decode.userId)
        } else {
            return reply.status(403).send({
                message: "Invalid Role"
            })
        }

        if (!user) {
            return reply.status(403).send({
                message: "User not found"
            })
        }

        const { accessToken, refreshToken: newRefreshToken } = generateToken(user)

        return reply.status(200).send({
            message: "Token Refreshed",
            accessToken,
            refreshToken: newRefreshToken,
        })
    } catch (error) {
        return reply.status(403).send({
            message: "Invalid refresh token"
        })
    }
}

//Fetch user
export const fetchUser = async (req, reply) => {
    try {
        const { userId, role } = req.user;
        let user;

        if (role === "Customer") {
            user = await Customer.findById(userId)
        } else if (role === "DeliveryPartner") {
            user = await DeliveryPartner.findById(userId)
        } else {
            return reply.status(403).send({
                message: "Invalid Role"
            })
        }

        if (!user) {
            return reply.status(403).send({
                message: "User not found"
            })
        }

        return reply.status(200).send({
            message: "User fetched successfully",
            uesr,
        })
    } catch (error) {
        return reply.status(500).send({
            message: "An error occured in fetch api", error
        })
    }
}