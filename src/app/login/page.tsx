import React from "react";
import { LoginForm } from "@/src/features/auth";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen flex items-center justify-center pt-20 px-4">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Cinema Background"
          className="w-full h-full object-cover opacity-30"
          src="https://i.ibb.co/3pQG6qX/vip-cinema.jpg"
        />
        <div className="absolute inset-0 bg-[#131313]/60 backdrop-blur-sm"></div>
      </div>

      {/* Form Content */}
      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>
    </main>
  );
}
