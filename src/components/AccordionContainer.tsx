import { IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonList, IonImg } from '@ionic/react';
import './AccordionContainer.css';

interface Question {
    question: string;
    questionHints?: {
        hint: string;
    }[];
    questionImages: {
        image: string;
        imageAlt: string;
    }[];
}


export const AccordionContainer = ({ question }: { question: Question}) => {
    return (
        <IonAccordionGroup>
            <IonAccordion value={question.question}>
                <IonItem slot="header">
                    <IonLabel>Examples</IonLabel>
                </IonItem>
                <IonList slot="content">
                    {question.questionImages.map((image, imgIndex) => (
                        <IonItem key={`image_${imgIndex}`}>
                            <IonImg src={image.image} alt={image.imageAlt} />
                        </IonItem>
                    ))}
                </IonList>
            </IonAccordion>
        </IonAccordionGroup>
    );
}