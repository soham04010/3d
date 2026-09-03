"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
  const router = useRouter();
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
    formData.append("access_key", "cb869078-975f-42c9-b383-934264d40353");
    
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
        <button type="button" onClick={() => router.back()} className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-black [&.cursor-colliding]:text-black transition-colors z-10 cursor-pointer">
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <h2 className="text-xl md:text-2xl font-sans font-black mb-2 text-black">Drop a line.</h2>
        <p className="text-gray-400 text-xs md:text-sm mb-4 md:mb-6 font-sans">For the person who makes the smart choice.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans">
          {/* Honeypot Spam Protection */}
          <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

          <div>
            <label htmlFor="name" className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Alex Smith"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-black text-sm focus:outline-none focus:border-black focus:bg-white transition-all"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="alex@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-black text-sm focus:outline-none focus:border-black focus:bg-white transition-all"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder="Tell us what's on your mind..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-black text-sm focus:outline-none focus:border-black focus:bg-white transition-all resize-none"
            ></textarea>
          </div>

          {submitStatus && (
            <p className={`text-xs font-semibold px-4 py-2.5 rounded-xl ${isError ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
              {submitStatus}
            </p>
          )}

          <button
            type="submit"
            disabled={submitStatus === "Sending..." || submitStatus === "Sent successfully!"}
            className="w-full mt-2 py-3.5 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-[1.01] active:scale-95 shadow-lg"
          >
            {submitStatus === "Sending..." ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-100 flex flex-col gap-1.5 md:gap-2">
          <h3 className="font-sans font-bold text-[9px] md:text-[10px] tracking-widest text-gray-400 uppercase">Our Contacts</h3>
          <a href="mailto:dangbeverage@gmail.com" className="font-sans text-xs md:text-sm font-medium text-black hover:text-gray-600 [&.cursor-colliding]:text-gray-600 transition-colors">dangbeverage@gmail.com</a>
          <a href="tel:+919823482342" className="font-sans text-xs md:text-sm font-medium text-black hover:text-gray-600 [&.cursor-colliding]:text-gray-600 transition-colors">+91 9823482342</a>
        </div>
      </div>
    </main>
  );
}
