import iTask from "../interfaces/task.interface";
import Task from "../models/task.model";
import User from "../models/user.model";
import * as _ from "lodash";

const taskDal = {
    createNewTask: async (reqTask): Promise<iTask> => {
        const user: iTask = new Task(reqTask);
        const taskFromDb: iTask = await user.save();
        return taskFromDb;
    },

    checkTaskExist: async (taskId: string): Promise<iTask> => {
        const isTaskExist = await Task.findById(taskId).select('userId');
        return isTaskExist;
    },

    editUserTask: async (taskId: string, newTask: iTask): Promise<iTask> => {
        const updatedTask: iTask = await Task.findOneAndUpdate({ _id: taskId }, newTask, {
            new: true
        });
        return updatedTask;
    },

    deleteUserTask: async (taskId: string): Promise<iTask> => {
        let taskDeleted: iTask = await Task.findByIdAndDelete(taskId);
        return taskDeleted;
    },

    getUserAllTasks: async (userId: string): Promise<iTask[]> => {
        const userTasks: iTask[] = await Task.find({ userId: userId }).select('taskTitle description dueDate assignBy');
        return userTasks;
    },

    getAllTasks: async () => {
        const result = await Task.aggregate(
            [{
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userinfo",
                },
            },
            {
                $project: {
                    "userinfo.password": 0, "userinfo._id": 0,
                    "userinfo.role": 0,
                },
            },],
        );
        return result;
    },

    changeTaskStatus: async (taskId: string, newStatus: string) => {
        const task = await Task.findById(taskId);
        const prevStatus = task.status;
        const conditionsArray: boolean[] = [
            (prevStatus === "new" && newStatus !== 'in progress'),
            (prevStatus === "in progress" && newStatus !== 'done')
            , (prevStatus === "done")
        ]
        if (conditionsArray.includes(true)) {
            return false;
        }
        task.set({
            status: newStatus
        })
        await task.save();
        return true;
    },

    changeTaskStatusAdmin: async (taskId: string, newStatus: string): Promise<iTask> => {
        const updatedStatus = await Task.findByIdAndUpdate(taskId, {
            status: newStatus
        }, {
            new: true
        });
        return updatedStatus;
    }

}
export default taskDal;
