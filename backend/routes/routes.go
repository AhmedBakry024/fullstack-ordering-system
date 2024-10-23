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

    r.GET("/users/:id", userController.GetUserByID)
    r.POST("/users", userController.CreateUser)
	r.GET("/ping", controllers.PingAdmin)
    r.GET("/users/login", userController.LoginUser)

    return r
}