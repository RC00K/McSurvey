import React from 'react';

export const ReviewContainer = ({ selectedDriveThru, selectedImages }: { selectedDriveThru: any, selectedImages: any }) => {
    return (
        <div>
            <h1>Review</h1>
            {selectedDriveThru.map((item: any, index: number) => {
                return item.questions.map((question: any, qIndex: number) => (
                    <div key={`review_${index}_${qIndex}`}>
                        <h2>{question.questionTitle}</h2>
                        <p>{question.questionDesc}</p>
                        <p>Question: {question.question}</p>
                        {question.questionHints && question.questionHints.length > 0 && (
                            <ul>
                                {question.questionHints.map((hint: any, hintIndex: number) => (
                                    <li key={`hint_${hintIndex}`}>{hint.hint}</li>
                                ))}
                            </ul>
                        )}
                        {selectedImages[qIndex] && (
                            <img
                                src={selectedImages[qIndex]}
                                alt={`Uploaded ${question.questionTitle} Image`}
                            />
                        )}
                    </div>
                ));
            })}
        </div>
    );
}