#!/bin/sh
# Example
CLUSTER=Cluster0-shard-0/cluster0-shard-00-00-wh7gg.azure.mongodb.net:27017,cluster0-shard-00-01-wh7gg.azure.mongodb.net:27017,cluster0-shard-00-02-wh7gg.azure.mongodb.net:27017
DATABASE=testDB
COLLECTION=blkerij
USER=daniel
PASSWORD=Password123
mongoimport --host ${CLUSTER} --ssl --username ${USER} --password ${PASSWORD} --authenticationDatabase admin --db ${DATABASE} --collection ${COLLECTION} --type csv --file temp-output-file.csv --headerline
#!/bin/sh
