import downloadSinglePost from './downloadSinglePost';
import async from 'async';
import path from 'path';
import fs from 'fs';

const mainPath = path.join('videos');
if (!fs.existsSync(mainPath)) {
  fs.mkdirSync(mainPath);
  console.log(`Create folder : '/videos'`);
}

// Download video for 1 post.
// downloadSinglePost('https://www.vlive.tv/post/1-18349417');

const multiplePosts = async (linksArr: string[]) => {
  let q = async.queue(async function (lnik: any, callback) {
    await downloadSinglePost(lnik, callback);
  }, 1);

  q.drain(function () {
    console.log('all items have been processed');
  });

  q.error(function (err, task) {
    console.error('task experienced an error', task);
  });

  for (let link of linksArr) {
    q.push(link);
  }
};

// Download multiple videos.
// Change this array with another valid vlive url
// Then uncomment funtion call in the bottom
const linksArr = ['https://www.vlive.tv/post/1-18349417', 'https://www.vlive.tv/post/1-18349416', 'https://www.vlive.tv/post/1-18349415', 'https://www.vlive.tv/post/1-18286697'];

multiplePosts(linksArr);
