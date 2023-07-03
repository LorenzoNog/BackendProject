import UserDto from "../dto/usersDto/userDto.js"
import {verifyToken} from '../utils.js'
import usersService from '../services/users.service.js'

class SessionController {
    getSession = async (req,res) => {
        try {
            const token = req.headers.authorization.split(" ").pop()
            
            const tokenData = await verifyToken(token)
            const user = await usersService.getById(tokenData.user._id)
            res.send(user)
        } catch (error) {
            res.send(error)
        }
    }
}
export default new SessionController()