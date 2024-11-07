package controllers

import (
    "crypto/sha256"
    "encoding/hex"
    "net/http"
    "strconv"
    "github.com/gin-gonic/gin"
    "ordering-system/models"
    "ordering-system/services"
    "github.com/badoux/checkmail"
)

type UserController struct {
    service services.UserService
}

func NewUserController(service services.UserService) *UserController {
    return &UserController{service}
}

func (ctrl *UserController) GetUserByID(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
        return
    }

    user, err := ctrl.service.GetUserByID(uint(id))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    c.JSON(http.StatusOK, user)
}

func (ctrl *UserController) LoginUser(c *gin.Context) {
    email := c.Query("email")
    password := c.Query("password")
    if email == "" || password == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Email and password are required"})
        return
    }

    if !isEmailValid(email) {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email address"})
        return
    }

    user, err := ctrl.service.GetUserByEmail(email)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    hashedPassword := hashPassword(password)

    if user.Password != hashedPassword {
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

    // check if the email is matching the email pattern
    if !isEmailValid(user.Email) {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email address"})
        return
    }

    user.Password = hashPassword(user.Password)

    if err := ctrl.service.CreateUser(&user); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusCreated, user)
}

func hashPassword(password string) string {
    hash := sha256.New()
    hash.Write([]byte(password))
    return hex.EncodeToString(hash.Sum(nil))
}