import express from "express";
import userController from "../controllers/userController"
let router = express.Router();

let initWebRoutes = (app) => {
    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);
    router.get("/api/user/:id/verify/:token/",userController.handleVerifyEmail);
    router.get("/api/valuesensor/:type/sensor/:value",userController.handleGetValueSensor);
    router.post("/api/post-data-esp32",userController.handlePostDataFromEsp32);
    router.post("/api/send-email-warning",userController.handleSendEmailWarning);
    router.post("/api/send-email",userController.handleSendEmail);
    
    return app.use("/", router);
}

module.exports = initWebRoutes;