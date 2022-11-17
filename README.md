# Vlive Downloader

This is just personal vlive downloader for upcomming project [oncetwice](https://github.com/dhafitf/oncetwice).
Feel free to fork and custumize by yourself.

## Download single video

Simply call `downloadSinglePost` with 1 parameter which is vlive post url.

```js
downloadSinglePost("https://www.vlive.tv/post/0-30632351");
```

## Download multiple video

Create new function called `multiplePosts` or whatever, then call `downloadSinglePost`.

```js
const linksArr = [
  "https://www.vlive.tv/post/0-30632351",
  "https://www.vlive.tv/post/1-30705117",
  "https://www.vlive.tv/post/0-30768849",
  "https://www.vlive.tv/post/0-30838809",
];

multiplePosts(linksArr);
```
