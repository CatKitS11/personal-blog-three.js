// import { Github } from "lucide-react";
import { FaLinkedin, FaGithub, FaGoogle } from "react-icons/fa";

function Footer() {
    return (
        <footer className="bg-stone-100 py-4">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    {/* Left side - Social links */}
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700 font-medium">Get in touch</span>
                        <div className="flex space-x-2">
                            <a href="#" className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                                <FaLinkedin className="text-white text-sm" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                                <FaGithub className="text-white text-sm" />
                            </a>
                            <a href="#" className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                                <FaGoogle className="text-white text-sm" />
                            </a>
                        </div>
                    </div>
                    
                    {/* Right side - Home link */}
                    <div>
                        <a href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
                            Home page
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;