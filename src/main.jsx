import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import SiteHeader from './components/SiteHeader.jsx';
import HeroSection from './components/HeroSection.jsx';
import NowSection from './components/NowSection.jsx';
import WorkSection from './components/WorkSection.jsx';
import ResumeSections from './components/ResumeSection.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import WordHuntDialog from './components/WordHuntDialog.jsx';

function App() {
  const [wordHuntOpen, setWordHuntOpen] = useState(false);

  return (
    <div className="site-shell">
      <SiteHeader />

      <main id="top">
        <HeroSection />
        <NowSection />
        <WorkSection onWordHunt={() => setWordHuntOpen(true)} />
        <ResumeSections />
      </main>

      <SiteFooter />
      <div id="writing" />

      {/* TODO(attention): implement hero-word attention weights and page highlights. */}
      {/* TODO(word-hunt): implement the API route in server/ and connect the dialog. */}
      {wordHuntOpen && <WordHuntDialog onClose={() => setWordHuntOpen(false)} />}
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
