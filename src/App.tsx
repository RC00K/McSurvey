import React from "react";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact,
  IonIcon,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import Survey from "./pages/Survey";
import CameraComponent from "./components/Camera/CameraContainer";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/main.css";
import Review from "./pages/Review";
import { ReviewProvider } from "./components/Review/ReviewContext";
import { CameraProvider } from "./components/Camera/CameraContext";
import { menu, search, peopleOutline, cartOutline, statsChartOutline, cashOutline } from "ionicons/icons";
import { documentOutline, gridOutline, pieChartOutline, personOutline, logOutOutline } from 'ionicons/icons';
import Icon from './assets/images/icon.png';

setupIonicReact();

const App: React.FC = () => (
  // <IonApp>
  //   <IonReactRouter>
  //     <ReviewProvider>
  //       <IonRouterOutlet>
  //         <Route exact path="/home">
  //           <Home />
  //         </Route>
  //         <Route exact path="/">
  //           <Redirect to="/home" />
  //         </Route>
  //         <CameraProvider>
  //           <Route exact path="/survey/:selected">
  //             <Survey />
  //           </Route>
  //         </CameraProvider>
  //         <Route exact path="/review">
  //           <Review />
  //         </Route>
  //       </IonRouterOutlet>
  //     </ReviewProvider>
  //   </IonReactRouter>
  // </IonApp>
  <>
    <div className="sidebar">
      <a href="/home" className="logo">
        <img src={Icon} alt="logo" />
      </a>
      <ul className="side__menu">
        <li className="active">
          <a href="/home">
            <IonIcon icon={gridOutline} className="side__menu__icon" />
            Dashboard
          </a>
        </li>
        <li>
          <a href="/surveys">
            <IonIcon icon={documentOutline} className="side__menu__icon" />
            Surveys
          </a>
        </li>
        <li>
          <a href="#">
            <IonIcon icon={pieChartOutline} className="side__menu__icon" />
            Analytics
          </a>
        </li>
        <li>
          <a href="#">
            <IonIcon icon={personOutline} className="side__menu__icon" />
            Account
          </a>
        </li>
        <li>
          <a href="#">
            <IonIcon icon={logOutOutline} className="side__menu__icon" />
            Logout
          </a>
        </li>
      </ul>
    </div>
    <div className="content">
      <nav>
        <IonIcon icon={menu} className="side__menu__icon menu__icon" />
        <form action="#">
          <div className="form__input">
            <input type="search" placeholder="Search" />
            <button type="submit">
              <IonIcon icon={search} className="side__menu__icon search__icon" />
            </button>
          </div>
        </form>
      </nav>
      <main>
        <Home />
      </main>
    </div>
  </>
);

export default App;
