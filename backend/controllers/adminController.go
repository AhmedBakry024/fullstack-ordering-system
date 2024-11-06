// controllers/adminController.go
package controllers

import (
    "log"
    "net/http"
    "strconv"
    "github.com/gin-gonic/gin"
    "ordering-system/services"
)

type AdminController struct {
    orderService services.OrderService
}

func NewAdminController(orderService services.OrderService) *AdminController {
    return &AdminController{
        orderService: orderService,
    }
}

// Verify admin role
func (ctrl *AdminController) verifyAdmin(c *gin.Context) bool {
    role, exists := c.Get("userRole")
    if !exists || role != "admin" {
        c.JSON(http.StatusForbidden, Response{
            Status:  "error",
            Message: "Admin access required",
        })
        return false
    }
    return true
}

func (ctrl *AdminController) GetAllOrders(c *gin.Context) {
    if !ctrl.verifyAdmin(c) {
        return
    }

   
    orders, err := ctrl.orderService.GetAllOrders()
    if err != nil {
        c.JSON(http.StatusInternalServerError, Response{
            Status:  "error",
            Message: "Failed to fetch orders",
            Error:   err.Error(),
        })
        return
    }

    c.JSON(http.StatusOK, Response{
        Status:  "success",
        Message: "Orders retrieved successfully",
        Data:    orders,
    })
}

func (ctrl *AdminController) AssignOrderToCourier(c *gin.Context) {
    if !ctrl.verifyAdmin(c) {
        return
    }

    orderId, err := strconv.ParseUint(c.Param("id"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, Response{
            Status:  "error",
            Message: "Invalid order ID",
            Error:   err.Error(),
        })
        return
    }

    var assignment struct {
        CourierID uint `json:"courier_id" binding:"required"`
    }

    if err := c.ShouldBindJSON(&assignment); err != nil {
        c.JSON(http.StatusBadRequest, Response{
            Status:  "error",
            Message: "Invalid courier ID",
            Error:   err.Error(),
        })
        return
    }

    adminID, _ := c.Get("userID")
    err = ctrl.orderService.AssignOrderToCourier(uint(orderId), assignment.CourierID, adminID.(uint))
    if err != nil {
        log.Printf("Error assigning order: %v", err)
        c.JSON(http.StatusInternalServerError, Response{
            Status:  "error",
            Message: "Failed to assign order",
            Error:   err.Error(),
        })
        return
    }

    c.JSON(http.StatusOK, Response{
        Status:  "success",
        Message: "Order assigned successfully",
    })
}

// Delete order
func (ctrl *AdminController) DeleteOrder(c *gin.Context) {
    if !ctrl.verifyAdmin(c) {
        return
    }

    orderId, err := strconv.ParseUint(c.Param("id"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, Response{
            Status:  "error",
            Message: "Invalid order ID",
            Error:   err.Error(),
        })
        return
    }

    err = ctrl.orderService.DeleteOrder(uint(orderId))
    if err != nil {
        log.Printf("Error deleting order: %v", err)
        c.JSON(http.StatusInternalServerError, Response{
            Status:  "error",
            Message: "Failed to delete order",
            Error:   err.Error(),
        })
        return
    }

    c.JSON(http.StatusOK, Response{
        Status:  "success",
        Message: "Order deleted successfully",
    })
}

