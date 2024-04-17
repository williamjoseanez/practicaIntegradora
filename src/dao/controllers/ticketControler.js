const TicketModel = require("../mongoDb/modelsDB/ticket.model");

class TicketController {
  async getTicketById(id) {
    try {
      const ticket = await TicketModel.findById(id);
      if (!ticket) {
        req.logger.debug("Ticket no encontrado");
        return null;
      }
      return ticket;
    } catch (error) {
      req.logger.debug("Error al traer el ticket", error);
    }
  }
}

module.exports = TicketController;
