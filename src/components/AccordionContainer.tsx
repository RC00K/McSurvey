import {
    IonIcon,
  } from "@ionic/react";
  import { addCircleOutline, chevronBack, chevronForward, removeCircleOutline } from "ionicons/icons";
  import "./AccordionContainer.css";
  import { useEffect, useState } from "react";
  import image1 from "../assets/images/image001.png";
  import image2 from "../assets/images/image002.png";
  import image3 from "../assets/images/image003.png";
  import image4 from "../assets/images/image004.png";
  import image5 from "../assets/images/image005.png";
  import Cookies from "js-cookie";
  
  export const AccordionContainer = () => {
    const [expanded, setExpanded] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
      const firstVisit = Cookies.get("firstVisit");
      if (!firstVisit) {
        setShowTooltip(true);
        Cookies.set("firstVisit", "true", { expires: 365 });
      }
    });

    const handleExpand = () => {
      setExpanded(!expanded);
    };

    const handleImageClick = (index: number) => {
      setFullScreenImage(images[index].image);
      setCurrentIndex(index);
      setShowTooltip(false);
    };

    const handleOverlayClick = () => {
      setFullScreenImage(null);
    };

    const showNextImage = () => {
      const nextIndex = (currentIndex + 1) % images.length;
      setFullScreenImage(images[nextIndex].image);
      setCurrentIndex(nextIndex);
    };

    const showPrevImage = () => {
      const prevIndex = (currentIndex - 1 + images.length) % images.length;
      setFullScreenImage(images[prevIndex].image);
      setCurrentIndex(prevIndex);
    };

    const images = [
      { image: image1, imageAlt: "image1" },
      { image: image2, imageAlt: "image2" },
      { image: image3, imageAlt: "image3" },
      { image: image4, imageAlt: "image4" },
      { image: image5, imageAlt: "image5" },
    ];

    return (
      <div className="accordion__container">
        <details onToggle={handleExpand}>
          <summary>
            <span className="accordion__title">
              Example Pictures
            </span>
            <IonIcon icon={expanded ? removeCircleOutline : addCircleOutline} className="accordion__expand" />
          </summary>
          <div className="accordion__content">
            <div className="accordion__gallery__grid">
              {images.map((img, index) => (
                <div key={index} className="accordion__gallery__content">
                  <div className="accordion__card" onClick={() => handleImageClick(index)}>
                    <img src={img.image} alt={img.imageAlt} />
                    {showTooltip && index === 0 && (
                      <div className="accordion__tooltip show">
                        Click to expand
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </details>
        {fullScreenImage && (
          <>
            <div className="accordion__overlay active" onClick={handleOverlayClick}></div>
            <div className="accordion__card expanded">
              <img src={fullScreenImage} alt="expanded" />
            </div>
            <button className="accordion__nav left" onClick={showPrevImage}>
              <IonIcon icon={chevronBack} />
            </button>
            <button className="accordion__nav right" onClick={showNextImage}>
              <IonIcon icon={chevronForward} />
            </button>
          </>
        )}
      </div>
    );
  };
  