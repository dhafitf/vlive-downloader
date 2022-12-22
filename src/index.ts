import downloadSinglePost from "./downloadSinglePost";
import async from "async";
import path from "path";
import fs from "fs";

const mainPath = path.join("videos");
if (!fs.existsSync(mainPath)) {
  fs.mkdirSync(mainPath);
  console.log(`'/videos' folder has been created`);
}

// Download video for 1 post.
downloadSinglePost("https://www.vlive.tv/post/0-31333852");

const multiplePosts = async (linksArr: string[]) => {
  let q = async.queue(async function (link: string, callback) {
    await downloadSinglePost(link, callback);
  }, 1);

  q.drain(function () {
    console.log("All items have been processed");
  });

  q.error(function (err, task) {
    console.error("Task encountered an error", task);
  });

  for (let link of linksArr) {
    q.push(link);
  }
};

// Download multiple videos.
// Change this array with another valid vlive url
// Then uncomment funtion call in the bottom
const linksArr = [
  "https://www.vlive.tv/post/0-31333852",
  "https://www.vlive.tv/post/0-31251927",
  "https://www.vlive.tv/post/1-18349415",
  "https://www.vlive.tv/post/1-18286697",
];

// multiplePosts(linksArr);
