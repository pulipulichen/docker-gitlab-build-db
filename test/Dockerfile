FROM mysql:5.7.15

COPY entrypoint.sh /

RUN useradd $MYSQL_USER

CMD ["/entrypoint.sh"]