import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} 10TV News. All rights reserved.
                </div>

                <div className="flex items-center gap-6">
                    <Link
                        to="/privacy-policy"
                        className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        to="/about"
                        className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
                    >
                        About Us
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
