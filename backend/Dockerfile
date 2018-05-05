FROM openjdk:8-jdk-alpine
ENV APP_USER app
ENV APP_GROUP app

ADD target/backend.jar app.jar

RUN addgroup ${APP_GROUP} && adduser -D -G ${APP_GROUP} -u 1000 ${APP_USER}
VOLUME /tmp

ONBUILD RUN chmod 755 /app.jar

USER ${APP_USER}

ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /app.jar" ]