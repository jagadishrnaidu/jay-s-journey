import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BirthdayData, initialData, submitToGoogleSheets } from "@/lib/birthdayData";
import WelcomeScreen from "@/components/birthday/WelcomeScreen";
import NostalgiaQuiz from "@/components/birthday/NostalgiaQuiz";
import Hangaroo from "@/components/birthday/Hangaroo";
import ScoreReveal from "@/components/birthday/ScoreReveal";
import SelfReflection from "@/components/birthday/SelfReflection";
import ThailandStory from "@/components/birthday/ThailandStory";
import SpeedUno from "@/components/birthday/SpeedUno";
import PhotoUpload from "@/components/birthday/PhotoUpload";
import ImageCommentary from "@/components/birthday/ImageCommentary";
import PolaroidSelection from "@/components/birthday/PolaroidSelection";
import AmazonDelivery from "@/components/birthday/AmazonDelivery";
import JigsawPuzzle from "@/components/birthday/JigsawPuzzle";
import F1Racer from "@/components/birthday/F1Racer";
import BirthdayWish from "@/components/birthday/BirthdayWish";
import SalaryPromise from "@/components/birthday/SalaryPromise";

const Index = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<BirthdayData>(initialData);

  const next = useCallback(() => setStep((s) => s + 1), []);

  const screens: Record<number, React.ReactNode> = {
    0: (
      <WelcomeScreen
        onNext={(name) => {
          setData((d) => ({ ...d, name }));
          next();
        }}
      />
    ),
    1: (
      <NostalgiaQuiz
        onNext={(answers) => {
          setData((d) => ({ ...d, quizAnswers: answers }));
          next();
        }}
      />
    ),
    2: (
      <Hangaroo
        onNext={(score) => {
          setData((d) => ({ ...d, hangarooScore: score }));
          next();
        }}
      />
    ),
    3: <ScoreReveal score={data.hangarooScore} onNext={next} />,
    4: (
      <SelfReflection
        onNext={(goals) => {
          setData((d) => ({ ...d, goals }));
          next();
        }}
      />
    ),
    5: (
      <ThailandStory
        onNext={(story) => {
          setData((d) => ({ ...d, thailandStory: story }));
          next();
        }}
      />
    ),
    6: (
      <SpeedUno
        onNext={(score) => {
          setData((d) => ({ ...d, unoScore: score }));
          next();
        }}
      />
    ),
    7: (
      <PhotoUpload
        onNext={(photo) => {
          setData((d) => ({ ...d, uploadedPhoto: photo }));
          next();
        }}
      />
    ),
    8: (
      <ImageCommentary
        onNext={(comments) => {
          setData((d) => ({ ...d, imageComments: comments }));
          next();
        }}
      />
    ),
    9: (
      <PolaroidSelection
        comments={data.imageComments}
        onNext={(selected) => {
          setData((d) => ({ ...d, selectedPolaroids: selected }));
          next();
        }}
      />
    ),
    10: <AmazonDelivery onNext={next} />,
    11: (
      <JigsawPuzzle
        onNext={() => {
          setData((d) => ({ ...d, jigsawCompleted: true }));
          next();
        }}
      />
    ),
    12: (
      <F1Racer
        onNext={(score) => {
          setData((d) => ({ ...d, f1Score: score }));
          next();
        }}
      />
    ),
    13: <BirthdayWish onNext={next} />,
    14: <SalaryPromise />,
  };

  // Submit data on final step
  if (step === 14) {
    submitToGoogleSheets(data);
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {screens[step]}
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
