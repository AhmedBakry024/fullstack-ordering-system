package routes

import (
	"ordering-system/controllers"
	"ordering-system/repositories"
	"ordering-system/services"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(r *gin.Engine, db *gorm.DB) {
	userRepo := repositories.NewUserRepository(db)
	userService := services.NewUserService(userRepo)
	userController := controllers.NewUserController(userService)

	orderRepo := repositories.NewOrderRepository(db)
	orderService := services.NewOrderService(orderRepo)
	orderController := controllers.NewOrderController(orderService, userService)
	adminController := controllers.NewAdminController(orderService)

	// Define routes
	r.GET("/users/:id", userController.GetUserByID)
	r.POST("/users", userController.CreateUser)
	r.GET("/users/login", userController.LoginUser)
	admin := r.Group("/admin")

	r.POST("/order/create", orderController.CreateOrder)
	r.GET("/order/:id", orderController.GetOrderByID)
	r.GET("/order/delete/:id", orderController.DeleteOrder)
	r.PUT("/order/update", orderController.UpdateOrderStatus)
	r.GET("/order/customer/:id", orderController.GetAllOrdersByCustomerID)
	r.GET("/order/courier/:id", orderController.GetAllOrdersByCourierID)
	r.GET("/order/all", orderController.GetAllOrders)
	admin.GET("/orders", adminController.GetAllOrders)
	admin.POST("/orders/:id/assign", adminController.AssignOrderToCourier)
	admin.DELETE("/orders/:id", adminController.DeleteOrder)
}
