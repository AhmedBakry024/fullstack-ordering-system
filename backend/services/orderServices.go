package services

import (
	"ordering-system/models"
	"ordering-system/repositories"
)

type OrderService interface {
	GetOrderByID(id uint) (*models.Order, error)
	CreateOrder(order *models.Order) error
	DeleteOrder(id uint) error
	UpdateOrderStatus(id uint, status string) error
	GetAllOrdersByCustomerID(customerID uint) ([]models.Order, error)
	GetAllOrdersByCourierID(courierID uint) ([]models.Order, error)
	GetAllOrders() ([]models.Order, error)
}

type orderService struct {
	repo repositories.OrderRepository
}

func NewOrderService(repo repositories.OrderRepository) OrderService {
	return &orderService{repo}
}

func (s *orderService) GetOrderByID(id uint) (*models.Order, error) {
	return s.repo.FindByID(id)
}

func (s *orderService) CreateOrder(order *models.Order) error {
	return s.repo.Create(order)
}

func (s *orderService) DeleteOrder(id uint) error {
	return s.repo.Delete(id)
}

func (s *orderService) UpdateOrderStatus(id uint, status string) error {
	return s.repo.UpdateStatus(id, status)
}

func (s *orderService) GetAllOrdersByCustomerID(customerID uint) ([]models.Order, error) {
	return s.repo.GetAllByCustomerID(customerID)
}

func (s *orderService) GetAllOrdersByCourierID(courierID uint) ([]models.Order, error) {
	return s.repo.GetAllByCourierID(courierID)
}

func (s *orderService) GetAllOrders() ([]models.Order, error) {
	return s.repo.GetAll()
}