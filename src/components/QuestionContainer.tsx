import { useState, useRef } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonText, IonItem, IonIcon, IonRadioGroup, IonRadio, IonLabel, IonButton, IonModal, IonContent } from '@ionic/react';
import { car } from 'ionicons/icons';
import { AccordionContainer } from './AccordionContainer';
import { oneDrive, twoDrive } from '../assets/data/aotsfees';

export const QuestionContainer = () => {
    const [driveThruSelection, setDriveThruSelection] = useState('1');
    
    const handleDriveThruSelection = (event: CustomEvent) => {
        setDriveThruSelection(event.detail.value);
    };

    const selectedDriveThru = driveThruSelection === '1' ? oneDrive : twoDrive;

    return (
        <>
            <SurveyModal />
            <IonRadioGroup value={driveThruSelection} onIonChange={handleDriveThruSelection}>
                <div className="radio-group">
                    <IonRadio value="1" justify="start" labelPlacement="end" aria-label="Custom checkbox">
                        1 Drive Thru
                    </IonRadio>
                    <IonRadio value="2" justify="start" labelPlacement="end" aria-label="Custom checkbox checked">
                        2 Drive Thrus
                    </IonRadio>
                </div>
            </IonRadioGroup>
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

export const SurveyModal = () => {
    const modal = useRef<HTMLIonModalElement>(null);
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState(0);
    
    return (
        <>
            <IonButton id="open-modal" expand="block">
                Open Modal
            </IonButton>
            <IonModal ref={modal} trigger="open-modal" initialBreakpoint={1} breakpoints={[0, 1]}>
                <IonToolbar>
                    <IonTitle className="modal__title">Drive Thur Options</IonTitle>
                </IonToolbar>
                <div className="block">
                    <div className="modal__body">
                    <div className="modal__body__options">
                        <button className={`modal__body__option ${selected === 0 ? 'selected' : ''}`} onClick={() => {
                            setSelected(0);
                            setShowModal(false);
                        }}>
                            <div className={`modal__body__option__text ${selected === 0 ? 'selected' : ''}`} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <IonIcon icon={car} size="large" />
                                <span>1 Drive Thru</span>
                            </div>
                        </button>
                        <button className={`modal__body__option ${selected === 1 ? 'selected' : ''}`} onClick={() => {
                            setSelected(1);
                            setShowModal(false);
                        }}>
                            <div className={`modal__body__option__text ${selected === 1 ? 'selected' : ''}`} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                               <IonIcon icon={car} size="large" />
                                <span>2 Drive Thrus</span>
                            </div>
                        </button>
                    </div>
                    <IonButton color="dark" expand="block" onClick={() => setShowModal(false)}>Start Survey</IonButton>
                    </div>
                </div>
            </IonModal>
        </>
    );
}