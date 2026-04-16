const express = require('express');
const router = express.Router()
const { signup } = require('../controller/signup');
const { login } = require('../controller/login')
const { generateOTP, verifyOTP } = require('../middleware/otp');
const { createTodo, deleteTodo, updateTodo,
    getMyTodo, pendingTodos, getRejectedTodo,
    getTodoById, getAllTodo, approveTodo, rejectTodo } = require('../controller/Todo')
const { isAdmin } = require('../middleware/isAdmin')
    const {isAuth} =require('../middleware/isAuth')
    const {getMessage}= require('../controller/chatmessage')








console.log("Routes working");
router.post("/send-otp", generateOTP);                  // OTP bhejne ke liye
router.post("/verify-otp-signup", verifyOTP, signup);   // OTP verify + signup
router.post("/signup", signup);                         // normal signup
router.post("/login", login);                           //login
router.post("/verify-otp-login", verifyOTP, login)      //verifyotp+login
router.post("/create-todo", isAuth, createTodo)         // user create todo
router.delete("/delete-todo/:id", isAuth, deleteTodo)       //user delete todo
router.patch("/update-todo/:id", isAuth, updateTodo);       // update todo
router.get("/get-todo/:id", isAuth, getMyTodo);             //get todo
router.get("/pending-todo", isAdmin, pendingTodos)      //admin to get pending todo
router.get("/rejected-todo", isAdmin, getRejectedTodo)  // admin rejected
router.get("/get-all", getAllTodo)            // admin to get all todos
router.get("/get-todobyId", isAdmin, getTodoById)       //to get todo by id
router.patch("/approve/:id", isAdmin, approveTodo)      // admin approve todo
router.patch("/reject/:id", isAdmin, rejectTodo)        // admin reject todo
router.get("/get-chat/:id",isAuth,getMessage)           // chat between user and admin

router.get("/", (req, res) => {
    res.send("API is working fine");
}
)

module.exports = router;