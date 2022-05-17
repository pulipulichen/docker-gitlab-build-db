FROM ubuntu:22.04

RUN apt-get update
RUN apt-get install -y unzip

COPY database-mysql.zip /database.zip
COPY entrypoint.sh /



#RUN mkdir /home/$MYSQL_USER
#RUN useradd -m $MYSQL_USER
#ENTRYPOINT []
#CMD ["/entrypoint.sh"]

CMD ["sh", "/entrypoint.sh"]