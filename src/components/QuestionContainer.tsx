import { useState, useRef } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonText, IonItem, IonIcon, IonRadioGroup, IonRadio, IonLabel, IonButton, IonModal, IonContent } from '@ionic/react';
import { AccordionContainer } from './AccordionContainer';
import { oneDrive, twoDrive } from '../assets/data/aotsfees';

export const QuestionContainer = ({ driveThruSelection }: { driveThruSelection: string }) => {

    const selectedDriveThru = driveThruSelection === '1' ? oneDrive : twoDrive;

    return (
        <>
            {selectedDriveThru.map((item, index) => {
                return item.questions.map((question, qIndex) => (
                    <div key={`label_${index}_${qIndex}`}>
                        <IonLabel>
                            <h2>{question.questionTitle}</h2>
                            <p>{question.questionDesc}</p>
                        </IonLabel>
                        <div>
                            <div key={`question_${index}`}>
                                <p>{question.question}</p>
                            </div>
                            {question.questionHints && question.questionHints.length > 0 && (
                                <ol>
                                    {question.questionHints.map((hint, hintIndex) => (
                                        <li key={`hint_${hintIndex}`}>
                                            {hint.hint}
                                        </li>
                                    ))}
                                </ol>
                            )}
                            <AccordionContainer question={question} />
                        </div>
                    </div>
                ))
            })}
        </>
    );
}
