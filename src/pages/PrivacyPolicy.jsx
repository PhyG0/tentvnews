import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <Helmet>
                <title>Privacy Policy - 10TV News</title>
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 prose prose-gray max-w-none">
                    <h1>Privacy Policy</h1>
                    <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

                    <p>
                        At <strong>10TV News</strong>, accessible from tentvnews.vercel.app, one of our main priorities is the privacy of our visitors.
                        This Privacy Policy document contains types of information that is collected and recorded by 10TV News and how we use it.
                    </p>

                    <h2>Information We Collect</h2>
                    <p>
                        The personal information that you are asked to provide, and the reasons why you are asked to provide it,
                        will be made clear to you at the point we ask you to provide your personal information.
                    </p>
                    <ul>
                        <li><strong>Login Information:</strong> When you register via Google Login, we collect your name, email address, and profile picture to create your account.</li>
                        <li><strong>Usage Data:</strong> We may collect information about how you access and use the website, including your IP address, browser type, and operating system.</li>
                    </ul>

                    <h2>Cookies and Web Beacons</h2>
                    <p>
                        Like any other website, 10TV News uses "cookies". These cookies are used to store information including visitors' preferences,
                        and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience
                        by customizing our web page content based on visitors' browser type and/or other information.
                    </p>

                    <h2>Google DoubleClick DART Cookie</h2>
                    <p>
                        Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors
                        based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of
                        DART cookies by visiting the Google ad and content network Privacy Policy at the following URL –
                        <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>
                    </p>

                    <h2>Our Advertising Partners</h2>
                    <p>
                        Some of advertisers on our site may use cookies and web beacons. Our advertising partners are listed below.
                        Each of our advertising partners has their own Privacy Policy for their policies on user data.
                        For easier access, we hyperlinked to their Privacy Policies below.
                    </p>
                    <ul>
                        <li>
                            <strong>Google AdSense</strong>: <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a>
                        </li>
                    </ul>

                    <h2>GDPR Data Protection Rights</h2>
                    <p>
                        We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
                    </p>
                    <ul>
                        <li>The right to access and rectification.</li>
                        <li>The right to erasure ("Right to be forgotten").</li>
                        <li>The right to restrict processing.</li>
                        <li>The right to object to processing.</li>
                        <li>The right to data portability.</li>
                    </ul>

                    <h2>Children's Information</h2>
                    <p>
                        Another part of our priority is adding protection for children while using the internet.
                        We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
                    </p>
                    <p>
                        10TV News does not knowingly collect any Personal Identifiable Information from children under the age of 13.
                    </p>

                    <h2>Contact Us</h2>
                    <p>
                        If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
