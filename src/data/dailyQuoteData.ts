export interface DailyQuote {
  id: number;
  quote: string;
  source: string;
  imageUrl: string;
}

export const dailyQuoteData: DailyQuote[] = [
  {
    id: 1,
    quote: "Dan (ingatlah), sesiapa yang bertakwa kepada Allah, nescaya Allah akan mengadakan baginya jalan keluar (dari segala perkara yang menyusahkannya).",
    source: "Surah At-Talaq, Ayat 2",
    imageUrl: "/placeholder.svg?height=400&width=600&query=mosque-sunset",
  },
  {
    id: 2,
    quote: "Janganlah kamu bersikap lemah, dan janganlah pula kamu bersedih hati, padahal kamulah orang-orang yang paling tinggi darjatnya, jika kamu orang-orang yang beriman.",
    source: "Surah Ali 'Imran, Ayat 139",
    imageUrl: "/placeholder.svg?height=400&width=600&query=mountain-dawn",
  },
  {
    id: 3,
    quote: "Sesungguhnya sesudah kesulitan itu ada kemudahan.",
    source: "Surah Ash-Sharh, Ayat 6",
    imageUrl: "/placeholder.svg?height=400&width=600&query=path-through-forest",
  },
  {
    id: 4,
    quote: "Dunia adalah penjara bagi orang beriman dan syurga bagi orang kafir.",
    source: "Hadith Riwayat Muslim",
    imageUrl: "/placeholder.svg?height=400&width=600&query=open-window-view",
  },
  {
    id: 5,
    quote: "Barangsiapa yang menempuh satu jalan untuk menuntut ilmu, maka Allah akan memudahkan baginya jalan ke syurga.",
    source: "Hadith Riwayat Muslim",
    imageUrl: "/placeholder.svg?height=400&width=600&query=reading-quran",
  },
];