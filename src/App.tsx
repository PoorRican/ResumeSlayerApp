import React from 'react';
import ResumeCard from './components/ResumeCard';

function App() {
  return (
    <div className='container mx-auto'>
      <h1 className="text-2xl mb-16">Resume Slayer</h1>
      <main className='mx-auto max-w-4xl bg-slate-50 px-16 py-8'>
        <ResumeCard />
      </main>
    </div>
  );
}

export default App;
