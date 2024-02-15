import React from 'react';
import { useReview } from '../components/Review/ReviewContext';
import { ReviewProvider } from '../components/Review/ReviewContext';
import { useParams, useHistory } from'react-router';
import { oneDrive, twoDrive } from '../assets/data/aotsfees';
import { IonCard, IonButton, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonThumbnail, IonItem, IonLabel } from '@ionic/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const ReviewContainer = ({}) => {
    const { driveThruSelection } = useReview();
    const selectedDriveThru = driveThruSelection === '1' ? oneDrive : twoDrive;
    const { images } = useReview();

    const storedImages = images || JSON.parse(localStorage.getItem('reviewImages') || '{}');

    const handleSubmit = () => {
        const pdf = new jsPDF();
        Object.entries(storedImages).forEach(([questionId, imageSrc], index) => {
            pdf.addImage(imageSrc, 'JPEG', 0, 0, 210, 297);
            
            if (index < Object.entries(storedImages).length - 1) {
                pdf.addPage();
            }
        });

        pdf.save('aotsfees.pdf');
    }

    const handleDownload = async () => {
        const pdf = new jsPDF();
        const tableColumn = ["Question", "Description", "Image"];
        const tableRows: any[] = [];

        const loadImage = async (src: string) => {
            return fetch(src)
                .then(res => res.blob())
                .then(blob => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });
                });
        };

        for (const item of selectedDriveThru) {
            for (const question of item.questions) {
                const questionId = `question_${item.questions.indexOf(question)}`;
                const imageSrc = storedImages[questionId] || images[questionId];
                let imageData = null;

                if (imageSrc) {
                    imageData = await loadImage(imageSrc);
                }

                tableRows.push({
                    questionTitle: question.questionTitle,
                    questionDesc: question.questionDesc,
                    imageData: imageData,
                });
            }
        }

        pdf.setFontSize(16);
        pdf.text("AOTS Fees Survey", 105, 15, { align: 'center' });

        autoTable(pdf, {
            head: [tableColumn],
            body: tableRows.map(row => [row.questionTitle, row.questionDesc]),
            startY: 25,
            didDrawCell: (data) => {
                if (data.section === 'body' && data.column.index === 2) {
                    const row = tableRows[data.row.index];
                    if (row.imageData) {
                        const imageX = data.cell.x + data.cell.width / 2 - 18.5;
                        const imageY = data.cell.y + 2;
                        const imageDim = Math.min(data.cell.width, data.cell.height) - 6 + Math.max(data.cell.width, data.cell.height) - 6;
                        pdf.addImage(row.imageData, 'JPEG', imageX, imageY, imageDim, imageDim);
                    }
                }
            },
            headStyles: {
                fontStyle: 'bold',
                textColor: [0, 0, 0],
                halign: 'center',
                valign:'middle',
                minCellHeight: 4,
                lineColor: [0, 0, 0],
                lineWidth: 0.1,
                fillColor: [255, 255, 255]
            },
            columnStyles: {
                0: { 
                    cellWidth: 70
                },
                1: { 
                    cellWidth: 70
                },
                2: { 
                    cellWidth: 'auto'
                },
            },
        });

        pdf.save('aotsfees.pdf');
    };
    
    return (
        <>
            {selectedDriveThru.map((item, index) => (
                item.questions.map((question, qIndex) => {
                    const questionId = `question_${qIndex}`;
                    const imageSrc = storedImages[questionId] || images[questionId];

                    if (imageSrc) {
                        return (
                            <IonCard key={questionId}>
                                <IonCardContent>
                                    <IonItem lines="none">
                                        <IonThumbnail slot="start">
                                            <img src={imageSrc} alt={`Captured image for ${question.questionTitle}`} />
                                        </IonThumbnail>
                                        <IonLabel>
                                            <h2>{question.questionTitle}</h2>
                                            <p>{question.questionDesc}</p>
                                        </IonLabel>
                                    </IonItem>
                                </IonCardContent>
                            </IonCard>
                        );
                    }
                    return null;
                })
            ))}
            <IonButton expand="block" color="dark" onClick={handleDownload}>
                Submit
            </IonButton>
        </>
    );
};