export type Episode = {
  id: string;
  episode: number;
  title: string;
  duration: string;
  audioUrl?: string;
};

export type Surah = {
  id: string;
  nameArabic: string;
  nameOromo: string;
  episodes: Episode[];
};

export const surahs: Surah[] = [
  {
    id: "faatiha",
    nameArabic: "الفاتحة",
    nameOromo: "Al-Faatiha",
    episodes: [
      {
        id: "faatiha-1",
        episode: 1,
        title: "Tafsiira Al-Faatiha",
        duration: "28:15",
      },
    ],
  },

  {
    id: "baqarah",
    nameArabic: "البقرة",
    nameOromo: "Al-Baqarah",
    episodes: [
      {
        id: "baqarah-1",
        episode: 1,
        title: "Tafsiira Al-Baqarah",
        duration: "42:10",
      },
      {
        id: "baqarah-2",
        episode: 2,
        title: "Tafsiira Al-Baqarah",
        duration: "39:24",
      },
      {
        id: "baqarah-3",
        episode: 3,
        title: "Tafsiira Al-Baqarah",
        duration: "45:12",
      },
    ],
  },

  {
    id: "ikhlas",
    nameArabic: "الإخلاص",
    nameOromo: "Al-Ikhlaas",
    episodes: [
      {
        id: "ikhlas-1",
        episode: 1,
        title: "Tafsiira Al-Ikhlaas",
        duration: "18:40",
      },
    ],
  },
];

export const recentEpisodes = [
  {
    id: "baqarah-3",
    surah: "Al-Baqarah",
    episode: 3,
    duration: "45:12",
  },
  {
    id: "baqarah-2",
    surah: "Al-Baqarah",
    episode: 2,
    duration: "39:24",
  },
  {
    id: "faatiha-1",
    surah: "Al-Faatiha",
    episode: 1,
    duration: "28:15",
  },
];