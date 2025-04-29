// /App.tsx
import React from 'react';
import Navigation from './navigation';
import { BugProvider } from './context/BugContext';

export default function App() {
  return (
    <BugProvider>
      <Navigation />
    </BugProvider>
  );
}