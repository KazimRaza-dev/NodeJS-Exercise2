import * as _ from "lodash";
import nodemailer, { Transporter } from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

const sendEmailToUser = async (loginUserName: string, assignTo: string) => {
    try {
        const email: string = process.env.email;
        const password: string = process.env.emailPassword;

        const transporter: Transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: email,
                pass: password
            }
        })
        const today: Date = new Date();
        const dateAndTime = today.toLocaleTimeString('it-IT');

        const textToSent: string = loginUserName + " has assign you a task on NodeExercise website. Sign Up to view that Task. You can register yourself at http://localhost:3001/user/register";

        var mailOptions = {
            from: email,
            to: assignTo,
            subject: 'Node JS Exercise 1' + " - " + dateAndTime,
            text: textToSent,
        };
        const { error } = await transporter.sendMail(mailOptions);
        if (error) {
            console.log(error);
            return false;
        }
        else {
            console.log("Mail successfully sent.");
            return true;
        }
    }
    catch (error) {
        return false;
    }
}
export default sendEmailToUser;