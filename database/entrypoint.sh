#!/bin/bash
set -e

# Start MySQL with skip grant tables
mysqld --skip-grant-tables &
mysql_pid=$!

# Wait for MySQL to start
until mysqladmin ping; do
  sleep 1
done

# Reset the root password
mysql -e "FLUSH PRIVILEGES;"
mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';"
mysql -e "ALTER USER 'root'@'%' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';"
mysql -e "FLUSH PRIVILEGES;"

# Stop MySQL
kill $mysql_pid
wait $mysql_pid

# Start MySQL normally
exec mysqld