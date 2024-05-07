import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Survey from './pages/Survey';

import './theme/styles.css';

import Review from './pages/Review';
import { ReviewProvider } from './components/Review/ReviewContext';
import Camera from './pages/Camera';
import CameraContainer from './components/CameraContainer';

setupIonicReact();

const App: React.FC = () => (
  <main className="content">
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <ReviewProvider>
          <Route path="/survey/:surveyId" component={Survey} />
          <Route path="/camera/:questionIndex" component={CameraContainer} />
          <Route path="/review" component={Review} />
        </ReviewProvider>
      </Switch>
    </Router>
  </main>
);

export default App;
