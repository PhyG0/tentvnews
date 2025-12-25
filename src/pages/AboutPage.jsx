import { Github, Twitter, Linkedin, Facebook, Instagram, Youtube, Mail } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">మా గురించి (About Us)</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto font-telugu">
                        ప్రపంచవ్యాప్తంగా ఉన్న తెలుగు వారికి నిష్పాక్షికమైన, నిజమైన వార్తలను అందించడమే మా లక్ష్యం. మేము సత్యం మరియు చిత్తశుద్ధికి కట్టుబడి ఉన్నాము.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6 font-telugu">మా లక్ష్యం (Mission)</h2>
                    <div className="prose prose-lg text-gray-600 font-telugu">
                        <p className="mb-4">
                            10TV News వద్ద, సమాచారం ప్రజల జీవితాలను మార్చగలదని మేము నమ్ముతున్నాము. మా పాఠకులకు సరైన నిర్ణయాలు తీసుకోవడానికి అవసరమైన ఖచ్చితమైన, సమయానుకూలమైన మరియు సమగ్రమైన వార్తలను అందించడమే మా లక్ష్యం.
                        </p>
                        <p>
                            2024లో స్థాపించబడిన మేము, జర్నలిజం విలువల పట్ల నిబద్ధతతో ఉంటూ, స్థానిక రాజకీయాలు, సినిమా, టెక్నాలజీ మరియు ప్రపంచ పరిణామాల వరకు మీకు అవసరమైన కథనాలను అందిస్తున్నాము.
                        </p>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center font-telugu">మా నాయకత్వం (Leadership)</h2>

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
                            <p className="text-gray-600 mb-6 font-telugu">
                                జర్నలిజంలో 15 సంవత్సరాలకు పైగా అనుభవంతో, డిజిటల్ వార్తా ప్రపంచంలో కొత్త ఒరవడిని సృష్టించాలనే లక్ష్యంతో ప్రకాష్ రాజ్ మా బృందాన్ని నడిపిస్తున్నారు.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="text-gray-400 hover:text-blue-500"><Twitter size={20} /></a>
                                <a href="#" className="text-gray-400 hover:text-blue-700"><Linkedin size={20} /></a>
                            </div>
                        </div>
                    </div>

                    {/* Team Grid */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center font-telugu">మా బృందం (Team)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="bg-white rounded-xl shadow-sm p-6 text-center transform hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-400">
                                    <span className="text-3xl">👤</span>
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">Team Member {item}</h4>
                                <p className="text-primary-600 text-sm mb-2">Senior Editor</p>
                                <p className="text-gray-500 text-sm font-telugu">రాజకీయ విశ్లేషణ మరియు సమకాలీన అంశాలలో నిపుణులు.</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Connect Section */}
                <div className="bg-gray-900 rounded-2xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-3xl font-bold mb-6 font-telugu">మమ్మల్ని అనుసరించండి</h2>
                    <p className="text-gray-300 mb-8 max-w-lg mx-auto font-telugu">
                        తాజా వార్తల కోసం సోషల్ మీడియాలో మమ్మల్ని ఫాలో అవ్వండి.
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
