# Kafka

```sh
$ brew install kafka
$ brew install zookeeper

# uncomment the following line in "/usr/local/etc/kafka/server.properties"

# listeners = PLAINTEXT://9092

# or add the following 2 lines

# port = 9092

# advertised.host.name = localhost

$ zkServer start
$ kafka-server-start /usr/local/etc/kafka/server.properties
$ kafka-server-stop
$ zkServer stop

# Create a topic

$ kafka-topics --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test

# Send a message
$ kafka-console-producer --broker-list localhost:9092 --topic test

> HELLO Kafka

# Receive a message
$ kafka-console-consumer --bootstrap-server localhost:9092 --topic test --from-beginning
HELLO Kafka

```

Version: kafka_2.12-2.4.1

```sh
# Kafka cluster with 2 brokers
$ cp config/server.properties config/server-1.properties
$ cp config/server.properties config/server-2.properties
$ vim config/server-1.properties
  broker.id: 1
  log.dirs = /tmp/kafka-logs-1
  listeners = PLAINTEXT://9093
$ vim config/server-2.properties
  broker.id: 2
  log.dirs = /tmp/kafka-logs-2
  listeners = PLAINTEXT://9094

$ bin/zookeeper-server-start.sh config/zookeeper.properties
$ bin/kafka-server-start.sh config/server-1.properties
$ bin/kafka-server-start.sh config/server-2.properties

$ bin/kafka-topics.sh --create --bootstrap-server localhost:9093 --partitions 2 --replication-factor 2 --topic myTopicName
$ bin/kafka-topics.sh --list --bootstrap-server localhost:9093 -> myTopicName
```
