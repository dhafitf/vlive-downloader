import needle from "needle";
import cliProgress from "cli-progress";
import fs from "fs";
import path from "path";
import { VliveDownloader } from "./vliveDownloader";

const downloadSinglePost = async (vliveUrl: string) => {
  try {
    const isVliveUrl = vliveUrl.includes("vlive.tv/post");
    let postId = "";

    if (isVliveUrl) {
      postId = vliveUrl.split("/").pop() as string;
    } else {
      throw new Error("Not vlive url");
    }

    const downloader = new VliveDownloader(postId);
    await downloader.getPostData();
    await downloader.getVideoKey();
    await downloader.getVideoMetaData();
    downloader.withCategory();

    const validPath = path.normalize(downloader.videoData.data.title.replace(/"/g, ""));
    if (!fs.existsSync(validPath)) {
      fs.mkdirSync(validPath);
    }

    console.log("Download captions started");
    for (let caption of downloader.videoData.data.captions) {
      const url = caption.source;
      const data = await needle("get", url).then((res) => res.body);

      const splitedUrl = url.split("/").pop() as string;
      const filename = splitedUrl.split("_");
      filename.shift();

      fs.writeFileSync(`./${validPath}/${validPath}_${filename.join("_")}`, data);
    }
    console.log("Download captions finished");

    let data = JSON.stringify(downloader.videoData.data, null, 2);
    fs.writeFileSync(`./${validPath}/videoData.json`, data);

    const progressBar = new cliProgress.SingleBar(
      {
        format: "{bar} {percentage}% | ETA: {eta}s | Speed: {speed}",
      },
      cliProgress.Presets.shades_classic
    );

    let receivedBytes = 0;
    const videoPath = path.resolve(`${validPath}`, `${validPath}.mp4`);

    needle
      .get(downloader.videoUrl!)
      .on("response", (response) => {
        const totalBytes = response.headers["content-length"];
        progressBar.start(totalBytes, 0);
      })
      .on("data", (chunk) => {
        receivedBytes += chunk.length;
        progressBar.update(receivedBytes);
      })
      .pipe(fs.createWriteStream(videoPath))
      .on("done", function (err) {
        progressBar.stop();
      });
  } catch (error) {
    console.log(error);
  }
};

export default downloadSinglePost;
