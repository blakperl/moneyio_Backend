import Joi from "joi";

export const createTransactionSchema = Joi.object({
  amount: Joi.number().positive().required(),
});