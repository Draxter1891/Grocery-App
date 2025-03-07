import axios from 'axios'
import { BASE_URL } from './Config'
import { tokenStorage } from '@state/Storage'
import { useAuthStore } from '@state/AuthStore'

export const customerLogin = async (phone:string)=>{
    try {
        const response = await axios.post(`${BASE_URL}/customer/login`,{phone})
        const {accessToken, refreshToken, customer} = (await response).data
        tokenStorage.set("accessToken", accessToken)
        tokenStorage.set("refreshToken", refreshToken)
        const {setUser} = useAuthStore.getState()
        setUser(customer)
    } catch (error) {
        console.log("login error",error)
    }
}