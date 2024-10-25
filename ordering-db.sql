-- Active: 1729277811648@@127.0.0.1@3306@OrderingSystem

CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `phone` varchar(20),
  `password` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'customer' COMMENT 'Can be courier, customer, or admin',
  `created_at` timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `orders` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `courier_id` int,
  `customer_id` int,
  `customer_name` varchar(255),
  `customer_phone` varchar(20),
  `total_price` float NOT NULL,
  `pickup_location` text NOT NULL,
  `dropoff_location` text NOT NULL,
  `package_details` text NOT NULL,
  `delivery_time` date DEFAULT (CURRENT_DATE + INTERVAL 2 DAY) NOT NULL,
  `status` varchar(20) DEFAULT 'pending' COMMENT 'Can be pending, accepted, picked_up, in_transit, delivered, cancelled',
  `created_at` timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `items` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `order_id` int,
  `name` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `weight` float NOT NULL,
  `price` float NOT NULL,
  `created_at` timestamp DEFAULT (CURRENT_TIMESTAMP)
);

ALTER TABLE `orders` ADD FOREIGN KEY (`courier_id`) REFERENCES `users` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`);

ALTER TABLE `items` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);