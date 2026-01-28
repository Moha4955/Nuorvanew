import React from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/Layout/PublicLayout';
import { ArrowLeft, Shield, FileText, Scale } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <PublicLayout headerVariant="minimal" footerVariant="minimal">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <div className="text-center">
            <Scale size={48} className="mx-auto text-blue-600 mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600">
              Last updated: January 15, 2025
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By accessing and using the Nurova Australia platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
              If you disagree with any part of these terms, then you may not access the Service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Nurova Australia Pty Ltd ("Company", "we", "our", or "us") operates the NDIS support coordination platform 
              connecting NDIS participants with qualified support workers in compliance with Australian disability services regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nurova Australia provides a digital platform that facilitates connections between:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>NDIS participants seeking support services</li>
              <li>Qualified support workers providing NDIS services</li>
              <li>Plan managers overseeing participant budgets</li>
              <li>Administrative staff ensuring compliance and quality</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Our platform includes service coordination, compliance tracking, document management, 
              messaging, invoicing, and payment processing in accordance with NDIS Quality and Safeguards Commission requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts and Registration</h2>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">3.1 Account Creation</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To use our Service, you must create an account by providing accurate, complete, and current information. 
              You are responsible for safeguarding your account credentials and for all activities under your account.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">3.2 User Categories</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li><strong>NDIS Participants:</strong> Must provide valid NDIS number and plan information</li>
              <li><strong>Support Workers:</strong> Must complete verification process including background checks and qualifications</li>
              <li><strong>Plan Managers:</strong> Must provide valid registration and authorization documentation</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">3.3 Verification Requirements</h3>
            <p className="text-gray-700 leading-relaxed">
              All users must complete identity verification and provide required documentation. 
              Support workers must maintain current NDIS Worker Screening, WWCC/Police Check, and First Aid certification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Service Coordination and Matching</h2>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">4.1 Manual Assignment Model</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nurova Australia operates on a quality-first, admin-curated matching system. Support workers are manually 
              assigned to participant requests based on qualifications, location, availability, and compliance status.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">4.2 Service Requests</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Participants may request support services through the platform. All requests are reviewed by our admin team 
              before assignment. We do not guarantee that all requests will be fulfilled or that specific workers will be assigned.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">4.3 Service Delivery</h3>
            <p className="text-gray-700 leading-relaxed">
              Support workers are independent contractors responsible for delivering services in accordance with NDIS guidelines, 
              participant plans, and professional standards. Nurova Australia facilitates connections but does not directly provide support services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Compliance and Quality Assurance</h2>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">5.1 NDIS Compliance</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              All platform operations comply with NDIS Quality and Safeguards Commission requirements. 
              Users must adhere to NDIS Code of Conduct and relevant practice standards.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">5.2 Document Management</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Users are responsible for maintaining current documentation and certifications. 
              Expired or invalid documents may result in service restrictions or account suspension.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">5.3 Incident Reporting</h3>
            <p className="text-gray-700 leading-relaxed">
              All incidents, complaints, or safeguarding concerns must be reported through the platform immediately. 
              We maintain incident reporting procedures in compliance with NDIS Commission requirements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Financial Terms</h2>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">6.1 Payment Processing</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Nurova Australia processes payments between participants/plan managers and support workers. 
              All invoicing complies with NDIS pricing arrangements and SCHADS Award requirements where applicable.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">6.2 Platform Fees</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Platform service fees are transparently disclosed and may be charged to support workers or included in service rates. 
              Fee structures are available in your account dashboard and may be updated with 30 days notice.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">6.3 Refunds and Disputes</h3>
            <p className="text-gray-700 leading-relaxed">
              Payment disputes must be raised within 30 days of service delivery. 
              Refund eligibility is determined based on service delivery, documentation, and NDIS guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. User Conduct and Responsibilities</h2>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">7.1 Prohibited Activities</h3>
            <p className="text-gray-700 leading-relaxed mb-2">Users must not:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
              <li>Violate any laws, regulations, or NDIS requirements</li>
              <li>Provide false or misleading information</li>
              <li>Circumvent platform processes or attempt direct payment arrangements</li>
              <li>Harass, discriminate against, or abuse other users</li>
              <li>Share login credentials or access others' accounts</li>
              <li>Upload malicious software or attempt to compromise platform security</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">7.2 Professional Standards</h3>
            <p className="text-gray-700 leading-relaxed">
              Support workers must maintain professional standards, respect participant dignity and choice, 
              and deliver services in accordance with their qualifications and NDIS practice standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Privacy and Data Protection</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your privacy is important to us. Our collection, use, and disclosure of personal information 
              is governed by our Privacy Policy, which complies with the Australian Privacy Principles under the Privacy Act 1988.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using our Service, you consent to the collection and use of information in accordance with our Privacy Policy. 
              Sensitive information is handled with additional protections as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Service and its original content, features, and functionality are owned by Nurova Australia Pty Ltd 
              and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Users retain ownership of content they upload but grant us necessary licenses to operate the platform 
              and provide services as described in these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the maximum extent permitted by Australian law, Nurova Australia shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including without limitation, loss of profits, 
              data, use, goodwill, or other intangible losses.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our total liability for any claims arising from or related to the Service shall not exceed 
              the amount paid by you to us in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may terminate or suspend your account and access to the Service immediately, without prior notice, 
              for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You may terminate your account at any time by contacting us. Upon termination, 
              your right to use the Service will cease immediately, but these Terms will remain in effect 
              regarding any outstanding obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Victoria, Australia, 
              without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service 
              shall be subject to the exclusive jurisdiction of the courts of Victoria, Australia.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, 
              we will provide at least 30 days notice prior to any new terms taking effect.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Your continued use of the Service after any such changes constitutes your acceptance of the new Terms. 
              If you do not agree to the new Terms, you must stop using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Nurova Australia Pty Ltd</strong></p>
                <p>Email: legal@nurova.com.au</p>
                <p>Phone: 1800 NUROVA (1800 687 682)</p>
                <p>Address: Melbourne, Victoria, Australia</p>
                <p>ABN: [To be assigned]</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Navigation */}
        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</Link>
            <Link to="/contact" className="text-blue-600 hover:text-blue-700">Contact Us</Link>
            <Link to="/help" className="text-blue-600 hover:text-blue-700">Help Center</Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default TermsOfService;