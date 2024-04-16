import { useEffect, useState } from "react";
import { useReview } from "../components/Review/ReviewContext";
import { oneDrive, twoDrive } from "../assets/data/aotsfees";
import {
  IonList,
  IonButton,
  IonThumbnail,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const ReviewContainer = ({}) => {
  const { driveThruSelection } = useReview();
  const selectedDriveThru = driveThruSelection === "1" ? oneDrive : twoDrive;
  const { images } = useReview();

  const storedImages =
    images || JSON.parse(localStorage.getItem("reviewImages") || "{}");

  const { storeNumber } = useReview();

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Buffer and Progress
  const [buffer, setBuffer] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBuffer((prevBuffer) => prevBuffer + 0.06);
      setProgress((prevProgress) => prevProgress + 0.06);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    setProgress(0);
    const pdf = new jsPDF();
    const totalTasks = 5;
    let completedTasks = 0;

    if (isGeneratingPDF) {
      const tableColumn = ["Question", "Image"];
      const tableRows: any[] = [];

      const loadImage = async (src: string) => {
        return fetch(src)
          .then((res) => res.blob())
          .then((blob) => {
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
            completedTasks++;
            setProgress((completedTasks / totalTasks) * 100);
            console.log("Image loaded progress: ", progress);
          }

          tableRows.push({
            questionTitle: question.questionTitle,
            questionDesc: question.questionDesc,
            imageData: imageData,
          });
        }
        completedTasks++;
        setProgress((completedTasks / totalTasks) * 100);
      }

      autoTable(pdf, {
        body: [
          [
            {
              content: "SDI",
              styles: {
                halign: "left",
                fontSize: 20,
                textColor: "#ffffff",
              },
            },
            {
              content: "AOTS Fees Survey",
              styles: {
                halign: "right",
                fontSize: 20,
                textColor: "#ffffff",
              },
            },
          ],
        ],
        theme: "plain",
        styles: {
          fillColor: "#2C2686",
        },
      });

      autoTable(pdf, {
        body: [
          [
            {
              content:
                "Reference: #AFS0001" +
                "\nDate: 2020-03-12" +
                "\nSurvey number: 123456789",
              styles: {
                halign: "right",
              },
            },
          ],
        ],
        theme: "plain",
      });

      autoTable(pdf, {
        body: [
          [
            {
              content:
                "Submitted by:" + "\n<NAME>" + "\n<EMAIL>" + "\n07987654321",
              styles: {
                halign: "left",
              },
            },
            {
              content: "Store Number:" + "\n" + storeNumber,
            },
            {
              content:
                "From:" +
                "\nMid-America Point Of Sale" +
                "\n15 N Adams St" +
                "\nHutchinson, Kansas 67501" +
                "\nUnited States",
              styles: {
                halign: "right",
              },
            },
          ],
        ],
        theme: "plain",
      });

      autoTable(pdf, {
        body: [
          [
            {
              content: "Products & Services",
              styles: {
                halign: "left",
                fontSize: 14,
              },
            },
          ],
        ],
        theme: "plain",
      });

      autoTable(pdf, {
        head: [tableColumn],
        body: tableRows.map((row) => [
          row.questionTitle + "\n" + row.questionDesc,
        ]),
        startY: 100,
        didDrawCell: (data) => {
          if (data.section === "body" && data.column.index === 1) {
            const row = tableRows[data.row.index];
            if (row.imageData) {
              const imageX = data.cell.x + data.cell.width / 2 - 1.5;
              const imageY = data.cell.y + data.cell.height / 2 - 10.5;
              const imageDim =
                Math.min(data.cell.width, data.cell.height) -
                90 +
                Math.max(data.cell.width, data.cell.height) -
                20;
              pdf.addImage(
                row.imageData,
                "JPEG",
                imageX,
                imageY,
                imageDim,
                imageDim
              );
            }
          }
        },
        headStyles: {
          fillColor: "#343a40",
          minCellHeight: 0,
        },
        columnStyles: {
          0: {
            cellWidth: 80,
            cellPadding: 10,
            minCellHeight: 20,
          },
          1: {
            cellWidth: "auto",
            cellPadding: 10,
            minCellHeight: 20,
          },
        },
        styles: {
          minCellHeight: 20,
        },
      });
    }
    setIsGeneratingPDF(false);
    return pdf.output("datauristring");
  };

  const handleSendEmail = async () => {
    const pdfBase64 = await generatePDF();
    const content = pdfBase64.split("base64,")[1];
    const emails = ["ryder.cook@gomaps.com"];
    const emailSubject = `AOTS Fees Survey for ${storeNumber}`;
    const emailMessage = `${storeNumber}`;
    const emailAttachments = [
      {
        filename: "aotsfees.pdf",
        content: content,
        contentType: "application/pdf",
        encoding: "base64",
      },
    ];

    const emailData = {
      email: emails.join(","),
      // Survey from store number
      subject: emailSubject,
      // Get and attach zip
      text: emailMessage,
      attachments: emailAttachments,
    };

    const xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const emailProgress = Math.round((event.loaded / event.total) * 100);
        setProgress(50 + emailProgress / 2);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 200) {
        setEmailSent(true);
      } else {
        console.error("Email sending failed: ", xhr.statusText);
        // Handle error
        setEmailSent(false);
        alert("Email Failed to Send");
      }
    });
    xhr.open("POST", "http://localhost:3001/send");
    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(emailData));
    return emailSent;
  };

  const handleGeneratePDF = (event: any) => {
    generatePDF();
    event.preventDefault();
    handleSendEmail();
    setProgress(100);
    setTimeout(() => {
      setProgress(0);
    }, 2000);
  };

  const handleDownload = async () => {
    const pdf = new jsPDF();
    const tableColumn = ["Question", "Image"];
    const tableRows: any[] = [];

    const loadImage = async (src: string) => {
      return fetch(src)
        .then((res) => res.blob())
        .then((blob) => {
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
            content: "SDI",
            styles: {
              halign: "left",
              fontSize: 20,
              textColor: "#ffffff",
            },
          },
          {
            content: "AOTS Fees Survey",
            styles: {
              halign: "right",
              fontSize: 20,
              textColor: "#ffffff",
            },
          },
        ],
      ],
      theme: "plain",
      styles: {
        fillColor: "#2C2686",
      },
    });

    autoTable(pdf, {
      body: [
        [
          {
            content:
              "Reference: #AFS0001" +
              "\nDate: 2020-03-12" +
              "\nSurvey number: 123456789",
            styles: {
              halign: "right",
            },
          },
        ],
      ],
      theme: "plain",
    });

    autoTable(pdf, {
      body: [
        [
          {
            content:
              "Submitted by:" + "\n<NAME>" + "\n<EMAIL>" + "\n07987654321",
            styles: {
              halign: "left",
            },
          },
          {
            content: "Store Number:" + "\n" + storeNumber,
          },
          {
            content:
              "From:" +
              "\nMid-America Point Of Sale" +
              "\n15 N Adams St" +
              "\nHutchinson, Kansas 67501" +
              "\nUnited States",
            styles: {
              halign: "right",
            },
          },
        ],
      ],
      theme: "plain",
    });

    autoTable(pdf, {
      body: [
        [
          {
            content: "Products & Services",
            styles: {
              halign: "left",
              fontSize: 14,
            },
          },
        ],
      ],
      theme: "plain",
    });

    autoTable(pdf, {
      head: [tableColumn],
      body: tableRows.map((row) => [
        row.questionTitle + "\n" + row.questionDesc,
      ]),
      startY: 100,
      didDrawCell: (data) => {
        if (data.section === "body" && data.column.index === 1) {
          const row = tableRows[data.row.index];
          if (row.imageData) {
            const imageX = data.cell.x + data.cell.width / 2 - 1.5;
            const imageY = data.cell.y + data.cell.height / 2 - 10.5;
            const imageDim =
              Math.min(data.cell.width, data.cell.height) -
              90 +
              Math.max(data.cell.width, data.cell.height) -
              20;
            pdf.addImage(
              row.imageData,
              "JPEG",
              imageX,
              imageY,
              imageDim,
              imageDim
            );
          }
        }
      },
      headStyles: {
        fillColor: "#343a40",
        minCellHeight: 0,
      },
      columnStyles: {
        0: {
          cellWidth: 80,
          cellPadding: 10,
          minCellHeight: 20,
        },
        1: {
          cellWidth: "auto",
          cellPadding: 10,
          minCellHeight: 20,
        },
      },
      styles: {
        minCellHeight: 20,
      },
    });

    pdf.save("aotsfees.pdf");
  };

  return (
    <>
      <div className="review__container">
        {selectedDriveThru.map((item, index) =>
          item.questions.map((question, qIndex) => {
            const questionId = `question_${qIndex}`;
            const imageSrc = storedImages[questionId] || images[questionId];

            if (imageSrc) {
              return (
                <IonList key={questionId}>
                  <IonItem lines="full">
                    <IonItem lines="none">
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            <IonThumbnail>
                              <img
                                src={imageSrc}
                                alt={`Captured image for ${question.questionTitle}`}
                              />
                            </IonThumbnail>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonItem>
                    <IonLabel>
                      <h2>{question.questionTitle}</h2>
                      <p>{question.questionDesc}</p>
                    </IonLabel>
                  </IonItem>
                </IonList>
              );
            }
            return null;
          })
        )}
        {/* On Button Click generate pdf then send to email */}
        <IonButton expand="block" color="dark" onClick={handleGeneratePDF}>
          Submit
        </IonButton>
      </div>
    </>
  );
};
