import cartsDao from '../daos/cartsDao.js'

class CartsService{
    constructor(dao){
        this.dao = dao
    }

    createCart = async (obj) => {
        const response = await this.dao.createCart(obj)
        return response
    };

    getById = async (id) => {
        const response = await this.dao.getCartById(id)
        return response
    };

    getCarts = async () => {
        const response = await this.dao.getCarts()
        return response
    };

    deleteById = async (id) => {
        const response = await this.dao.deleteCartById(id)
        return response
    };

    deleteProductInCart = async (id,prodId) => {
        const response = await this.dao.deleteProductInCart(id,prodId)
        return response
    };

    addProductToCart = async (cid,pid) => {
        const response = await this.dao.addProductToCart(cid,pid)
        return response
    };

    updateQuantity = async (id,prodId,quantity) => {
        const response = await this.dao.updateQuantity(id,prodId,quantity)
        return response
    };
}

export default new CartsService(cartsDao)