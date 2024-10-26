package routes

import (
    "github.com/gin-gonic/gin"
    "gorm.io/gorm"
    "ordering-system/controllers"
    "ordering-system/repositories"
    "ordering-system/services"
)

func SetupRouter(db *gorm.DB) *gin.Engine {
    r := gin.Default()

    userRepo := repositories.NewUserRepository(db)
    userService := services.NewUserService(userRepo)
    userController := controllers.NewUserController(userService)

    orderRepo := repositories.NewOrderRepository(db)
    orderService := services.NewOrderService(orderRepo)
    orderController := controllers.NewOrderController(orderService)

    r.GET("/users/:id", userController.GetUserByID)
    r.POST("/users", userController.CreateUser)
	// r.GET("/ping", controllers.PingAdmin)
    r.GET("/users/login", userController.LoginUser)

    // add the routes for the other controllers
    // ...

    r.POST("/order/create", orderController.CreateOrder)
    r.GET("/order/:id", orderController.GetOrderByID)
    r.GET("/order/delete/:id", orderController.DeleteOrder)
    r.PUT("/order/update/:id", orderController.UpdateOrderStatus)
    r.GET("/order/customer/:id", orderController.GetAllOrdersByCustomerID)
    r.GET("/order/courier/:id", orderController.GetAllOrdersByCourierID)
    r.GET("/order/all", orderController.GetAllOrders)

    

    return r
}