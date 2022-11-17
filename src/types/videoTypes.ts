export type Caption = {
  language: string;
  locale: string;
  label: string;
  type: string;
  source: string;
  fanName?: string;
};

export type VideoDataType = {
  title: string;
  captions: Caption[];
  createdAt: Date;
  duration: number;
  thumbnail: string;
  category?: string;
};
