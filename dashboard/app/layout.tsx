import './globals.css';

export const metadata = {
  title: 'Yaal Nilam Admin',
  description: 'Admin dashboard for Yaal Nilam Jaffna property platform',
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
