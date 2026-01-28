import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/Layout/PublicLayout';
import { ArrowLeft, Shield, Eye, Lock } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <PublicLayout headerVariant="minimal" footerVariant="minimal">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <div className="text-center">
            <Shield size={48} className="mx-auto text-blue-600 mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600">
              Last updated: January 15, 2025
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nurova Australia Pty Ltd ("we", "our", or "us") is committed to protecting your privacy and personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
              NDIS support coordination platform ("Service").
            </p>
            <p className="text-gray-700 leading-relaxed">
              This policy complies with the Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth) and 
              the Notifiable Data Breaches scheme. We handle sensitive information with additional protections as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">2.1 Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-2">We collect the following types of personal information:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
              <li>Identity information (name, date of birth, contact details)</li>
              <li>Address and location information</li>
              <li>NDIS participant numbers and plan information</li>
              <li>Professional qualifications and certifications</li>
              <li>Banking and payment information</li>
              <li>Employment and business details (ABN, business name)</li>
              <li>Emergency contact information</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">2.2 Sensitive Information</h3>
            <p className="text-gray-700 leading-relaxed mb-2">With your explicit consent, we may collect sensitive information including:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
              <li>Health information relevant to support service delivery</li>
              <li>Disability information as required for NDIS services</li>
              <li>Criminal history information (background checks for support workers)</li>
              <li>Racial or ethnic origin (for cultural matching preferences)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">2.3 Technical Information</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
              <li>Device information and browser type</li>
              <li>IP address and location data</li>
              <li>Usage patterns and platform interactions</li>
              <li>Log files and error reports</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">2.4 Documents and Files</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Identity documents (driver's license, passport)</li>
              <li>NDIS cards and plan documents</li>
              <li>Professional certifications and qualifications</li>
              <li>Background check results</li>
              <li>Insurance certificates</li>
              <li>Profile photos and other uploaded content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Collect Information</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">3.1 Direct Collection</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Most information is collected directly from you when you register, complete your profile, 
              upload documents, or use our services. We collect information through forms, surveys, 
              communications, and your interactions with the platform.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">3.2 Third Party Collection</h3>
            <p className="text-gray-700 leading-relaxed mb-2">We may collect information from third parties including:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
              <li>NDIS Commission for verification purposes</li>
              <li>Background check providers</li>
              <li>Professional registration bodies</li>
              <li>Plan managers and support coordinators</li>
              <li>Healthcare providers (with your consent)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">3.3 Automatic Collection</h3>
            <p className="text-gray-700 leading-relaxed">
              We automatically collect technical information through cookies, web beacons, and similar technologies 
              to improve platform functionality, security, and user experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. How We Use Your Information</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">4.1 Primary Purposes</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
              <li>Facilitating connections between participants and support workers</li>
              <li>Verifying identity and qualifications</li>
              <li>Processing payments and managing invoices</li>
              <li>Ensuring compliance with NDIS requirements</li>
              <li>Providing customer support and platform maintenance</li>
              <li>Managing incidents and safeguarding concerns</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">4.2 Secondary Purposes</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
              <li>Improving platform functionality and user experience</li>
              <li>Conducting research and analytics (in aggregated, de-identified form)</li>
              <li>Marketing and promotional communications (with consent)</li>
              <li>Legal compliance and regulatory reporting</li>
              <li>Fraud prevention and security monitoring</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">4.3 Sensitive Information Use</h3>
            <p className="text-gray-700 leading-relaxed">
              Sensitive information is only used for the specific purposes for which consent was given, 
              such as matching participants with culturally appropriate support workers or ensuring 
              appropriate support for specific health conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Information Sharing and Disclosure</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">5.1 Within the Platform</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Information is shared between platform users as necessary for service delivery. 
              Participants' relevant information is shared with assigned support workers, 
              and worker qualifications are shared with participants and administrators.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">5.2 Third Party Disclosures</h3>
            <p className="text-gray-700 leading-relaxed mb-2">We may disclose your information to:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
              <li>NDIS Commission for compliance and reporting purposes</li>
              <li>Plan managers for billing and budget management</li>
              <li>Payment processors for financial transactions</li>
              <li>Cloud service providers for data storage and processing</li>
              <li>Professional advisors (lawyers, accountants, auditors)</li>
              <li>Law enforcement agencies when legally required</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">5.3 Consent and Legal Basis</h3>
            <p className="text-gray-700 leading-relaxed">
              We only disclose information with your consent, where required by law, 
              or where necessary for the legitimate interests of providing NDIS services 
              while protecting your fundamental rights and freedoms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security and Storage</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">6.1 Security Measures</h3>
            <p className="text-gray-700 leading-relaxed mb-2">We implement comprehensive security measures including:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
              <li>End-to-end encryption for sensitive data transmission</li>
              <li>Secure cloud storage with access controls</li>
              <li>Multi-factor authentication for user accounts</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Staff training on privacy and security protocols</li>
              <li>Incident response procedures for data breaches</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">6.2 Data Location</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your information is primarily stored on secure servers located in Australia. 
              Some data may be processed by overseas service providers in countries with adequate privacy protections, 
              including the United States and European Union.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">6.3 Data Retention</h3>
            <p className="text-gray-700 leading-relaxed">
              We retain your information for as long as necessary to provide services and comply with legal obligations. 
              NDIS-related records are retained for seven years as required by regulation. 
              You may request deletion of your information subject to our legal and regulatory obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Privacy Rights</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">7.1 Access and Correction</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to access your personal information and request corrections if it's inaccurate or incomplete. 
              Most information can be updated through your account dashboard, or you can contact us for assistance.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">7.2 Consent Withdrawal</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may withdraw consent for certain uses of your information, though this may affect our ability to provide services. 
              You can opt out of marketing communications at any time through your account settings or unsubscribe links.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">7.3 Complaints Process</h3>
            <p className="text-gray-700 leading-relaxed">
              If you have concerns about how we handle your information, please contact our Privacy Officer. 
              If you're not satisfied with our response, you can lodge a complaint with the Office of the Australian Information Commissioner (OAIC).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies and Tracking</h2>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">8.1 Cookie Usage</h3>
            <p className="text-gray-700 leading-relaxed mb-2">We use cookies and similar technologies for:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
              <li>Essential platform functionality and user authentication</li>
              <li>Remembering your preferences and settings</li>
              <li>Analytics to improve platform performance</li>
              <li>Security monitoring and fraud prevention</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">8.2 Cookie Management</h3>
            <p className="text-gray-700 leading-relaxed">
              You can control cookie settings through your browser preferences. 
              Disabling certain cookies may affect platform functionality. 
              We provide cookie consent options for non-essential cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our platform may be used by NDIS participants under 18 years of age. 
              We collect and use children's information only as necessary for NDIS service provision 
              and in accordance with parental consent requirements and child protection laws.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Parents and guardians have the right to access, correct, or request deletion of their child's information, 
              subject to NDIS record-keeping requirements and the child's best interests.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Data Breach Notification</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              In the event of a data breach that is likely to result in serious harm, 
              we will notify the OAIC within 72 hours and affected individuals as soon as practicable. 
              We maintain incident response procedures to minimize the impact of any security incidents.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We will provide clear information about the nature of the breach, 
              the information involved, steps we're taking to address it, and recommendations for affected individuals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update this Privacy Policy to reflect changes in our practices, technology, legal requirements, 
              or other factors. We will notify you of material changes through the platform or by email.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Your continued use of the platform after policy changes constitutes acceptance of the updated policy. 
              We encourage you to review this policy periodically to stay informed about how we protect your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                For privacy-related questions, concerns, or requests, please contact our Privacy Officer:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Privacy Officer</strong></p>
                <p><strong>Nurova Australia Pty Ltd</strong></p>
                <p>Email: privacy@nurova.com.au</p>
                <p>Phone: 1800 NUROVA (1800 687 682)</p>
                <p>Address: Melbourne, Victoria, Australia</p>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm text-gray-600">
                  <strong>Office of the Australian Information Commissioner (OAIC)</strong><br />
                  Website: www.oaic.gov.au<br />
                  Phone: 1300 363 992<br />
                  Email: enquiries@oaic.gov.au
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/terms" className="text-blue-600 hover:text-blue-700">Terms of Service</Link>
            <Link to="/contact" className="text-blue-600 hover:text-blue-700">Contact Us</Link>
            <Link to="/help" className="text-blue-600 hover:text-blue-700">Help Center</Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PrivacyPolicy;