import { useEffect, useState } from "react";
import "../loaders/SendingLoader.css";

const SendingLoader = ({ emailSendingStatus }: { emailSendingStatus: string }) => {
  return (
    <>
        <div className="loader">
            <div className="loader__text">
                {emailSendingStatus === "sending" ? "Sending" : "Sent"}
            </div>
            <div className="loader__bar"></div>
        </div>
    </>
  );
};

export default SendingLoader;
