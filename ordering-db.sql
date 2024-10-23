-- create a database named 
CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) UNIQUE NOT NULL,
  `phone` varchar(20),
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(20) DEFAULT 'business_owner' COMMENT 'Can be business_owner, courier, customer, or admin',
  `created_at` timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `orders` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `business_owner_id` int,
  `courier_id` int,
  `customer_name` varchar(255),
  `customer_phone` varchar(20),
  `pickup_location` text NOT NULL,
  `dropoff_location` text NOT NULL,
  `package_details` text NOT NULL,
  `delivery_time` datetime,
  `status` varchar(20) DEFAULT 'pending' COMMENT 'Can be pending, accepted, picked_up, in_transit, delivered, cancelled',
  `created_at` timestamp DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` timestamp DEFAULT (CURRENT_TIMESTAMP) COMMENT 'Should auto-update on row modification'
);

CREATE TABLE `order_status_history` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `order_id` int,
  `status` varchar(20) COMMENT 'Tracks order status updates',
  `updated_by` int,
  `updated_at` timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `couriers` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `vehicle_info` varchar(255) COMMENT 'Information about the courier’s vehicle, optional',
  `rating` float DEFAULT 0
);

CREATE TABLE `admin_actions` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `admin_id` int,
  `action_type` varchar(50) COMMENT 'Can be update_status, delete_order, reassign_courier',
  `order_id` int,
  `action_details` text,
  `action_date` timestamp DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `notifications` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `recipient_id` int,
  `order_id` int,
  `message` text,
  `is_read` boolean DEFAULT false,
  `created_at` timestamp DEFAULT (CURRENT_TIMESTAMP)
);

ALTER TABLE `orders` ADD FOREIGN KEY (`business_owner_id`) REFERENCES `users` (`id`);

ALTER TABLE `orders` ADD FOREIGN KEY (`courier_id`) REFERENCES `users` (`id`);

ALTER TABLE `order_status_history` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

ALTER TABLE `order_status_history` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

ALTER TABLE `couriers` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `admin_actions` ADD FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`);

ALTER TABLE `admin_actions` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

ALTER TABLE `notifications` ADD FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`);

ALTER TABLE `notifications` ADD FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);
