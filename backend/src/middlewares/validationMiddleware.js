import Joi from 'joi';

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        next();
    };
};

const createTaskSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow('', null),
    status: Joi.string().valid('pending', 'in_progress', 'completed').default('pending'),
    due_date: Joi.date().iso().allow(null),
});

const updateTaskSchema = Joi.object({
    title: Joi.string(),
    description: Joi.string().allow('', null),
    status: Joi.string().valid('pending', 'in_progress', 'completed'),
    due_date: Joi.date().iso().allow(null),
});

export {
    validate,
    createTaskSchema,
    updateTaskSchema,
};
