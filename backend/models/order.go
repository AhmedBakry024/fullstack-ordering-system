package models

import (
	"encoding/json"
	"time"
	// "gorm.io/gorm"
)

type Order struct {
	ID              uint            `json:"id" gorm:"primaryKey;autoIncrement"`
	CourierID       uint            `json:"courier_id"`
	CustomerID      uint            `json:"customer_id"`
	CustomerName    string          `json:"customer_name" gorm:"size:255"`
	CustomerPhone   string          `json:"customer_phone" gorm:"size:20"`
	TotalPrice      float64         `json:"total_price" gorm:"not null"`
	PickupLocation  string          `json:"pickup_location" gorm:"not null"`
	DropoffLocation string          `json:"dropoff_location" gorm:"not null"`
	PackageDetails  string          `json:"package_details" gorm:"not null"`
	DeliveryTime    time.Time       `json:"delivery_time" gorm:"default:CURRENT_DATE + INTERVAL 2 DAY"`
	Status          string          `json:"status" gorm:"size:20;default:'pending'"`
	CreatedAt       time.Time       `json:"created_at" gorm:"default:CURRENT_TIMESTAMP"`
	OrderItems      json.RawMessage `json:"order_items" gorm:"type:json"`
}
