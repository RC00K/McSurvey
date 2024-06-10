import React, { useEffect, useState } from "react";
import { useSurvey } from "../assets/context/SurveyContext";

const Completed: React.FC = () => {
  const { reset } = useSurvey();
  const [isSurveyComplete, setIsSurveyComplete] = useState(false);

  useEffect(() => {
    const surveyDataFromStorage = localStorage.getItem("surveyData");
    if (surveyDataFromStorage) {
      const data = JSON.parse(surveyDataFromStorage);
      setIsSurveyComplete(data.isComplete);
    }
  });

  return (
    <>
      <div className="survey-container">
        <h1>Survey Completed</h1>
        <p>Thank you for completing the survey!</p>
        <button onClick={reset}>Start Over</button>
      </div>
    </>
  );
};

export default Completed;
