"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const router = useRouter();


  
  const handleSignup = () => {
    if (!email || !email.includes("@")) {
      alert("Enter valid email");
      return;
    }

    if (!email.endsWith("@vitapstudent.ac.in")) {
      alert("Use college mail only");
      return;
    }

    if (!name) {
      alert("Enter name");
      return;
    }

    // store locally
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", name);

    // go to home
    router.push("/");
  };

  

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-10">
      <div className="w-full max-w-sm space-y-4">

        <h1 className="text-2xl font-bold text-center">Create Account</h1>

        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e)=> setname(e.target.value)}
          className="w-full p-3 rounded bg-white/10"
        />

        <input
          type="email"
          placeholder="College Email"
          value={email}
          onChange={(e)=> setemail(e.target.value)}
          className="w-full p-3 rounded bg-white/10"
        />

        <button
          onClick={handleSignup}
          className="w-full bg-green-400 text-black py-3 rounded-full"
        >
          Continue
        </button>

      </div>
    </main>
  );
}