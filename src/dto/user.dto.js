class UserDTO {
  constructor(first_Name, last_Name, role) {
    this.nombre = first_Name;
    this.apellido = last_Name;
    this.role = role;
  }
}

module.exports = UserDTO;
