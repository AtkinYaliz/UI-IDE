<table>
  <tr>
    <td>
      <li><a href="/examples/aws-lambda.md">[AWS Lambda]</a></li>
      <li><a href="/examples/docker.md">[Docker]</a></li>
      <li><a href="/examples/education-system.md">[Education System]</a></li>
      <li><a href="/examples/git.md">[Git]</a></li>
      <li><a href="/examples/jest.md">[Jest]</a></li>
      <li><a href="/examples/js.md">[JS]</a></li>
      <li><a href="/examples/kafka.md">[Kafka]</a></li>
    </td>
    <td>
      <li><a href="/examples/kubernetes.md">[Kubernetes]</a></li>
      <li><a href="/examples/mac.md">[MAC]</a></li>
      <li><a href="/examples/mongo.md">[Mongo]</a></li>
      <li><a href="/examples/node.md">[Node]</a></li>
      <li><a href="/examples/react.md">[React]</a></li>
      <li><a href="/examples/redis.md">[Redis]</a></li>
      <li><a href="/examples/custom.code-snippets.json">[VS Code Snippets]</a></li>
    </td>
  </tr>
</table>
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
