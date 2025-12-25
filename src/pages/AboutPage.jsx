import { Github, Twitter, Linkedin, Facebook, Instagram, Youtube, Mail } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Need For News</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Delivering unbiased, real-time news to the Telugu community across the globe. We stand for truth and integrity.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                    <div className="prose prose-lg text-gray-600">
                        <p className="mb-4">
                            At Need For News, we believe in the power of information to transform lives. Our mission is to provide accurate, timely, and comprehensive news coverage that empowers our readers to make informed decisions.
                        </p>
                        <p>
                            Founded in 2024, we strictly adhere to journalistic ethics and strive to bring you stories that matter—from local politics and entertainment to global events and technology trends.
                        </p>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Leadership</h2>

                    {/* CEO */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden md:flex max-w-2xl mx-auto mb-12 transform hover:-translate-y-1 transition-transform duration-300">
                        <div className="md:w-1/2 bg-gray-200 h-64 md:h-auto flex items-center justify-center">
                            {/* CEO Placeholder Image */}
                            <div className="text-center">
                                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center text-gray-500">
                                    <span className="text-4xl">👤</span>
                                </div>
                                <span className="text-sm text-gray-500">Photo Placeholder</span>
                            </div>
                        </div>
                        <div className="p-8 md:w-1/2 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">Prakash Raj</h3>
                            <p className="text-primary-600 font-medium mb-4">Founder & CEO</p>
                            <p className="text-gray-600 mb-6">
                                With over 15 years of experience in journalism, Prakash leads our team with a vision to redefine digital news consumption.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="text-gray-400 hover:text-blue-500"><Twitter size={20} /></a>
                                <a href="#" className="text-gray-400 hover:text-blue-700"><Linkedin size={20} /></a>
                            </div>
                        </div>
                    </div>

                    {/* Team Grid */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">The Team</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="bg-white rounded-xl shadow-sm p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400">
                                    <span className="text-3xl">👤</span>
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">Team Member {item}</h4>
                                <p className="text-primary-600 text-sm mb-2">Senior Editor</p>
                                <p className="text-gray-500 text-sm">Expert in political analysis and current affairs.</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Connect Section */}
                <div className="bg-gray-900 rounded-2xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-6">Connect With Us</h2>
                    <p className="text-gray-300 mb-8 max-w-lg mx-auto">
                        Follow us on social media for breaking news updates and exclusive content.
                    </p>
                    <div className="flex justify-center gap-8">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-blue-600 transition-colors">
                            <Facebook size={24} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-sky-500 transition-colors">
                            <Twitter size={24} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-pink-600 transition-colors">
                            <Instagram size={24} />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 rounded-full hover:bg-red-600 transition-colors">
                            <Youtube size={24} />
                        </a>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-800">
                        <a href="mailto:contact@tentvnews.com" className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                            <Mail size={18} />
                            contact@tentvnews.com
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
