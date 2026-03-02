export interface BirthdayData {
  name: string;
  quizAnswers: string[];
  hangarooScore: number;
  goals: string[];
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
  unoScore: 0,
  uploadedPhoto: null,
  imageComments: Array(10).fill(""),
  selectedPolaroids: [],
  jigsawCompleted: false,
  f1Score: 0,
};

export const quizQuestions = [
  "What's the one thing you bought recently that you're hiding from the rest of the family? 🤫",
  "What's the most 'illegal' thing you did in your life that our parents still don't know about? 😈",
  "If we were in a zombie apocalypse, which one of our relatives would you sacrifice first to save yourself? 🧟",
  "What's a goal you want to achieve before your next birthday? 🎯",
  "If you had to move to a different country tomorrow, which one would it be and what would your new 'fake identity' be? 🕵️",
];

export const goalQuestions = [
  "If you could mass-text every ex something anonymously, what would you send? 💀",
  "What's the dumbest thing you've Googled in the last month? Be honest! 🤡",
  "If you were a reality TV show contestant, which show would you absolutely dominate and why? 📺",
  "What's one thing you pretend to be good at but secretly suck at? 😂",
  "If you had to survive on only one food for a year, what would it be and would you still love it? 🍔",
];

export const hangarooWords = [
  "MANGO STICKY RICE",
  "RATAN KI KACHODI",
  "ALOO TIKIYA",
  "KADHI",
];

export async function submitToGoogleSheets(data: BirthdayData): Promise<void> {
  const WEBHOOK_URL = "YOUR_GOOGLE_SHEETS_WEBHOOK_URL";

  const payload = {
    name: data.name,
    quizAnswers: data.quizAnswers,
    hangarooScore: data.hangarooScore,
    goals: data.goals,
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
