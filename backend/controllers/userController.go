package controllers

import (
    "net/http"
    "strconv"
    "github.com/gin-gonic/gin"
    "ordering-system/models"
    "ordering-system/services"
)

type UserController struct {
    service services.UserService
}

func NewUserController(service services.UserService) *UserController {
    return &UserController{service}
}

func (ctrl *UserController) GetUserByID(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if (err != nil) {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
        return
    }

    user, err := ctrl.service.GetUserByID(uint(id))
    if (err != nil) {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    c.JSON(http.StatusOK, user)
}

func (ctrl *UserController) LoginUser(c *gin.Context) {
	// TODO: Implement login functionality
	email := c.Query("email")
	password := c.Query("password")
	if email == "" || password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email and password are required"})
		return
	}
	// Check if user exists in the database
	user, err := ctrl.service.GetUserByEmail(email)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	// Check if the password is correct
	if user.Password != password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
		return
	}
	c.JSON(http.StatusOK, user)
}

func (ctrl *UserController) CreateUser(c *gin.Context) {
    var user models.User
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    if err := ctrl.service.CreateUser(&user); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, user)
}