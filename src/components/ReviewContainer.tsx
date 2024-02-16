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
        const tableColumn = ["Question", "Image"];
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

        autoTable(pdf, {
            body: [
                [
                    {
                        content: 'SDI',
                        styles: {
                            halign: 'left',
                            fontSize: 20,
                            textColor: '#ffffff',
                        }
                    },
                    {
                        content: 'AOTS Fees Survey',
                        styles: {
                            halign: 'right',
                            fontSize: 20,
                            textColor: '#ffffff',
                        }
                    }
                ]
            ],
            theme: 'plain',
            styles: {
                fillColor: '#2C2686',
            }
        });

        autoTable(pdf, {
            body: [
                [
                    {
                        content: 'Reference: #AFS0001'
                        +'\nDate: 2020-03-12'
                        +'\nSurvey number: 123456789',
                        styles: {
                            halign: 'right'
                        }
                    }
                ],
            ],
            theme: 'plain',
        });

        autoTable(pdf, {
            body: [
                [
                    {
                        content: 'Submitted by:'
                        +'\n<NAME>'
                        +'\n<EMAIL>'
                        +'\n07987654321',
                        styles: {
                            halign: 'left'
                        }
                    },
                    {
                        content: 'Store Number:'
                        +'\n123456789'
                    },
                    {
                        content: 'From:'
                        +'\nMid-America Point Of Sale'
                        +'\n15 N Adams St'
                        +'\nHutchinson, Kansas 67501'
                        +'\nUnited States',
                        styles: {
                            halign: 'right'
                        }
                    }
                ],
            ],
            theme: 'plain',
        });

        autoTable(pdf, {
            body: [
                [
                    {
                        content: 'Products & Services',
                        styles: {
                            halign: 'left',
                            fontSize: 14
                        }
                    }
                ],
            ],
            theme: 'plain',
        });

        autoTable(pdf, {
            head: [tableColumn],
            body: tableRows.map(row => [
                row.questionTitle 
                + '\n' + row.questionDesc
            ]),
            startY: 100,
            didDrawCell: (data) => {
                if (data.section === 'body' && data.column.index === 1) {
                    const row = tableRows[data.row.index];
                    if (row.imageData) {
                        const imageX = data.cell.x + data.cell.width / 2 - 1.5;
                        const imageY = data.cell.y + data.cell.height / 2 - 10.5;
                        const imageDim = Math.min(data.cell.width, data.cell.height) - 90 + Math.max(data.cell.width, data.cell.height) - 20;
                        pdf.addImage(row.imageData, 'JPEG', imageX, imageY, imageDim, imageDim);
                    }
                }
            },
            headStyles: {
                fillColor: '#343a40',
                minCellHeight: 0,
            },
            columnStyles: {
                0: { 
                    cellWidth: 80,
                    cellPadding: 10,
                    minCellHeight: 20,
                },
                1: { 
                    cellWidth: 'auto',
                    cellPadding: 10,
                    minCellHeight: 20,
                },
            },
            styles: {
                minCellHeight: 20,
            }
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