import Joi, { Schema } from "joi";
import { iTask } from "../../interfaces/index.interfaces";

const validateTasksFile = (taskArray: iTask[]) => {
    const taskSchema: Schema<iTask> = Joi.object().keys({
        taskTitle: Joi.string().min(5).max(20).required(),
        description: Joi.string().min(5).max(100).required(),
        dueDate: Joi.string().regex(/^([1-9]|0[1-9]|[12][0-9]|3[0-1])\/([1-9]|0[1-9]|1[0-2])\/\d{4}$/).required(),
    });

    const tasksArraySchema = Joi.array().items(taskSchema)
    return tasksArraySchema.validate(taskArray)
}
export default validateTasksFile;







