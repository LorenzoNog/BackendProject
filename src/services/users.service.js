import usersDao from "../daos/usersDao.js";

class UsersService {
  constructor(dao) {
    this.dao = dao;
  }

  async createUser(user) {
    const response = await this.dao.createUser(user);
    return response;
  }

  async getById(id) {
    const response = await this.dao.getById(id);
    return response;
  }

  async getUser() {
    const response = await this.dao.getUsers();
    return response;
  }

  async deleteById(uid) {
    const response = await this.dao.deleteById(uid);
    return response;
  }

  async updateUser(id, obj) {
    const response = await this.dao.updateUser(id, obj);
    return response;
  }

  async loginUser(user) {
    const response = await this.dao.loginUser(user);
    return response;
  }
}

export default new UsersService(usersDao);
