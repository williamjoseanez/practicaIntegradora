const TicketModel = require("../dao/mongoDb/modelsDB/ticket.model.js");

class TicketRepository {
  async getTicketById(id) {
    try {
      const ticket = await TicketModel.findById(id);
      if (!ticket) {
        req.logger.debug("Ticket no encontrado");
        return null;
      }
      return ticket;
    } catch (error) {
      req.logger.debug("Error al obtener el ticket", error);
      throw error;
    }
  }
}
module.exports = TicketRepository;
