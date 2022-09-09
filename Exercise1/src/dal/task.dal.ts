import * as _ from "lodash";
import { iTask } from "../interfaces/index.interfaces";
import { Task } from "../models/index.model";

const taskDal = {
    create: async (reqTask): Promise<iTask> => {
        const newTask: iTask = new Task(reqTask);
        const task: iTask = await newTask.save();
        return task;
    },

    isTaskExists: async (taskId: string): Promise<iTask> => {
        const task: iTask = await Task.findById(taskId).select('userId');
        return task;
    },

    editUserTask: async (taskId: string, newTask: iTask): Promise<iTask> => {
        const updatedTask: iTask = await Task.findOneAndUpdate({ _id: taskId }, newTask, {
            new: true
        });
        return updatedTask;
    },

    delete: async (taskId: string): Promise<iTask> => {
        let deletedTask: iTask = await Task.findByIdAndDelete(taskId);
        return deletedTask;
    },

    getUserTasks: async (userId: string, pageNo: number, pageSize: number): Promise<iTask[]> => {
        const skip: number = (pageNo - 1) * pageSize;
        const userTasks: iTask[] = await Task.find({ userId: userId }).select('taskTitle description dueDate assignBy').skip(skip).limit(pageSize);
        return userTasks;
    },

    getAllTasks: async (pageNo: number, pageSize: number) => {
        const skip: number = (pageNo - 1) * pageSize;
        try {
            const tasks = await Task.aggregate(
                [
                    {
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
                    },
                    { "$skip": skip },
                    { "$limit": parseInt(pageSize.toString()) }
                ],
            )
            return tasks;
        } catch (error) {
            console.log(error);
        }
    },

    changeStatus: async (taskId: string, newStatus: string) => {
        const task: iTask = await Task.findById(taskId);
        const prevStatus: string = task.status;
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

    changeStatusAdmin: async (taskId: string, newStatus: string): Promise<iTask> => {
        const updatedTask: iTask = await Task.findByIdAndUpdate(taskId, {
            status: newStatus
        }, {
            new: true
        });
        return updatedTask;
    },

    searchTasks: async (keyword: string): Promise<iTask[]> => {
        const matchedTasks: iTask[] = await Task.find({ "taskTitle": { $regex: keyword, "$options": "i" } });
        return matchedTasks;
    },

}
export default taskDal;
