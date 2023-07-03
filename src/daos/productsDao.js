import logger from "../utils/winston.js";
import {ProductsModel} from './mongoDao/models/productsModel.js'

class ProductsDao {
    constructor(model){
        this.model = model
    }

    async createProduct(obj){
        try {
            const response = await this.model.create(obj)
            return response
        } catch (error) {
            return error
        }
    };

    async getProductById(id){
        try {
            const response = await this.model.findById(id)
            return response
        } catch (error) {
            return error
        }
    };

    async getProducts(userQuery, options){
        try {
            const products = await this.model.paginate(userQuery,options)
            const productsResponse = {
                status: "success",
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.prevPage ? `http://localhost:2022/api/products?page=${products.prevPage}` : null,
                nextLink: products.nextPage ? `http://localhost:2022/api/products?page=${products.nextPage}` : null,
            }
            if(!userQuery && !options){ 
                return await productModel.find()
            } else {
                return productsResponse
            }
        } catch (error) {
            return error.message
        }
    };

    async updateProduct(id, obj){
        try {
            const response = await this.model.updateOne({_id : id},{
                $set:{
                    ...obj
                }
            })
            return response
        } catch (error) {
            return error.message
        }
    };

    async deleteById(id){
        try {
            const response = await this.model.findByIdAndDelete(id)
            return response
        } catch (error) {
            return error.message
        }
    }
}

export default new ProductsDao(ProductsModel)