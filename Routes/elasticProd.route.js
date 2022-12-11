// Import the modules from package
import { Router } from 'express';
import axios from 'axios';
const router = Router();
import Product from '../Models/product.model.js';
import { productSchema } from '../helpers/validation_schema.js';
import { Header, Response } from '../Models/response.model.js';



// Get all Product with pagination and search
router.post('/search', async (req, res, next) => {
    const { offset, limit, keyword, auto } = req.body;
    try {
        const query = {
            "from": offset ?? 0,
            "size": auto ? 5 : limit ?? 3,
            "sort": { "_score": { "order": "desc" } },
            "query": {
                "wildcard": {
                    "name": `*${keyword.toLowerCase() ?? ""}*`
                }
            }
        };
        const { data } = await axios.post('http://localhost:9200/retrovegas/product/_search', query);
        const db_products = data.hits.hits;
        const products = [];
        const auto_complete = [];
        db_products.forEach(prod => {
            products.push({ _id: prod._id, ...prod._source });
            auto_complete.push(prod._source.name);
        });
        const result = {
            hits: data.hits.total.value,
            showing: products.length,
            auto_complete,
            products
        };
        res.send(Response(Header(0, null, null), result));
    } catch (error) {
        res.status(200).json(
            Response(Header(1, error.status, error.message))
        );
    }
});

export default router;