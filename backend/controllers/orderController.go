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
	orderService services.OrderService
	userService  services.UserService
}

type Response struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

func NewOrderController(orderService services.OrderService, userService services.UserService) *OrderController {
	return &OrderController{
		orderService: orderService,
		userService:  userService,
	}
}

func (ctrl *OrderController) GetOrderByID(c *gin.Context) {
	orderID, ordererr := strconv.Atoi(c.Query("orderID"))
	if ordererr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
		return
	}

	order, ordererr := ctrl.orderService.GetOrderByID(uint(orderID))
	if ordererr != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Order not found"})
		return
	}

	c.JSON(http.StatusOK, order)
}

func (ctrl *OrderController) CreateOrder(c *gin.Context) {
	var order models.Order
	if ordererr := c.ShouldBindJSON(&order); ordererr != nil {
		log.Printf("Error binding JSON: %v", ordererr)
		c.JSON(http.StatusBadRequest, Response{
			Status:  "error",
			Message: "Invalid input",
			Error:   ordererr.Error(),
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

	if ordererr := ctrl.orderService.CreateOrder(&order); ordererr != nil {
		log.Printf("Error creating order: %v", ordererr)
		c.JSON(http.StatusInternalServerError, Response{
			Status:  "error",
			Message: "Failed to create order",
			Error:   ordererr.Error(),
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
	orderID, ordererr := strconv.ParseUint(c.Query("orderID"), 10, 32)
	userID, userErr := strconv.ParseUint(c.Query("userID"), 10, 32)
	if ordererr != nil {
		c.JSON(http.StatusBadRequest, Response{
			Status:  "error",
			Message: "Invalid order ID",
			Error:   ordererr.Error(),
		})
		return
	}

	if userErr != nil {
		c.JSON(http.StatusBadRequest, Response{
			Status:  "error",
			Message: "Invalid user ID",
			Error:   userErr.Error(),
		})
		return
	}

	// get the user by the user ID and check if the user is an admin
	user, userErr := ctrl.userService.GetUserByID(uint(userID))
	if userErr != nil {
		c.JSON(http.StatusNotFound, Response{
			Status:  "error",
			Message: "User not found",
			Error:   userErr.Error(),
		})
		return
	}

	// Check if order exists
	order, ordererr := ctrl.orderService.GetOrderByID(uint(orderID))
	if ordererr != nil {
		c.JSON(http.StatusNotFound, Response{
			Status:  "error",
			Message: "Order not found",
			Error:   ordererr.Error(),
		})
		return
	}

	if user.Role != "admin" && order.CustomerID != user.ID {
		c.JSON(http.StatusUnauthorized, Response{
			Status:  "error",
			Message: "Unauthorized",
			Error:   "Only admins and the customer who created the order can delete the order",
		})
		return
	}

	if ordererr := ctrl.orderService.DeleteOrder(uint(orderID)); ordererr != nil {
		log.Printf("Error deleting order: %v", ordererr)
		c.JSON(http.StatusInternalServerError, Response{
			Status:  "error",
			Message: "Failed to delete order",
			Error:   ordererr.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, Response{
		Status:  "success",
		Message: "Order deleted successfully",
	})
}

func (ctrl *OrderController) UpdateOrderStatus(c *gin.Context) {

	orderID, err := strconv.ParseUint(c.Query("orderID"), 10, 32)
	userID, userErr := strconv.ParseUint(c.Query("userID"), 10, 32)
	newStatus := c.Query("status")

	if err != nil {
		c.JSON(http.StatusBadRequest, Response{
			Status:  "error",
			Message: "Invalid order ID",
			Error:   err.Error(),
		})
		return
	}

	if userErr != nil {
		c.JSON(http.StatusBadRequest, Response{
			Status:  "error",
			Message: "Invalid user ID",
			Error:   userErr.Error(),
		})
		return
	}

	// get the user by the user ID and check if the user is an admin
	user, userErr := ctrl.userService.GetUserByID(uint(userID))
	if userErr != nil {
		c.JSON(http.StatusNotFound, Response{
			Status:  "error",
			Message: "User not found",
			Error:   userErr.Error(),
		})
		return
	}

	if user.Role != "admin" && user.Role != "courier" {
		c.JSON(http.StatusUnauthorized, Response{
			Status:  "error",
			Message: "Unauthorized",
			Error:   "Only admins and couriers can update order status",
		})
		return
	}

	order, err := ctrl.orderService.GetOrderByID(uint(orderID))
	if err != nil {
		c.JSON(http.StatusNotFound, Response{
			Status:  "error",
			Message: "Order not found",
			Error:   err.Error(),
		})
		return
	}

	if !isValidStatusTransition(order.Status, newStatus) {
		c.JSON(http.StatusBadRequest, Response{
			Status:  "error",
			Message: "Invalid status transition",
			Error:   "Cannot transition from " + order.Status + " to " + newStatus,
		})
		return
	}

	if updateErr := ctrl.orderService.UpdateOrderStatus(uint(orderID), newStatus); updateErr != nil {
		log.Printf("Error updating order status: %v", updateErr)
		c.JSON(http.StatusInternalServerError, Response{
			Status:  "error",
			Message: "Failed to update order status",
			Error:   updateErr.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, Response{
		Status:  "success",
		Message: "Order status updated successfully",
		Data: map[string]string{
			"old_status": order.Status,
			"new_status": newStatus,
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
	customerID, ordererr := strconv.Atoi(c.Query("customerID"))
	if ordererr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid customer ID"})
		return
	}

	user, userErr := ctrl.userService.GetUserByID(uint(customerID))
	if userErr != nil {
		c.JSON(http.StatusNotFound, Response{
			Status:  "error",
			Message: "User not found",
			Error:   userErr.Error(),
		})
		return
	}

	if user.Role != "customer" {
		c.JSON(http.StatusUnauthorized, Response{
			Status:  "error",
			Message: "Unauthorized",
			Error:   "Only The customer can view their orders",
		})
		return
	}

	orders, ordererr := ctrl.orderService.GetAllOrdersByCustomerID(uint(customerID))
	if ordererr != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No orders found for this customer"})
		return
	}

	c.JSON(http.StatusOK, orders)
}

func (ctrl *OrderController) GetAllOrdersByCourierID(c *gin.Context) {
	courierID, ordererr := strconv.Atoi(c.Query("courierID"))
	if ordererr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid courier ID"})
		return
	}

	user, userErr := ctrl.userService.GetUserByID(uint(courierID))
	if userErr != nil {
		c.JSON(http.StatusNotFound, Response{
			Status:  "error",
			Message: "User not found",
			Error:   userErr.Error(),
		})
		return
	}

	if user.Role != "courier" {
		c.JSON(http.StatusUnauthorized, Response{
			Status:  "error",
			Message: "Unauthorized",
			Error:   "Only couriers can view their orders",
		})
		return
	}

	orders, ordererr := ctrl.orderService.GetAllOrdersByCourierID(uint(courierID))
	if ordererr != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No orders found for this courier"})
		return
	}

	c.JSON(http.StatusOK, orders)
}

func (ctrl *OrderController) GetAllOrders(c *gin.Context) {
	orders, ordererr := ctrl.orderService.GetAllOrders()
	if ordererr != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No orders found"})
		return
	}

	c.JSON(http.StatusOK, orders)
}

func (ctrl *OrderController) AssignOrderToCourier(c *gin.Context) {
	orderID, ordererr := strconv.ParseUint(c.Query("orderID"), 10, 32)
	userID, userErr := strconv.ParseUint(c.Query("userID"), 10, 32)
	courierID, courierErr := strconv.ParseUint(c.Query("courierID"), 10, 32)
	if ordererr != nil {
		c.JSON(http.StatusBadRequest, Response{
			Status:  "error",
			Message: "Invalid order ID",
			Error:   ordererr.Error(),
		})
		return
	}

	if userErr != nil {
		c.JSON(http.StatusBadRequest, Response{
			Status:  "error",
			Message: "Invalid user ID",
			Error:   userErr.Error(),
		})
		return
	}

	if courierErr != nil {
		c.JSON(http.StatusBadRequest, Response{
			Status:  "error",
			Message: "Invalid courier ID",
			Error:   courierErr.Error(),
		})
		return
	}

	user, userErr := ctrl.userService.GetUserByID(uint(userID))
	if userErr != nil {
		c.JSON(http.StatusNotFound, Response{
			Status:  "error",
			Message: "User not found",
			Error:   userErr.Error(),
		})
		return
	}

	if user.Role != "admin" {
		c.JSON(http.StatusUnauthorized, Response{
			Status:  "error",
			Message: "Unauthorized",
			Error:   "Only admins can assign orders",
		})
		return
	}

	if ordererr := ctrl.orderService.AssignOrderToCourier(uint(orderID), uint(courierID), uint(userID)); ordererr != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Status:  "error",
			Message: "Failed to assign order to courier",
			Error:   ordererr.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, Response{
		Status:  "success",
		Message: "Order assigned successfully",
	})
}

// book order
func (ctrl *OrderController) BookOrder(c *gin.Context) {
	orderID, ordererr := strconv.ParseUint(c.Query("orderID"), 10, 32)
	userID, userErr := strconv.ParseUint(c.Query("userID"), 10, 32)
	if ordererr != nil {
		c.JSON(http.StatusBadRequest, Response{
			Status:  "error",
			Message: "Invalid order ID",
			Error:   ordererr.Error(),
		})
		return
	}

	if userErr != nil {
		c.JSON(http.StatusBadRequest, Response{
			Status:  "error",
			Message: "Invalid user ID",
			Error:   userErr.Error(),
		})
		return
	}

	user, userErr := ctrl.userService.GetUserByID(uint(userID))
	if userErr != nil {
		c.JSON(http.StatusNotFound, Response{
			Status:  "error",
			Message: "User not found",
			Error:   userErr.Error(),
		})
		return
	}

	if user.Role != "customer" {
		c.JSON(http.StatusUnauthorized, Response{
			Status:  "error",
			Message: "Unauthorized",
			Error:   "Only customers can book orders",
		})
		return
	}

	if ordererr := ctrl.orderService.BookOrder(uint(orderID), uint(userID)); ordererr != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Status:  "error",
			Message: "Failed to book order",
			Error:   ordererr.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, Response{
		Status:  "success",
		Message: "Order booked successfully",
	})
}

func (ctrl *OrderController) DeclineOrder(c *gin.Context) {
	orderID, ordererr := strconv.ParseUint(c.Query("orderID"), 10, 32)
	userID, userErr := strconv.ParseUint(c.Query("userID"), 10, 32)
	if ordererr != nil {
		c.JSON(http.StatusBadRequest, Response{
			Status:  "error",
			Message: "Invalid order ID",
			Error:   ordererr.Error(),
		})
		return
	}

	if userErr != nil {
		c.JSON(http.StatusBadRequest, Response{
			Status:  "error",
			Message: "Invalid user ID",
			Error:   userErr.Error(),
		})
		return
	}

	user, userErr := ctrl.userService.GetUserByID(uint(userID))
	if userErr != nil {
		c.JSON(http.StatusNotFound, Response{
			Status:  "error",
			Message: "User not found",
			Error:   userErr.Error(),
		})
		return
	}

	order, ordererr := ctrl.orderService.GetOrderByID(uint(orderID))
	if ordererr != nil {
		c.JSON(http.StatusNotFound, Response{
			Status:  "error",
			Message: "Order not found",
			Error:   ordererr.Error(),
		})
		return
	}

	if order.CourierID != user.ID {
		c.JSON(http.StatusUnauthorized, Response{
			Status:  "error",
			Message: "Unauthorized",
			Error:   "Only the assigned courier can decline the order",
		})
		return
	}

	if ordererr := ctrl.orderService.DeclineOrder(uint(orderID)); ordererr != nil {
		c.JSON(http.StatusInternalServerError, Response{
			Status:  "error",
			Message: "Failed to decline order",
			Error:   ordererr.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, Response{
		Status:  "success",
		Message: "Order declined successfully",
	})
}

func (ctrl *OrderController) GetAllCourierIDs(c *gin.Context) {
	userID, userErr := strconv.Atoi(c.Query("userID"))
	if userErr != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	user, userErr := ctrl.userService.GetUserByID(uint(userID))
	if userErr != nil {
		c.JSON(http.StatusNotFound, Response{
			Status:  "error",
			Message: "User not found",
			Error:   userErr.Error(),
		})
		return
	}

	if user.Role != "admin" {
		c.JSON(http.StatusUnauthorized, Response{
			Status:  "error",
			Message: "Unauthorized",
			Error:   "Only admins can view all courier IDs",
		})
		return
	}

	courierIDs, err := ctrl.orderService.GetAllCourierIDs()
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No courier IDs found"})
		return
	}

	c.JSON(http.StatusOK, courierIDs)
}
