import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BirthdayData, initialData, submitToGoogleSheets } from "@/lib/birthdayData";
import WelcomeScreen from "@/components/birthday/WelcomeScreen";
import NostalgiaQuiz from "@/components/birthday/NostalgiaQuiz";
import PillowFight from "@/components/birthday/PillowFight";
import ScoreReveal from "@/components/birthday/ScoreReveal";
import SelfReflection from "@/components/birthday/SelfReflection";
import ThailandStory from "@/components/birthday/ThailandStory";
import SpeedUno from "@/components/birthday/SpeedUno";
import PhotoUpload from "@/components/birthday/PhotoUpload";
import ImageCommentary from "@/components/birthday/ImageCommentary";
import PolaroidSelection from "@/components/birthday/PolaroidSelection";
import AmazonDelivery from "@/components/birthday/AmazonDelivery";
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
      <PillowFight
        onNext={(score) => {
          setData((d) => ({ ...d, pillowScore: score }));
          next();
        }}
      />
    ),
    3: <ScoreReveal score={data.pillowScore} onNext={next} />,
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
      <F1Racer
        onNext={(score) => {
          setData((d) => ({ ...d, f1Score: score }));
          next();
        }}
      />
    ),
    12: <BirthdayWish onNext={next} />,
    13: <SalaryPromise />,
  };

  // Submit data on final step
  if (step === 13) {
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
