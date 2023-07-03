import TicketsDao from '../daos/ticketsDao.js'

class TicketService{
    constructor(dao){
        this.dao = dao
    }

    async createTicket(ticket){
        const response = await this.dao.createTicket(ticket)
        return response
    };
    async getTickets(){
        const response = await this.dao.getTickets()
        return response
    };
    async getTicketById(id){
        const response = await this.dao.getTicketById(id)
        return response
    };

}

export default new TicketService(TicketsDao)