package repositories

import (
    "gorm.io/gorm"
    "ordering-system/models"
)

type UserRepository interface {
    FindByID(id uint) (*models.User, error)
    Create(user *models.User) error
    FindByEmail(email string) (*models.User, error)
    GetAllCourierIDs() ([]uint, error)
}

type userRepository struct {
    db *gorm.DB
}

func NewUserRepository(db *gorm.DB) UserRepository {
    return &userRepository{db}
}

func (r *userRepository) FindByID(id uint) (*models.User, error) {
    var user models.User
    if err := r.db.First(&user, id).Error; err != nil {
        return nil, err
    }
    return &user, nil
}

func (r *userRepository) Create(user *models.User) error {
    return r.db.Create(user).Error
}

func (r *userRepository) FindByEmail(email string) (*models.User, error) {
	var user models.User
	if err := r.db.Where("email = ?", email).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) GetAllCourierIDs() ([]uint, error) {
    var ids []uint
    if err := r.db.Model(&models.User{}).Where("role = ?", "courier").Pluck("id", &ids).Error; err != nil {
        return nil, err
    }
    return ids, nil
}