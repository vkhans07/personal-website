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
import BlogPage from './components/BlogPage.jsx';
import {AttentionProvider} from './attention/AttentionContext.jsx';

function App() {
  const [wordHuntOpen, setWordHuntOpen] = useState(false);

  if (window.location.pathname.replace(/\/$/, '') === '/blog') {
    return <BlogPage />;
  }

  return (
    <AttentionProvider>
      <div className="site-shell">
        <SiteHeader />

        <main id="top">
          <HeroSection />
          <NowSection />
          <WorkSection onWordHunt={() => setWordHuntOpen(true)} />
          <ResumeSections />
        </main>

        <SiteFooter />
        {/* TODO(word-hunt): implement the API route in server/ and connect the dialog. */}
        {wordHuntOpen && <WordHuntDialog onClose={() => setWordHuntOpen(false)} />}
      </div>
    </AttentionProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
