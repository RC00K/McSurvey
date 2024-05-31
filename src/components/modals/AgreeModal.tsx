import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useReview } from "../../components/Review/ReviewContext";
import { oneDrive, twoDrive } from "../../assets/data/aotsfees";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import SendingLoader from "../loaders/SendingLoader";
import "./custom-modals.css";

const AgreeModal = ({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}) => {
    const { driveThruSelection, images, storeNumber } = useReview();
    const selectedDriveThru = driveThruSelection === "1" ? oneDrive : twoDrive;
    const storedImages = images || JSON.parse(localStorage.getItem("reviewImages") || "{}");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isClosing, setIsClosing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailSendStatus, setEmailSendStatus] = useState("notSent");
  const history = useHistory();

  useEffect(() => {
    window.addEventListener("resize", () => {
      setIsMobile(window.innerWidth < 768);
    });
  }, []);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false); // Reset state for next opening
    }, 500); // Match this timeout to your CSS animation duration
  };

  // Effect to listen for showModal changes and reset isClosing state if needed
  useEffect(() => {
    if (showModal && isClosing) {
      setIsClosing(false);
    }
  }, [showModal]);

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
    setEmailSendStatus("sending");
    try {
      const pdfBlob = await generatePDF();
      const formData = new FormData();
      formData.append("file", pdfBlob, "aotsfees.pdf");
      formData.append("email", "ryder.cook@gomaps.com");
      formData.append("subject", "AOTS Fees Review");
      formData.append("text", "Attached is a PDF of your AOTS Fees review. Please review and provide feedback. Thank you!");

      const response = await fetch("/send", {
        method: "POST",
        body: formData,
      });

      const responseData = await response.json();

      if (response.ok) {
        setEmailSendStatus("sent");
        setEmailSent(true);
        console.log("Email sent successfully");
      } else {
        setEmailSendStatus("notSent");
        throw new Error(responseData.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Email sending failed", error);
      setEmailSent(false);
    }
    setEmailSendStatus("notSent");
  };

  const handleGeneratePDF = (event: any) => {
    event.preventDefault();
    handleSendEmail(event);
  }

  const navigateToHome = () => {
    history.push("/");
  };

  useEffect(() => {
    if (emailSent) {
      setTimeout(() => {
        navigateToHome();
      }, 5000);
    }
  }, [emailSent]);

  return (
    <>
        <div
        className={`modal__container ${
            showModal ? (isClosing ? "modal-closing" : "") : "hidden"
        } ${isMobile ? "mobile" : ""}`}
        >
            {emailSendStatus === "sending" ? (
                <div className="modal__article">
                    <SendingLoader 
                        emailSendingStatus={emailSendStatus}
                    />
                </div>
            ) : (
                <>
                    <div className="modal__header">
                        <div className="modal__header-top">
                            <h2>Photo submission agreement</h2>
                            <button className="close__btn" onClick={closeModal}>
                            X
                            </button>
                        </div>
                    </div>
                    <div className="modal__article">
                        <article>
                            <p>
                            By submitting these photos, I grant MAPS permission to use them
                            for any business purposes related to the equipment installation at
                            McDonald's. I confirm that I have the right to share these photos
                            and that they accurately depict the installed equipment.
                            </p>
                        </article>
                    </div>
                    <div className="modal__footer">
                        <button className="primary__btn" onClick={handleGeneratePDF}>Agree</button>
                    </div>
                </>
            )}
        </div>
        <div
            className={`overlay ${showModal ? "" : "hidden"}`}
            onClick={closeModal}
        />
    </>
  );
};

export default AgreeModal;
