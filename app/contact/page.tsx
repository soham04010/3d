"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [submitStatus, setSubmitStatus] = useState(""); 
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    document.body.classList.add('auto-cursor');
    return () => document.body.classList.remove('auto-cursor');
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitStatus("Sending...");
    setIsError(false);
    
    const formData = new FormData(form);
    formData.append("access_key", "2671cc0e-e509-42d7-a527-f3a2e1d06c81");
    
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      });
      const data = await response.json();

      if (data.success) {
        setSubmitStatus("Sent successfully!");
        form.reset();
        setTimeout(() => { setSubmitStatus(""); }, 2000);
      } else {
        setIsError(true);
        setSubmitStatus("Failed to send. Please try again.");
      }
    } catch (error) {
      setIsError(true);
      setSubmitStatus("Failed to send. Network error.");
    }
  };

  return (
    <main className="min-h-screen bg-[#e5e5e5] flex items-center justify-center px-4 pt-32 pb-12">
      <div className="bg-white p-6 md:p-12 rounded-2xl w-full max-w-md relative shadow-2xl border border-gray-100 mt-8">
        <Link href="/" className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-black [&.cursor-colliding]:text-black transition-colors z-10">
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </Link>
        <h2 className="text-xl md:text-2xl font-sans font-black mb-2 text-black">Drop a line.</h2>
        <p className="text-gray-400 text-xs md:text-sm mb-4 md:mb-6 font-sans">For the person who makes the smart choice.</p>
        
        <form className="flex flex-col gap-2.5 md:gap-3" onSubmit={handleSubmit}>
          <input type="text" name="name" required placeholder="Name" className="p-3 md:p-4 bg-gray-50 border border-gray-100 rounded-lg font-sans text-xs outline-none focus:border-black transition-colors" />
          <input type="email" name="email" required placeholder="Company Email" className="p-3 md:p-4 bg-gray-50 border border-gray-100 rounded-lg font-sans text-xs outline-none focus:border-black transition-colors" />
          <input type="tel" name="phone" required placeholder="Phone Number" className="p-3 md:p-4 bg-gray-50 border border-gray-100 rounded-lg font-sans text-xs outline-none focus:border-black transition-colors" />
          <textarea name="message" required placeholder="Message" rows={3} className="p-3 md:p-4 bg-gray-50 border border-gray-100 rounded-lg font-sans text-xs outline-none focus:border-black transition-colors resize-none" />
          <input type="hidden" name="subject" value="New Website Submission for Dang Soda" />
          <button type="submit" className="bg-black text-white font-sans font-medium text-xs tracking-widest uppercase py-3 md:py-4 rounded-lg mt-1 md:mt-2 hover:bg-gray-800 [&.cursor-colliding]:bg-gray-800 transition-colors">
            Send Message
          </button>
          {submitStatus && <div className={`mt-1 md:mt-2 font-sans font-medium text-center text-xs ${isError ? 'text-red-500' : 'text-green-600'}`}>{submitStatus}</div>}
        </form>

        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 flex flex-col gap-1.5 md:gap-2">
          <h3 className="font-sans font-bold text-[9px] md:text-[10px] tracking-widest text-gray-400 uppercase">Our Contacts</h3>
          <a href="mailto:humans@drinkdang.com" className="font-sans text-xs md:text-sm font-medium text-black hover:text-gray-600 [&.cursor-colliding]:text-gray-600 transition-colors">humans@drinkdang.com</a>
          <a href="tel:+919823482342" className="font-sans text-xs md:text-sm font-medium text-black hover:text-gray-600 [&.cursor-colliding]:text-gray-600 transition-colors">+91 9823482342</a>
        </div>
      </div>
    </main>
  );
}
