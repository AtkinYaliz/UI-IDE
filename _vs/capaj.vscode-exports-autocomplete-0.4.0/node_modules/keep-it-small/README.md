# keep-it-small
fs utility for ensuring a directory is smaller than X bytes.

Useful when you want to cache some files into a directory-this handles cleaning up old files for you. All you have to do is specify the maximum size of the directory.

## usage

```javascript
import kis from 'keep-it-simple'

kis('./my-awesome-cache', '3kb').then((cache) => {
  cache.write('1', 'file content')
  cache.write('2', 'file 2 content')
})

//for reading, use regular fs methods
```

## methods

### size
returns integer - current size in bytes

### purge()
Removes All

### writeSync()

### write()
returns a promise