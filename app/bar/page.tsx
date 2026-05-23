import BarContent from './bar-content';

export const metadata = {
  title: 'Idea Bar · Claire\'s Parlor',
};

/**
 * /bar — Members-only Idea Bar.
 * Magic-link email gate (UI only — backend wiring lives elsewhere).
 */
export default function BarPage() {
  return <BarContent />;
}
