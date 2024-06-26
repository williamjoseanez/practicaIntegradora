const UserModel = require("./../dao/mongoDb/modelsDB/user.model.js");

class UserRepository {
  async findByEmail(email) {
    return UserModel.findOne({ email });
  }
}

module.exports = UserRepository;
