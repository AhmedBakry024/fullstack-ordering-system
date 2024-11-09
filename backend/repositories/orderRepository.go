package repositories

import (
    "gorm.io/gorm"
    "ordering-system/models"
)

type OrderRepository interface {
    FindByID(id uint) (*models.Order, error)
    Create(order *models.Order) error
    Delete(id uint) error
    UpdateStatus(id uint, status string) error
    GetAllByCustomerID(customerID uint) ([]models.Order, error)
    GetAllByCourierID(courierID uint) ([]models.Order, error)
    GetAll() ([]models.Order, error)
    AssignToCourier(orderID, courierID uint) error
    Book(orderID, userID uint) error
    DeclineOrder(orderID uint) error
    GetAllCourierIDs() ([]uint, error)
}

type orderRepository struct {
    db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) OrderRepository {
    return &orderRepository{db}
}

func (r *orderRepository) FindByID(id uint) (*models.Order, error) {
    var order models.Order
    if err := r.db.First(&order, id).Error; err != nil {
        return nil, err
    }
    return &order, nil
}

func (r *orderRepository) Create(order *models.Order) error {
    return r.db.Create(order).Error
}

func (r *orderRepository) Delete(id uint) error {
    return r.db.Delete(&models.Order{}, id).Error
}

func (r *orderRepository) UpdateStatus(id uint, status string) error {
    return r.db.Model(&models.Order{}).Where("id = ?", id).Update("status", status).Error
}

func (r *orderRepository) GetAllByCustomerID(customerID uint) ([]models.Order, error) {
    var orders []models.Order
    if err := r.db.Where("customer_id = ?", customerID).Find(&orders).Error; err != nil {
        return nil, err
    }
    return orders, nil
}

func (r *orderRepository) GetAllByCourierID(courierID uint) ([]models.Order, error) {
    var orders []models.Order
    if err := r.db.Where("courier_id = ?", courierID).Find(&orders).Error; err != nil {
        return nil, err
    }
    return orders, nil
}

func (r *orderRepository) GetAll() ([]models.Order, error) {
    var orders []models.Order
    if err := r.db.Find(&orders).Error; err != nil {
        return nil, err
    }
    return orders, nil
}

func (r *orderRepository) AssignToCourier(orderID, courierID uint) error {
    return r.db.Model(&models.Order{}).Where("id = ?", orderID).Update("courier_id", courierID).Error
}

func (r *orderRepository) Book(orderID, userID uint) error {
    return r.db.Model(&models.Order{}).Where("id = ?", orderID).Update("customer_id", userID).Error
}

func (r *orderRepository) DeclineOrder(orderID uint) error {
    return r.db.Model(&models.Order{}).Where("id = ?", orderID).Update("courier_id", 0).Error
}

func (r *orderRepository) GetAllCourierIDs() ([]uint, error) {
    var ids []uint
    if err := r.db.Model(&models.Order{}).Select("courier_id").Group("courier_id").Find(&ids).Error; err != nil {
        return nil, err
    }
    return ids, nil
}