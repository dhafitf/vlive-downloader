import type { VideoDataType, Caption } from "./types/videoTypes";
import { normalizeArray, type RestOrArray } from "./utils/normalizeArray";

export class VideoData {
  public readonly data: VideoDataType;
  constructor(data: VideoDataType = { title: "", captions: [], createdAt: new Date(), duration: 0, thumbnail: "" }) {
    this.data = { ...data };
  }

  public setTitle(title: string) {
    this.data.title = title;
    return this;
  }

  public addCaptions(...captions: RestOrArray<Caption>) {
    captions = normalizeArray(captions);

    if (this.data.captions) this.data.captions.push(...captions);
    else this.data.captions = captions;
    return this;
  }

  public setCreatedAt(createdAt: Date) {
    this.data.createdAt = new Date(createdAt);
    return this;
  }

  public setDuration(duration: number) {
    this.data.duration = duration;
    return this;
  }

  public setThumb(thumb: string) {
    this.data.thumbnail = thumb;
    return this;
  }

  public getCategory(title: string, badges?: string[]) {
    switch (true) {
      case badges?.includes("SPECIAL_LIVE"):
        this.data.category = "Special";
        break;
      case /behind/i.test(title):
        this.data.category = "Behind";
        break;
      case /reality/i.test(title):
        this.data.category = "Reality Show";
        break;
      case /teaser/i.test(title):
        this.data.category = "Teaser";
        break;
      case /reaction/i.test(title):
        this.data.category = "Reaction";
        break;
      case /m\/v|music video|performace|choreography|4k/i.test(title):
        this.data.category = "Music";
        break;
      case /2wice/i.test(title):
        this.data.category = "2WICE's DATE";
        break;
      case /log|tv/i.test(title):
        this.data.category = "Vlog";
        break;
      case /happy|day|hbd/i.test(title):
        this.data.category = "Birthday";
        break;
      default:
        this.data.category = "Other";
        break;
    }

    return this;
  }
}
