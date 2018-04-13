#!/bin/bash
# Starta en docker container med neo4j.
echo $PWD
waitTime=10

#Port konfigurering
httpsPort=7473
httpPort=7474
boltPort=7687


#Bygg docker containern
docker build -t 'neo4j-ontology' . 

#Starta Dockern
docker run -d \
    --rm \
    --name neo4j-ontology \
    --publish=$httpsPort:$httpsPort --publish=$httpPort:$httpPort --publish=$boltPort:$boltPort \
    -v $PWD/data:/data \
    -v $PWD/logs:/logs \
    -v $PWD/import:/import \
    -v $PWD/conf:/conf \
    --env=NEO4J_dbms_memory_pagecache_size=4G \
    --env=NEO4J_dbms_memory_heap_maxSize=4G \
    --env=NEO4J_AUTH=none \
    --env=NEO4J_dbms_connector_https_listen__address=0.0.0.0:$httpsPort \
    --env=NEO4J_dbms_connector_http_listen__address=0.0.0.0:$httpPort \
    --env=NEO4J_dbms_connector_bolt_listen__address=0.0.0.0:$boltPort \
    neo4j-ontology 

echo "sleeping for $t seconds, waiting for neo4j to start. This vale can be tweaked"
for i in $(seq 1 $waitTime);
do
	echo "$i"
	sleep 1
done
echo "Done"

echo ""

# Läser in constraints till ontologin
echo "Importing contraints..."
docker exec neo4j-ontology sh -c "cat /import/constraints.cypher | /var/lib/neo4j/bin/cypher-shell -a localhost:$boltPort --encryption false"


# Läser in ontologin, Obs! tar lång tid.
echo "Importing ontologi...(This will take a while...... Have a coffee break!)"
docker exec neo4j-ontology sh -c "cat /import/ontology-dump.cypher | /var/lib/neo4j/bin/cypher-shell -a localhost:$boltPort --encryption false"


# Connecta mot dockern som körs.
echo "Reattaching to docker"
docker attach neo4j-ontology
