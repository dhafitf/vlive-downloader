import { VideoData } from './videoData';
import needle from 'needle';
import type { Caption } from './types/videoTypes';

export class VliveDownloader {
  private postId: string;
  private videoSeq?: string;
  private videoKey?: any;
  private officialVideo?: any;
  public videoUrl?: string;
  constructor(postId: string) {
    this.postId = postId;
  }

  public readonly videoData = new VideoData();

  private getPostOption() {
    return {
      method: 'GET',
      headers: {
        Referer: `https://www.vlive.tv/post/${this.postId}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
      },
    };
  }

  public async getPostData() {
    const data = await needle(
      'get',
      `https://www.vlive.tv/globalv-web/vam-web/post/v1.0/post-${this.postId}?appId=8c6cc7b45d2568fb668be6e05b6e5a3b&fields=attachments,author,authorId,availableActions,board{boardId,title,boardType,readAllowedLabel,payRequired,includedCountries,excludedCountries},boardId,body,channel{channelName,channelCode},channelCode,commentCount,contentType,createdAt,emotionCount,excludedCountries,includedCountries,isViewerBookmarked,isCommentEnabled,isHiddenFromStar,lastModifierMember,notice,officialVideo,originPost,plainBody,postId,postVersion,reservation,starReactions,targetMember,targetMemberId,thumbnail,title,url,smartEditorAsHtml,viewerEmotionId,writtenIn,playlist.limit(30)&locale=en_US`,
      this.getPostOption()
    ).then((res) => res.body);

    this.officialVideo = data.officialVideo;
    this.videoSeq = data.officialVideo.videoSeq;
    this.videoData.setTitle(data.title);
    this.videoData.setThumb(data.officialVideo.thumb);
    this.videoData.setCreatedAt(new Date(data.officialVideo.createdAt));

    return this;
  }

  public withCategory() {
    this.videoData.getCategory(this.officialVideo.title, this.officialVideo.badges);
  }

  public async getVideoKey() {
    const data = await needle('get', `https://www.vlive.tv/globalv-web/vam-web/video/v1.0/vod/${this.videoSeq}/inkey?appId=8c6cc7b45d2568fb668be6e05b6e5a3b&platformType=PC&gcc=KR&locale=en_US`, this.getPostOption()).then((res) => res.body);

    this.videoKey = data.inkey;

    return this;
  }

  private getDownloadableVideo(data: any) {
    const listVideos = data.videos.list;
    const highestSize = Math.max(...listVideos.map((v: any) => v.size));
    const highestQuality = listVideos.find((video: any) => video.size === highestSize);
    return highestQuality;
  }

  public async getVideoMetaData() {
    const data = await needle('get', `https://apis.naver.com/rmcnmv/rmcnmv/vod/play/v2.0/${this.officialVideo.vodId}?key=${this.videoKey}&videoId=${this.officialVideo.vodId}&cc=US`, this.getPostOption()).then((res) => res.body);

    const highestQuality = this.getDownloadableVideo(data);
    this.videoData.setDuration(highestQuality.duration);
    data.captions &&
      this.videoData.addCaptions(
        data.captions.list.map((caption: Caption) => ({
          language: caption.language,
          locale: caption.locale,
          label: caption.label,
          type: caption.type,
          source: caption.source,
          fanName: caption.fanName,
        }))
      );

    this.videoUrl = highestQuality.source;

    return this;
  }
}
