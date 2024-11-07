package models

import (
	"gorm.io/gorm"
)

type Item struct {
	gorm.Model
	ID       uint
	Name     string
	Price    float64
	Quantity int
	Weight   float64
	OrderID  uint
}
