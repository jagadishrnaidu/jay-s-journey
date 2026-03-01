export interface BirthdayData {
  name: string;
  quizAnswers: string[];
  hangarooScore: number;
  goals: string[];
  thailandStory: string;
  unoScore: number;
  uploadedPhoto: string | null;
  imageComments: string[];
  selectedPolaroids: number[];
  jigsawCompleted: boolean;
  f1Score: number;
}

export const initialData: BirthdayData = {
  name: "",
  quizAnswers: ["", "", "", "", ""],
  hangarooScore: 0,
  goals: ["", "", "", "", ""],
  thailandStory: "",
  unoScore: 0,
  uploadedPhoto: null,
  imageComments: Array(10).fill(""),
  selectedPolaroids: [],
  jigsawCompleted: false,
  f1Score: 0,
};

export const quizQuestions = [
  "What's the secret code word only we both understand? 🤫",
  "Which Bollywood movie reminds you most of our childhood fights? 🎬",
  "What's the most ridiculous dare I ever gave you? 😂",
  "If we had a YouTube channel together, what would it be called? 📺",
  "What's the one thing about India you miss the most while in UK? 🇮🇳",
];

export const goalQuestions = [
  "Where do you see yourself in 5 years?",
  "What's the one skill you want to master this year?",
  "What's your biggest dream that you haven't told anyone?",
  "What would you do if you had unlimited money for one day?",
  "What's one thing you want to change about your daily routine?",
];

export const hangarooWords = [
  "BIRTHDAY",
  "BROTHER",
  "CELEBRATION",
  "SURPRISE",
  "GOLU",
  "TRIZON",
  "INDIA",
  "FAMILY",
];

export async function submitToGoogleSheets(data: BirthdayData): Promise<void> {
  const WEBHOOK_URL = "YOUR_GOOGLE_SHEETS_WEBHOOK_URL";

  const payload = {
    name: data.name,
    quizAnswers: data.quizAnswers,
    hangarooScore: data.hangarooScore,
    goals: data.goals,
    thailandStory: data.thailandStory,
    unoScore: data.unoScore,
    imageComments: data.imageComments,
    selectedPolaroids: data.selectedPolaroids,
    jigsawCompleted: data.jigsawCompleted,
    f1Score: data.f1Score,
    submittedAt: new Date().toISOString(),
  };

  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.log("Google Sheets submission placeholder - configure webhook URL");
  }
}
