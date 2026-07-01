import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import PlanPage from './pages/PlanPage';
import AboutPage from './pages/AboutPage';
import SampleTripPage from './pages/SampleTripPage';
import ChatPage from './pages/ChatPage';
import ExplorePage from './pages/ExplorePage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import SouvenirsPage from './pages/SouvenirsPage';
import TravelInsurancePage from './pages/TravelInsurancePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="plan" element={<PlanPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="sample-trip" element={<SampleTripPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="souvenirs" element={<SouvenirsPage />} />
          <Route path="insurance" element={<TravelInsurancePage />} />
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center flex-grow gap-md pt-40 pb-24 md:pb-0 text-center px-5">
              <span className="material-symbols-outlined text-6xl text-outline" style={{ fontSize: '64px' }}>explore_off</span>
              <h1 className="font-headline-lg text-headline-lg text-primary">Page Not Found</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">This destination doesn't exist yet.</p>
              <a href="/" className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full hover:bg-primary-container transition-colors mt-2 inline-block">Back to Home</a>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
