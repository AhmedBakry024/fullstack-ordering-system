package controllers

import (
	"log"
	"net/http"
	"ordering-system/models"
	"ordering-system/services"
	"strconv"

	"github.com/gin-gonic/gin"
)

type OrderController struct {
	service services.OrderService
}

type Response struct {
    Status  string      `json:"status"`
    Message string      `json:"message"`
    Data    interface{} `json:"data,omitempty"`
    Error   string      `json:"error,omitempty"`
}

func NewOrderController(service services.OrderService) *OrderController {
	return &OrderController{service}
}

func (ctrl *OrderController) GetOrderByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
		return
	}

	order, err := ctrl.service.GetOrderByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, order)
}

func (ctrl *OrderController) CreateOrder(c *gin.Context) {
    var order models.Order
    if err := c.ShouldBindJSON(&order); err != nil {
        log.Printf("Error binding JSON: %v", err)
        c.JSON(http.StatusBadRequest, Response{
            Status:  "error",
            Message: "Invalid input",
            Error:   err.Error(),
        })
        return
    }

    // Validate required fields
    if order.PickupLocation == "" || order.DropoffLocation == "" {
        c.JSON(http.StatusBadRequest, Response{
            Status:  "error",
            Message: "Missing required fields",
            Error:   "Pickup and dropoff locations are required",
        })
        return
    }

    if err := ctrl.service.CreateOrder(&order); err != nil {
        log.Printf("Error creating order: %v", err)
        c.JSON(http.StatusInternalServerError, Response{
            Status:  "error",
            Message: "Failed to create order",
            Error:   err.Error(),
        })
        return
    }

    c.JSON(http.StatusCreated, Response{
        Status:  "success",
        Message: "Order created successfully",
        Data:    order,
    })
}

func (ctrl *OrderController) DeleteOrder(c *gin.Context) {
    id, err := strconv.ParseUint(c.Param("id"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, Response{
            Status:  "error",
            Message: "Invalid order ID",
            Error:   err.Error(),
        })
        return
    }

    // Check if order exists
    if _, err := ctrl.service.GetOrderByID(uint(id)); err != nil {
        c.JSON(http.StatusNotFound, Response{
            Status:  "error",
            Message: "Order not found",
            Error:   err.Error(),
        })
        return
    }

    if err := ctrl.service.DeleteOrder(uint(id)); err != nil {
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

func (ctrl *OrderController) UpdateOrderStatus(c *gin.Context) {
    id, err := strconv.ParseUint(c.Param("id"), 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, Response{
            Status:  "error",
            Message: "Invalid order ID",
            Error:   err.Error(),
        })
        return
    }

    var status struct {
        Status string `json:"status" binding:"required,oneof=pending accepted picked_up in_transit delivered cancelled"`
    }

    if err := c.ShouldBindJSON(&status); err != nil {
        c.JSON(http.StatusBadRequest, Response{
            Status:  "error",
            Message: "Invalid status",
            Error:   err.Error(),
        })
        return
    }

    // Check if order exists
    order, err := ctrl.service.GetOrderByID(uint(id))
    if err != nil {
        c.JSON(http.StatusNotFound, Response{
            Status:  "error",
            Message: "Order not found",
            Error:   err.Error(),
        })
        return
    }

    // Validate status transition
    if !isValidStatusTransition(order.Status, status.Status) {
        c.JSON(http.StatusBadRequest, Response{
            Status:  "error",
            Message: "Invalid status transition",
            Error:   "Cannot transition from " + order.Status + " to " + status.Status,
        })
        return
    }

    if err := ctrl.service.UpdateOrderStatus(uint(id), status.Status); err != nil {
        log.Printf("Error updating order status: %v", err)
        c.JSON(http.StatusInternalServerError, Response{
            Status:  "error",
            Message: "Failed to update order status",
            Error:   err.Error(),
        })
        return
    }

    c.JSON(http.StatusOK, Response{
        Status:  "success",
        Message: "Order status updated successfully",
        Data: map[string]string{
            "old_status": order.Status,
            "new_status": status.Status,
        },
    })
}

// Helper function to validate status transitions
func isValidStatusTransition(current, new string) bool {
    transitions := map[string][]string{
        "pending":    {"accepted", "cancelled"},
        "accepted":   {"picked_up", "cancelled"},
        "picked_up":  {"in_transit"},
        "in_transit": {"delivered"},
        "delivered":  {},
        "cancelled":  {},
    }

    validTransitions, exists := transitions[current]
    if !exists {
        return false
    }

    for _, status := range validTransitions {
        if status == new {
            return true
        }
    }
    return false
}
func (ctrl *OrderController) GetAllOrdersByCustomerID(c *gin.Context) {
	customerID, err := strconv.Atoi(c.Param("customer_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid customer ID"})
		return
	}

	orders, err := ctrl.service.GetAllOrdersByCustomerID(uint(customerID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No orders found for this customer"})
		return
	}

	c.JSON(http.StatusOK, orders)
}

func (ctrl *OrderController) GetAllOrdersByCourierID(c *gin.Context) {
	courierID, err := strconv.Atoi(c.Param("courier_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid courier ID"})
		return
	}

	orders, err := ctrl.service.GetAllOrdersByCourierID(uint(courierID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No orders found for this courier"})
		return
	}

	c.JSON(http.StatusOK, orders)
}

func (ctrl *OrderController) GetAllOrders(c *gin.Context) {
	orders, err := ctrl.service.GetAllOrders()
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No orders found"})
		return
	}

	c.JSON(http.StatusOK, orders)
}

func (ctrl *OrderController) AssignOrderToCourier(c *gin.Context) {

    id, err := strconv.ParseUint(c.Param("id"), 10, 32)
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
        AssignerID uint `json:"assigner_id" binding:"required"`
    }


    if err := c.ShouldBindJSON(&assignment); err != nil {
        c.JSON(http.StatusBadRequest, Response{
            Status:  "error",
            Message: "Invalid courier ID",
            Error:   err.Error(),
        })
        return
    }

    // check assigner role
    
    if err := ctrl.service.AssignOrderToCourier(uint(id), assignment.CourierID, assignment.AssignerID); err != nil {
        c.JSON(http.StatusInternalServerError, Response{
            Status:  "error",
            Message: "Failed to assign order to courier",
            Error:   err.Error(),
        })
        return
    }

    c.JSON(http.StatusOK, Response{
        Status:  "success",
        Message: "Order assigned successfully",
    })
}

