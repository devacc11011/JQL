import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JQL - JSON Query Language Demo',
  description: 'Browser-based JSON to SQL query explorer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
