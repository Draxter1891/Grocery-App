import { Customer, DeliveryPartner } from "../../models/index.js";

export const updateUser = async (req, reply) => {
    try {
        const { userId } = req.authController;
        const updateData = req.body;

        let user = await Customer.findById(userId) || await DeliveryPartner.findById(userId)

        if (!user) {
            return reply.status(404).send({
                message: "User not found"
            })
        }

        let UserModel;

        if (user.role === "Customer") {
            UserModel = Customer;
        } else if (user.role === "DeliveryPartner") {
            UserModel = DeliveryPartner
        } else {
            return reply.status(400).send({
                message: "Invalid user role"
            })
        }

        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: updateData }, //uses the update data
            { new: true, runValidators: true } //new means to overwrite the changes on existing ones and all the validators that are defined in user schema will be executed
        )

        if (!updateUser) {
            return reply.status(404).send({
                message: "User not found"
            })
        }

        return reply.status(200).send({
            message: "User updated successfully",
            user: updateUser,
        })
    } catch (error) {
        return reply.status(500).send({
            message: "Failed to update user",
            error
        })
    }
}