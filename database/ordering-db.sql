-- Active: 1729277811648@@127.0.0.1@3306@OrderingSystem

CREATE TABLE `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `password` varchar(255) NOT NULL,
    `role` varchar(20) DEFAULT 'customer' COMMENT 'Can be courier, customer, or admin',
    `created_at` timestamp NULL DEFAULT(now()),
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
);

CREATE TABLE `orders` (
    `id` int NOT NULL AUTO_INCREMENT,
    `courier_id` int DEFAULT NULL,
    `customer_id` int DEFAULT NULL,
    `customer_name` varchar(255) DEFAULT NULL,
    `customer_phone` varchar(20) DEFAULT NULL,
    `pickup_location` text NOT NULL,
    `dropoff_location` text NOT NULL,
    `package_details` text NOT NULL,
    `delivery_time` date NOT NULL DEFAULT((curdate() + interval 2 day)),
    `status` varchar(20) DEFAULT 'pending' COMMENT 'Can be pending, accepted, picked_up, in_transit, delivered, cancelled',
    `created_at` timestamp NULL DEFAULT(now()),
    `total_price` float NOT NULL,
    `order_items` json DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `courier_id` (`courier_id`),
    KEY `customer_id` (`customer_id`),
    CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`courier_id`) REFERENCES `users` (`id`),
    CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
);


SET FOREIGN_KEY_CHECKS=0;