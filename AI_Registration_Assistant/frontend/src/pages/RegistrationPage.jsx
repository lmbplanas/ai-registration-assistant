import { Helmet } from 'react-helmet-async';
import RegisterForm from '../components/RegisterForm';
import AIAssistant from '../components/AIAssistant';

const RegistrationPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Company Registration | AI Registration Assistant</title>
        <meta name="description" content="Register your company with our AI-powered registration assistant" />
      </Helmet>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Company Registration
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Register your company to get started with our services
          </p>
        </div>
        
        <div className="mt-10">
          <RegisterForm />
        </div>
      </div>
      
      {/* AI Assistant Floating Button */}
      <AIAssistant />
    </div>
  );
};

export default RegistrationPage;
