FROM neo4j

ENV APOC_URI https://github.com/neo4j-contrib/neo4j-apoc-procedures/releases/download/3.2.0.4/apoc-3.2.0.4-all.jar


RUN apk add --no-cache --quiet \
    bash \
    curl


RUN mv plugins /plugins \
    && ln -s /plugins

RUN curl --fail --silent --show-error --location --output apoc-3.2.0.4-all.jar $APOC_URI \
    && mv apoc-3.2.0.4-all.jar /plugins

CMD ["neo4j"]
