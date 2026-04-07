import Image from "next/image";
import Link from "next/link";
import { FaEnvelope, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-white text-black py-10 px-6 md:px-16 border-t border-gray-100 z-50 relative">
      {/* Using a 3-column grid. 
          The '1fr auto 1fr' setup ensures the middle column only takes the space it needs, 
          keeping it centered while the side columns fill the rest.
      */}
      <div className="max-w-7xl mx-auto flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] items-center gap-6">
        
        {/* Left: Logo */}
        <div className="flex justify-center md:justify-start">
          <Image
            src="/footer.png"
            alt="Elite Verse Solutions Logo"
            width={120}
            height={40}
            className="w-32 md:w-40 h-auto object-contain"
          />
        </div>

        {/* Center: Text Content */}
        <div className="text-center flex flex-col gap-1">
          <p className="text-sm md:text-base font-bold text-black whitespace-nowrap">
            Developed and Maintained by Elite Verse Solutions Pvt. Ltd.
          </p>
          <p className="text-xs md:text-sm text-black font-medium opacity-90">
            80% Freelance-powered branding platform with 20% agency expertise across everything
          </p>
        </div>

        {/* Right: Social Icons */}
        <div className="flex justify-center md:justify-end items-center gap-15">
          <Link href="mailto:official@eliteversesolutions.com" target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-60 transition-opacity">
            <FaEnvelope className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
          <Link href="https://www.instagram.com/eliteverse.solutions/?hl=en" target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-60 transition-opacity">
            <FaInstagram className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
          <Link href="https://www.linkedin.com/company/elite-verse-solutions/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-60 transition-opacity">
            <FaLinkedin className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;