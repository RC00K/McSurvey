import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useReview } from "../components/Review/ReviewContext";
import { oneDrive, twoDrive } from "../assets/data/aotsfees";
import { image } from "ionicons/icons";

export const ReviewContainer = () => {
  const { driveThruSelection, images, storeNumber } = useReview();
  const selectedDriveThru = driveThruSelection === "1" ? oneDrive : twoDrive;
  const storedImages = images || JSON.parse(localStorage.getItem("reviewImages") || "{}");

  return (
    <>
      <label className="text__input__label">
        <h2>Store Number</h2>
        {storeNumber}
      </label>
      {selectedDriveThru.map((item, index) => item.questions.map((question, qIndex) => {
          const questionId = `question_${qIndex}`;
          const imageSrc = storedImages[questionId] || images[questionId];
          return imageSrc ? (
            <article key={`question_${index}_${qIndex}`} className="review__card">
              <div key={questionId} className="review__card__image">
                <img src={imageSrc} alt="Captured Image" />
              </div>
              <div className="review__card__content">
                <h2>{question.questionTitle}</h2>
                <p>{question.questionDesc}</p>
                <p>
                  {/* take the first letter of the words in question and return them as an abbreviation */}
                  {question.questionTitle.split(" ").map((word) => word[0]).join("")} - {questionId}
                </p>
              </div>
            </article>
          ) : null;
        }))}
    </>
  );
};
