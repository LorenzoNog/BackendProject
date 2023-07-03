import {TicketsModel} from './mongoDao/models/ticketsModel.js'

class TicketsDao {
    constructor(model){
        this.model = model
    }

    async createTicket(ticket){
        try {
            const createTicket = await this.model.create(ticket)
            return createTicket
        } catch (error) {
            return error
        }
    };

    async getTickets(){
        try {
            const response = await this.model.find()
            return response
        } catch (error) {
            return error
        }
    };

    async getTicketById(id){
        try {
            const ticket = await this.model.findById(id)
            return ticket
        } catch (error) {
            return error
        }
    }
}

export default new TicketsDao(TicketsModel)

