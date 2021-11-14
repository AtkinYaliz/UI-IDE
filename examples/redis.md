```ssh
$ wget http://download.redis.io/redis-stable.tar.gz
$ tar xvzf redis-stable.tar.gz
$ cd redis-stable
$ make

$ sudo apt-get install make
$ make distclean
$ make

$ nohup src/redis-server ./redis.conf &
$ src/redis-cli


> config set stop-writes-on-bgsave-error no
> CONFIG GET databases
> INFO keyspace
> select dbNumber
> KEYS *
> TYPE "q:job:3"
> get keyName
> hkeys q:job:3
```

[Node](/node.md)
