import Image from "next/image";
import Link from "next/link";
// Importing FontAwesome versions from react-icons
import { FaEnvelope, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-white text-black py-8 px-6 md:px-16 border-gray-200 z-50 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image
            src="/footer.png"
            alt="Elite Verse Solutions Logo"
            width={120}
            height={40}
            className="w-32 md:w-40 h-auto object-contain"
          />
        </div>

        {/* Text */}
        <div className="text-center md:text-left text-sm md:text-base font-sans font-medium text-black">
          Developed and Maintained by Elite Verse Solutions Pvt. Ltd.
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-15">
          <Link href="mailto:official@eliteversesolutions.com" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500 transition-colors">
            <FaEnvelope className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
          <Link href="https://www.instagram.com/eliteverse.solutions/?hl=en" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500 transition-colors">
            <FaInstagram className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
          <Link href="https://www.linkedin.com/company/elite-verse-solutions/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-500 transition-colors">
            <FaLinkedin className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;