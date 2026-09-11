import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { LEARNING_NOTES } from '@/lib/content';

export const metadata: Metadata = {
  title: LEARNING_NOTES.pageTitle,
  description: LEARNING_NOTES.pageDescription,
  alternates: { canonical: 'https://clairesparlor.com/studio/notes/' },
};

export default function LearningNotesLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
