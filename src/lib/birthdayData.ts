export interface BirthdayData {
  name: string;
  quizAnswers: string[];
  pillowScore: number;
  goals: string[];
  thailandStory: string;
  unoScore: number;
  uploadedPhoto: string | null;
  imageComments: string[];
  selectedPolaroids: number[];
  f1Score: number;
}

export const initialData: BirthdayData = {
  name: "",
  quizAnswers: ["", "", "", "", ""],
  pillowScore: 0,
  goals: ["", "", "", "", ""],
  thailandStory: "",
  unoScore: 0,
  uploadedPhoto: null,
  imageComments: Array(10).fill(""),
  selectedPolaroids: [],
  f1Score: 0,
};

export const quizQuestions = [
  "What's the funniest thing we did together as kids?",
  "What's the one dish I make that you secretly love?",
  "What's our most embarrassing family moment?",
  "What nickname did I have for you growing up?",
  "What's the one trip we took together that you'll never forget?",
];

export const goalQuestions = [
  "Where do you see yourself in 5 years?",
  "What's the one skill you want to master this year?",
  "What's your biggest dream that you haven't told anyone?",
  "What would you do if you had unlimited money for one day?",
  "What's one thing you want to change about your daily routine?",
];

export async function submitToGoogleSheets(data: BirthdayData): Promise<void> {
  const WEBHOOK_URL = "YOUR_GOOGLE_SHEETS_WEBHOOK_URL";

  const payload = {
    name: data.name,
    quizAnswers: data.quizAnswers,
    pillowScore: data.pillowScore,
    goals: data.goals,
    thailandStory: data.thailandStory,
    unoScore: data.unoScore,
    imageComments: data.imageComments,
    selectedPolaroids: data.selectedPolaroids,
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
