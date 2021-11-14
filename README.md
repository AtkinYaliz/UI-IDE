- [MS Code Snippets](/examples/custom.code-snippets.json)
- [Docker](/examples/docker.md)
- [Education System](/examples/education-system.md)
- [Git](/examples/git.md)
- [JS](/examples/js.md)
- [Kafka](/examples/kafka.md)
- [Kubernetes](/examples/kubernetes.md)
- [Mac](/examples/mac.md)
- [Mongo](/examples/mongo.md)
- [Node](/examples/node.md)
- [React](/examples/react.md)
- [Redis](/examples/redis.md)

---

<details><summary># youtube-dl #</summary>

youtube-dl --config-location .  
youtube-dl -o '~/Downloads/%(title)s.%(ext)s' --prefer-ffmpeg https://m.twitch.tv/videos/327690336

```
# youtube-dl.conf
-u mikecostea@gmail.com
-p Mikecostea1
-i
-c
--no-warnings
--console-title
--batch-file='batch-file.txt'
-o '%(playlist_title)s/%(playlist_index)s-%(title)s.%(ext)s'
-f 'best[tbr<=1000]/worst[[height>=720]]/best[[height<720]]'

# batch-file.txt
https://learning.oreilly.com/videos/distributed-systems-in/9781491924914
https://www.oreilly.com/videos/distributed-systems-in/9781491924914
```

Udeler: https://github.com/FaisalUmair/udemy-downloader-gui

</details>
  
https://help.github.com/articles/basic-writing-and-formatting-syntax
