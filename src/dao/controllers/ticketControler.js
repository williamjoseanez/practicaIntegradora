const TicketModel = require("../mongoDb/modelsDB/ticket.model");

class TicketController {
  async getTicketById(id) {
    try {
      const ticket = await TicketModel.findById(id);
      if (!ticket) {
        console.log("Ticket no encontrado");
        return null;
      }
      return ticket;
    } catch (error) {
      console.log("Error al traer el ticket", error);
    }
  }
}

module.exports = TicketController;
