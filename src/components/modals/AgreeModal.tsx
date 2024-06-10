import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { useSurvey } from "../../assets/context/SurveyContext";
import jsPDF from "jspdf";
import SendingLoader from "../loaders/SendingLoader";
import "./custom-modals.css";

const AgreeModal = ({
  showModal,
  setShowModal,
  surveyData,
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  surveyData: any;
}) => {
  const { images, surveyName, storeNumber, reset } = useSurvey();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isClosing, setIsClosing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailSendStatus, setEmailSendStatus] = useState("notSent");
  const [accountManager, setAccountManager] = useState<string | null>(null);
  const history = useHistory();

  // const fetchAccMgr = async (storeNumber: string) => {
  //   const response = await fetch(`https://mcsurveyfetcherapi.gomaps.com/accmgr`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ storeNumber }),
  //   });
  //   const accountMgr = await response.json();
  //   return accountMgr;
  // };

  // Convert string to title case
  // const toTitleCase = (str: string) => {
  //   return str.replace(/\w\S*/g, (txt) => {
  //     return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  //   });
  // };

  // const assignAccountManager = async (storeNumber: string): Promise<string> => {
  //   const accountManagerArray = await fetchAccMgr(storeNumber);
  //   // const accMgr = accountManagerArray[0].AccountManager;
  //   setAccountManager(accountManagerArray[0].AccountManager);
  //   return accountManagerArray[0].AccountManager;
  // };

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

    const gridImageLayout = (pdf: jsPDF, images: string[], xStart: number, yStart: number, imageWidth: number, imageHeight: number, imagesPerRow: number, margin: number) => {
      let x = xStart;
      let y = yStart;
      images.forEach((src, index) => {
        if (index % imagesPerRow === 0 && index !== 0) {
          x = xStart;
          y += imageHeight + margin;
        }
        const img = new Image();
        img.src = src;
        pdf.addImage(img, 'JPEG', x, y, imageWidth, imageHeight);
        x += imageWidth + margin;
      });
    };

    let isFirstPage = true;
    
    for (const [index, question] of surveyData.surveyTypes[0].questions.entries()) {
      if (!isFirstPage) {
        pdf.addPage();
      } else {
        isFirstPage = false;
      }

      const questionId = `question_${index}`;
      const imageSrcArray = images[questionId] || [];

      pdf.text(`Question ${index + 1}: ${question.questionTitle}`, 10, 20);
      pdf.text(question.questionDesc, 10, 30);

      if (imageSrcArray.length === 1) {
        const imageData = await loadImage(imageSrcArray[0]);
        pdf.addImage(imageData as string, 'JPEG', 10, 50, 180, 180); // Full page image
      } else {
        const imagesPerRow = 2;
        const margin = 10;
        const imageWidth = 80;
        const imageHeight = 80;
        gridImageLayout(pdf, imageSrcArray, 10, 50, imageWidth, imageHeight, imagesPerRow, margin);
      }
    }

    setIsGeneratingPDF(false);
    const pdfBlob = pdf.output("blob");
    const pdfName = `${surveyName}_${storeNumber}_${new Date().toISOString().split("T")[0]}.pdf`;
    return { pdfBlob, pdfName }
  };

  const handleSendEmail = async (event: any) => {
    event.preventDefault();
    // const accMgr = await assignAccountManager(storeNumber);
    // get account manager and store number from local storage
    const storeNumber = localStorage.getItem("storeNumber");
    const accMgr = localStorage.getItem("accountManager");
    setEmailSendStatus("sending");
    try {
      const { pdfBlob, pdfName } = await generatePDF();
      const formData = new FormData();
      
      formData.append("file", pdfBlob, pdfName);
      
      // Emails to send report
      const emailAddresses = [
        "ryder.cook@gomaps.com",
        "AccountManagersOnly@gomaps.com"
      ];

      formData.append("email", emailAddresses.join(","));
      formData.append("subject", `${surveyName} Survey: ${storeNumber} ${accMgr}`);
      formData.append("text", `Hello ${accMgr},\n\nPlease find the attached survey report for ${surveyName} at store number ${storeNumber}.\n\nThank you,\nMAPS Team`);

      const response = await fetch("https://mcsurveymailerapi.gomaps.com/send", {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
        }
      });

      const responseData = await response.json();

      // close modal after response is received
      setShowModal(false);

      if (response.ok) {
        setEmailSendStatus("sent");
        setEmailSent(true);
        console.log("Email sent successfully");
        reset();
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
    setShowModal(false);
  };

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
            <SendingLoader emailSendingStatus={emailSendStatus} />
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
              <button className="primary__btn" onClick={handleGeneratePDF}>
                Agree
              </button>
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
