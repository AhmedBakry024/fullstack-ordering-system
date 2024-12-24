FROM mysql:latest

ARG MYSQL_ROOT_PASSWORD=TopG123#
ARG MYSQL_DATABASE=OrderingSystem
ARG MYSQL_USER=bakry
ARG MYSQL_PASSWORD=TopG123#

ENV MYSQL_ROOT_PASSWORD={MYSQL_ROOT_PASSWORD}
ENV MYSQL_DATABASE={MYSQL_DATABASE}
ENV MYSQL_USER={MYSQL_USER}
ENV MYSQL_PASSWORD={MYSQL_PASSWORD}


COPY ordering-db.sql /docker-entrypoint-initdb.d/
COPY entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3306

ENTRYPOINT ["entrypoint.sh"]