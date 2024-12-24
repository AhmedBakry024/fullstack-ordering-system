#!/bin/bash
set -e

# Start MySQL with skip grant tables
mysqld --skip-grant-tables --user=mysql &
mysql_pid=$!

# Wait for MySQL to start
until mysqladmin ping --host=127.0.0.1 --silent; do
  echo "Waiting for MySQL to start..."
  sleep 1
done

# Reset the root password
mysql --host=127.0.0.1 -e "FLUSH PRIVILEGES;"
mysql --host=127.0.0.1 -e "ALTER USER 'root'@'localhost' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';"
mysql --host=127.0.0.1 -e "ALTER USER 'root'@'%' IDENTIFIED BY '${MYSQL_ROOT_PASSWORD}';"
mysql --host=127.0.0.1 -e "FLUSH PRIVILEGES;"

# Stop MySQL
kill $mysql_pid
wait $mysql_pid

# Start MySQL normally
exec mysqld --user=mysql