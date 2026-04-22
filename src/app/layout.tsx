import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import CustomerLayout from "../components/layout/CustomerLayout";

// ... (phần khai báo font và metadata giữ nguyên)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`dark ${inter.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body selection:bg-primary selection:text-on-primary">
        {/* Bọc CustomerLayout ở đây */}
        <CustomerLayout>{children}</CustomerLayout>
      </body>
    </html>
  );
}
