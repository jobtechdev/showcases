# Docker Ontology

Run the script

`./startDockerOntology.sh`


This will start a docker container with neo4j and load it with a cypher-dump of the Ontology.

This takes about 15 minutes to finish. When this is done it will display the message  "Reattaching to docker".


In a browser, open [http://localhost:7474/browser/](http://localhost:7474/browser/)



If you need to start your container again you can just use the command

`docker run -d \
    --rm \
    --name neo4j-ontology \
    --publish=7473:7473 --publish=7474:7474 --publish=7687:7687 \
    -v $PWD/data:/data \
    -v $PWD/logs:/logs \
    -v $PWD/import:/import \
    -v $PWD/conf:/conf \
    --env=NEO4J_dbms_memory_pagecache_size=4G \
    --env=NEO4J_dbms_memory_heap_maxSize=4G \
    --env=NEO4J_AUTH=none \
    --env=NEO4J_dbms_connector_https_listen__address=0.0.0.0:7473 \
    --env=NEO4J_dbms_connector_http_listen__address=0.0.0.0:7474 \
    --env=NEO4J_dbms_connector_bolt_listen__address=0.0.0.0:7687 \
    neo4j-ontology` 


# Data Model

## :Term
Terms are the words as they appear in a text.  

For example in the text
"A passion for React, Angular or Vue.js is highly desirable"

The word "Angular" is a term in this text.


## :Koncept

Concepts is what the terms actually refer to.

The term "Angular" actually refers to "AngularJS - a javascript framework".



It's like the semiotic triangle, where terms are symbols and concepts are thoughts or references.

[https://en.wikipedia.org/wiki/Triangle_of_reference](https://en.wikipedia.org/wiki/Triangle_of_reference)


# Word2Vec model

If you want to get the relationship between concepts you can use load a word2vec model with python and gensim.

[https://radimrehurek.com/gensim/index.html](https://radimrehurek.com/gensim/index.html)


`
from gensim.models.keyedvectors import KeyedVectors
model = KeyedVectors.load_word2vec_format("ontologi-relationer_v1.0.txt", binary=False)
model.similar_by_word('clojure:KOMPETENS')
`

