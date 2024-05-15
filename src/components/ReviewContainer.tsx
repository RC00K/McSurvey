import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useReview } from "../components/Review/ReviewContext";
import { oneDrive, twoDrive } from "../assets/data/aotsfees";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { IonIcon, IonLabel } from "@ionic/react";
import { pencil } from "ionicons/icons";
import "./ReviewContainer.css";

export const ReviewContainer = () => {
  const { driveThruSelection, images, storeNumber } = useReview();
  const selectedDriveThru = driveThruSelection === "1" ? oneDrive : twoDrive;
  const storedImages = images || JSON.parse(localStorage.getItem("reviewImages") || "{}");
  const history = useHistory();

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    const pdf = new jsPDF();

    const loadImage = async (src: string) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = src;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob!);
          }, "image/jpeg", 0.8);
        };
        img.onerror = reject;
      });
    };

    const tableColumn = ["Question", "Image"];
    const tableRows = await Promise.all(selectedDriveThru.flatMap(item => 
      item.questions.map(async (question) => {
        const questionId = `question_${item.questions.indexOf(question)}`;
        const imageSrc = storedImages[questionId] || images[questionId];
        let imageData = null;
        if (imageSrc) {
          imageData = await loadImage(imageSrc);
        }

        return {
          questionTitle: question.questionTitle,
          questionDesc: question.questionDesc,
          imageData: imageData,
        };
      })
    ));

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
              "Date:" + new Date().toLocaleDateString() + "\n" +
              "Store Number:" + storeNumber,
            styles: {
              halign: "left",
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
            content: "Survey Information",
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
      body: tableRows.map(row => [row.questionTitle + "\n" + row.questionDesc]),
      startY: 100,
      didDrawCell: (data) => {
        if (data.section === "body" && data.column.index === 1) {
          const row = tableRows[data.row.index];
          if (row.imageData) {
            const imageX = data.cell.x + data.cell.width / 2 - 1.5;
            const imageY = data.cell.y + data.cell.height / 2 - 10.5;
            const imageDim = 
              Math.min(data.cell.width, data.cell.height) - 90 +
              Math.max(data.cell.width, data.cell.height) - 20;
            pdf.addImage(row.imageData as string, "JPEG", imageX, imageY, imageDim, imageDim);
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

    setIsGeneratingPDF(false);
    return pdf.output("blob");
  };

  const handleSendEmail = async (event: any) => {
    event.preventDefault();
    setShowLoading(true);
    try {
      const pdfBlob = await generatePDF();
      const formData = new FormData();
      formData.append("file", pdfBlob, "aotsfees.pdf");
      formData.append("email", "ryder.cook@gomaps.com");
      formData.append("subject", "AOTS Fees Review");
      formData.append("text", "Attached is a PDF of your AOTS Fees review. Please review and provide feedback. Thank you!");

      const response = await fetch("http://localhost:3001/send", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        setEmailSent(true);
        setShowToast(true);
        setShowLoading(false);
        console.log("Email sent successfully");
      } else {
        throw new Error(responseData.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Email sending failed", error);
      setEmailSent(false);
      setShowToast(true);
      setShowLoading(false);
    }
  };

  const handleGeneratePDF = (event: any) => {
    event.preventDefault();
    handleSendEmail(event);
  }

  const navigateToHome = () => {
    history.push("/");
  };

  const handleEditResponse = (questionIndex: number) => {
    history.push(`/camera/${questionIndex}#question_${questionIndex}`);
  };

  useEffect(() => {
    if (emailSent) {
      setTimeout(() => {
        navigateToHome();
      }, 5000);
    }
  }, [emailSent]);

  return (
    // <>
    //     {selectedDriveThru.map((item, index) => item.questions.map((question, qIndex) => {
    //       const questionId = `question_${qIndex}`;
    //       const imageSrc = storedImages[questionId] || images[questionId];
    //       return imageSrc ? (
    //         <div className="item" key={questionId}>
    //           <div className="image">
    //             <img src={imageSrc} alt="Capture Image" />
    //           </div>
    //           <div className="description">
    //             <span>{question.questionTitle}</span>
    //             <span>{question.questionDesc}</span>
    //           </div>
    //         </div>
    //       ) : null;
    //     }))}
    //   {showLoading && <div className="loading">Sending email...</div>}
    //   {showToast && <div className={`toast ${emailSent ? "success" : "error"}`}>{emailSent ? "Email sent successfully!" : "Failed to send email"}</div>}
    // </>
    <>
      <label className="text__input__label">
        <h2>Store Number</h2>
      </label>
      {selectedDriveThru.map((item, index) => item.questions.map((question, qIndex) => {
          const questionId = `question_${qIndex}`;
          const imageSrc = storedImages[questionId] || images[questionId];
          return imageSrc ? (
            <div key={`question_${index}_${qIndex}`} className="review__card">
              <div
                key={questionId}
                className="review__card__image"
              >
                <img src={imageSrc} alt="Capture Image" />
              </div>
              <div className="review__card__body">
                <div className="review__card__title">
                  <h3>{question.questionTitle}</h3>
                </div>
                <div className="review__card__description">
                  <p>{question.questionDesc}</p>
                </div>
              </div>
            </div>
          ) : null;
        }))};
    </>
  );
};
