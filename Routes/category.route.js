// Import the modules from package
import { Router } from 'express';
const router = Router();
import Category from '../Models/category.model.js';
import { categorySchema } from '../helpers/validation_schema.js';
import { Header, Response } from '../Models/response.model.js';

//Create Category
router.post('/new', async (req, res, next) => {
    try {
        const cat = await categorySchema.validateAsync(req.body);
        const category = Category({
            name: cat.name,
            imageUrl: cat.imageUrl,
            parentID: cat.parentID,
            status: "ACTIVE"
        });
        await category.save();
        res.status(200).json(
            Response(Header(0, null, null), {
                message: "Category created!"
            })
        );
    } catch (error) {
        // Check if error is from joi validation then send unaccessible property error
        if (error.isJoi === true) error.status = 422;
        res.status(200).json(
            Response(Header(1, error.status, error.message))
        );
    }
});

// Get all Category
router.get('/all', async (req, res, next) => {
    try {
        const list = await Category.find();
        res.send(Response(Header(0, null, null), { categories: list }));
    } catch (error) {
        res.status(200).json(
            Response(Header(1, error.status, error.message))
        );
    }
});

//Read category by id
router.get('/:id', async (req, res, next) => {
    Category.findById(req.params.id)
        .then(doc => {
            if (doc) {
                res.status(200).json(
                    Response(Header(0, null, null), { category: doc })
                );
            } else {
                res.status(200).json(
                    Response(Header(0, 404, "No entry found for provided category"),)
                )
            }
        })
        .catch(err => {
            res.status(200).json(
                Response(Header(1, err.status, err.message))
            );
        });
});

//Update category
router.put('/update/:id', async (req, res, next) => {
    const result = req.body;
    Category.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            name: result.name,
            imageUrl: result.imageUrl,
            parentID: result.parentID,
        }
    })
        .then(result => {
            res.status(200).json(Response(Header(0, null, null), {
                category: result
            }));
        })
        .catch(err => {
            res.status(200).json(
                Response(Header(1, err.status, err.message))
            );
        });
});

//delete category
router.delete('/delete/:id', async (req, res, next) => {

    Category.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            status: "INACTIVE"
        }
    })
        .then(result => {
            res.status(200).json(Response(Header(0, null, null), {
                message: "Category deleted."
            }))
        })
        .catch(err => {
            res.status(200).json(
                Response(Header(1, err.status, err.message))
            );

        });
})


export default router;