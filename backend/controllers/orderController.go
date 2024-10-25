package controllers

import (
	"encoding/json"
	"net/http"
	"ordering-system/models"
	"ordering-system/services"
	"strconv"
    "github.com/gin-gonic/gin"
)

type OrderController struct {
	service services.OrderService
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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ctrl.service.CreateOrder(&order); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create order"})
		return
	}

	c.JSON(http.StatusCreated, order)
}

func (ctrl *OrderController) DeleteOrder(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
		return
	}

	if err := ctrl.service.DeleteOrder(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete order"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order deleted successfully"})
}

func (ctrl *OrderController) UpdateOrderStatus(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order ID"})
		return
	}

	var status struct {
		Status string `json:"status"`
	}

	if err := json.NewDecoder(c.Request.Body).Decode(&status); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if err := ctrl.service.UpdateOrderStatus(uint(id), status.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update order status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Order status updated successfully"})
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

