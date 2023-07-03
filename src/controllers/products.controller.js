import productsService from "../services/products.service.js";
import UserDto from '../dto/usersDto/userDto.js'
import logger from "../utils/winston.js";

class ProductController {
  createProduct = async (req, res) => {
    const product = req.body;
    try {
      const newProduct = await productsService.createProduct(product);
      logger.info(newProduct);
      res.redirect("/products");
    } catch (error) {
      logger.error(error);
    }
  };

  getProducts = async (req, res) => {
    const { limit = 10, page = 1, sort, ...query } = req.query;
    const options = {
      limit: limit,
      page: page,
      sort: sort ? { price: sort } : {},
      lean: true,
    };
    try {
      const products = await productsService.getProducts(query, options);
      res.send(products);
    } catch (error) {
      logger.error(error.message);
    }
  };

  getProductById = async (req, res) => {
    const { pid } = req.params;
    try {
      const product = await productsService.getById(pid);
      res.send(product);
    } catch (error) {
      logger.error(error.message);
    }
  };

  updateProduct = async (req, res) => {
    const { pid } = req.params;
    const obj = req.body;
    try {
      const updatedProduct = await productsService.updateProduct(pid, obj);
      res.send(updatedProduct);
    } catch (error) {
      logger.error(error.message);
    }
  };

  deleteById = async (req, res) => {
    const { pid } = req.params;
    try {
      const product = await productsService.deleteById(pid);
      res.send(product);
    } catch (error) {
      logger.error(error.message);
    }
  };
}

export default new ProductController();
