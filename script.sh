#!/bin/bash

check_network() {
  if podman network exists "$1"; then
    echo "Network $1 already exists."

  else
    echo "Creating network $1..."
    podman network create "$1"
  fi
}

check_volume() {
  if podman volume exists "$1"; then
    echo "Volume $1 already exists."
  else
    echo "Creating volume $1..."
    podman volume create "$1"
  fi
}

check_image() {
  if podman image exists "$1"; then
    echo "Image $1 already exists."
  else
    echo "Building image $1..."
    podman build -t "$1" "$2"
  fi
}

check_container() {
  if podman container exists "$1"; then
    echo "Container $1 already exists, starting it..."
    podman start "$1"
  else
    echo "Running container $1..."
    podman run --name "$1" "${@:2}"
  fi
}

check_network "go-fullstack"
check_volume "ordering-db"

check_image "localhost/react_orders_database" "./database"
sleep 1
check_container "database" --network go-fullstack -v ordering-db:/var/lib/mysql -d localhost/react_orders_database:latest

check_image "localhost/react_orders_frontend" "./frontend"
sleep 1
check_container "frontend" -p 5173:5173 --network go-fullstack -d localhost/react_orders_frontend:latest

sleep 2

check_image "localhost/react_orders_backend" "./backend"
sleep 1
check_container "backend" -p 8080:8080 --network go-fullstack localhost/react_orders_backend:latest