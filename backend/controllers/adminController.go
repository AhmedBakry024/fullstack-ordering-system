package controllers

import (
	"net/http"
	"github.com/gin-gonic/gin"
)

// Return pong when pinged
func PingAdmin(c *gin.Context) {
	c.String(http.StatusOK, "pong")
}