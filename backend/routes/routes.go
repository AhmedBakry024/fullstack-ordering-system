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

	r.GET("/users/:id", userController.GetUserByID)
	r.POST("/users", userController.CreateUser)
	r.GET("/users/login", userController.LoginUser)
	

	r.POST("/order/create", orderController.CreateOrder)
	r.GET("/order", orderController.GetOrderByID)
	r.DELETE("/order/delete", orderController.DeleteOrder)
	r.PUT("/order/update", orderController.UpdateOrderStatus)
	r.GET("/order/customer", orderController.GetAllOrdersByCustomerID)
	r.GET("/order/courier", orderController.GetAllOrdersByCourierID)
	r.GET("/order/all", orderController.GetAllOrders)
	r.PUT("/order/assign", orderController.AssignOrderToCourier)
	r.PUT("/order/book", orderController.BookOrder)
	r.PUT("/order/decline", orderController.DeclineOrder)
	r.GET("/user/couriers", userController.GetAllCourierIDs)
}
