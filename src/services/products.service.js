import productsDao from "../daos/productsDao.js";

class ProductsService{
    constructor(dao){
        this.dao = dao
    }

    createProduct = async (obj) => {
        const response = await this.dao.createProduct(obj)
        return response
    };

    getById = async (id) => {
        const response = await this.dao.getProductById(id)
        return response
    };

    getProducts = async (userQuery, options) => {
        const response = await this.dao.getProducts(userQuery,options)
        return response
    };

    deleteById = async (id) => {
        const response = await this.dao.deleteById(id)
        return response
    };

    updateProduct = async(id, obj) => {
        const response = await this.dao.updateProduct(id,obj)
        return response
    }
}

export default new ProductsService(productsDao)