package services

import (
	"ordering-system/models"
	"ordering-system/repositories"
)

type UserService interface {
	GetUserByID(id uint) (*models.User, error)
	CreateUser(user *models.User) error
	GetUserByEmail(email string) (*models.User, error)
	GetAllCourierIDs() ([]uint, error)
}

type userService struct {
	repo repositories.UserRepository
}

func NewUserService(repo repositories.UserRepository) UserService {
	return &userService{repo}
}

func (s *userService) GetUserByID(id uint) (*models.User, error) {
	return s.repo.FindByID(id)
}

func (s *userService) CreateUser(user *models.User) error {
	return s.repo.Create(user)
}

func (s *userService) GetUserByEmail(email string) (*models.User, error) {
	return s.repo.FindByEmail(email)
}

func (s *userService) GetAllCourierIDs() ([]uint, error) {
	return s.repo.GetAllCourierIDs()
}