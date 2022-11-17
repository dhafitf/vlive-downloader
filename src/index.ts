import downloadSinglePost from "./downloadSinglePost";

// Download video for 1 post.
downloadSinglePost("https://www.vlive.tv/post/0-30632351");

const multiplePosts = async (linksArr: string[]) => {
  try {
    for (let link of linksArr) {
      await downloadSinglePost(link);
    }
  } catch (error) {
    console.log(error);
  }
};

// Download multiple videos.
// Change this array with another valid vlive url
// Then uncomment funtion call in the bottom
const linksArr = [
  "https://www.vlive.tv/post/0-30632351",
  "https://www.vlive.tv/post/1-30705117",
  "https://www.vlive.tv/post/0-30768849",
  "https://www.vlive.tv/post/0-30838809",
];

// multiplePosts(linksArr);
