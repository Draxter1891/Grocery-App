import { Customer, Order, Branch, DeliveryPartner } from "../../models/index.js";


//CREATE ORDER 
export const createOrder = async (req, reply) => {
    try {
        const { userId } = req.authController
        const { items, branch, totalPrice } = req.body

        const customerData = await Customer.findById(userId)
        const branchData = await Branch.findById(branch)

        if (!customerData) {
            return reply.status(404).send({
                message: "customer not found"
            })
        }

        const newOrder = new Order({
            customer: userId,
            items: items.map((item) => ({
                id: item.id,
                item: item.item,
                count: item.count
            })),
            branch,
            totalPrice,
            deliveryLocation: {
                latitude: customerData.liveLocation.latitude,
                longitude: customerData.liveLocation.longitude,
                address: customerData.address || "no address available"
            },
            pickupLocation: {
                latitude: branchData.liveLocation.latitude,
                longitude: branchData.liveLocation.longitude,
                address: branchData.address || "no address available"
            },

        })

        const saveOrder = await newOrder.save()
        return reply.status(201).send(saveOrder)

    } catch (error) {
        console.log(error)
        return reply.status(500).send({
            message: "Failed to create order",
            error
        })
    }
}


//CONFIRM ORDER

export const confirmOrder = async (req, reply) => {
    try {
        const { orderId } = req.params
        const { userId } = req.authController;
        const { deliveryPersonLocation } = req.body

        const deliveryPerson = await DeliveryPartner.findById(userId)

        if (!deliveryPerson) {
            return reply.status(404).send({ message: "Delivery person not found" })
        }

        const order = await Order.findById(orderId)
        if (!order) {
            return reply.status(404).send({ message: "Order not found" })
        }

        if (order.status !== "available") {
            return reply.status(400).send({ message: "Order is not available" })
        }

        order.status = "confirmed"

        order.deliveryPartner = userId
        order.deliveryPersonLocation = {
            latitude: deliveryPersonLocation?.latitude,
            longitude: deliveryPersonLocation?.longitude,
            address: deliveryPersonLocation.address || "",
        }

        req.server.io.to(orderId).emit('orderConfirmed', order)
        await order.save()

        return reply.status(200).send(order)


    } catch (error) {
        return reply.status(500).send({
            message: "failed to confirm order",
            error
        })
    }
}

//UPDATE ORDER
export const updateOrderStatus = async (req, reply) => {
    try {
        const { orderId } = req.params
        const { status, deliveryPersonLocation } = req.body
        const { userId } = req.authController

        const deliveryPerson = await DeliveryPartner.findById(userId)
        if (!deliveryPerson) {
            return reply.status(404).send({
                message: "Delivery person not found"
            })
        }

        const order = await Order.findById(orderId)
        if (!order) {
            return reply.status(404).send({
                message: "order not found"
            })
        }

        if (["cancelled", "delivered"].includes(order.status)) {
            return reply.status(400).send({
                message: "Order can not be updated"
            })
        }

        //preventing cross delivery guy order status updation
        if (order.deliveryPartner.toString() !== userId) {
            return reply.status(403).send({
                message: "Unauthorized"
            })
        }

        order.status = status
        order.deliveryPersonLocation = deliveryPersonLocation;
        await order.save()

        req.server.io.to(orderId).emit("LiveTrackingUpdates",order)

        return reply.send(order)
    } catch (error) {
        return reply.status(500).send({
            message: "Failed to update order status",
            error
        })
    }
}

//GET ALL ORDERS
export const getOrders = async (req,reply) =>{
    try {
        const {status, customerId, deliveryPartnerId, branchId} = req.query
        let query = {}

        if(status){
            query.status = status
        }
        if(customerId){
            query.customer = customerId
        }
        if(deliveryPartnerId){
            query.deliveryPartner = deliveryPartnerId
            query.branch = branchId
        }

        const orders = await Order.find(query).populate(
            "customer branch items.item deliveryPartner"
        )
    } catch (error) {
        return reply.status(500).send({
            message: "Failed to retrieve orders",
            error
        })
    }
}

//GET ORDER BY ID
export const getOrderById = async (req,reply)=>{
    try {
        const {orderId} = req.params

        const order = await Order.findById(orderId).populate(
            "customer branch items.item deliveryPartner" 
        )

        if(!order){
            return reply.status(404).send({
                message: "Order not found"
            })
        }

        return reply.status(200).send(order)
    } catch (error) {
        return reply.status(500).send({
            message: "Failed to retrieve order", error
        })
    }
}