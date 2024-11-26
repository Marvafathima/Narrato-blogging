import React from 'react';
import { 
  Typography, 
  Button, 
  Card, 
  CardBody, 
  CardHeader 
} from "@material-tailwind/react";
import { 
  PencilIcon, 
  ShareIcon, 
  ChartBarIcon, 
  CloudIcon 
} from "@heroicons/react/24/solid";
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
const LandingPage = () => {
    const navigate=useNavigate();
    const handleNavigate = () => {
        
        navigate('/signup');
    };
  return (
    <Layout>
    <div className="bg-orange-10">
      {/* Hero Section */}
      <div className="relative flex flex-col lg:flex-row items-center justify-between 
        px-4 py-16 mx-auto max-w-7xl lg:px-8">
        <div className="w-full lg:w-1/2 mb-12 lg:mb-0 pr-5">
          <Typography 
            variant="h1" 
            color="black" 
            className="mb-6 text-4xl md:text-5xl font-bold"
          >
            Streamline Your Blog Management
          </Typography>
          <Typography 
            variant="lead" 
            className="mb-8 text-deep_orange-500 text-lg"
          >
            Effortlessly create, manage, and grow your blog with our intuitive platform.
          </Typography>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
            onClick={()=>handleNavigate()}
              variant="filled" 
              color="deep-orange" 
              className="bg-deep_orange-500 hover:bg-deep_orange-600"
            >
              Get Started
            </Button>
            <Button 
             onClick={()=>handleNavigate()}
              variant="outlined" 
              color="deep-orange" 
              className="border-deep_orange-500 text-deep_orange-500"
            >
              Learn More
            </Button>
          </div>
        </div>
        
        {/* SVG Placeholder for Hero Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
        <img 
    src="/blog2.jpg" // Path to the image in the public folder
    alt="Blog Management Illustration" 
    className="w-full max-w-md h-auto"
  />
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-orange-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Typography 
            variant="h2" 
            color="black" 
            className="text-center mb-12 text-3xl md:text-4xl font-bold"
          >
            Powerful Features for Bloggers
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: <PencilIcon className="w-12 h-12 text-deep_orange-500"/>, 
                title: "Easy Writing", 
                description: "Intuitive editor with markdown support" 
              },
              { 
                icon: <ShareIcon className="w-12 h-12 text-ocean_green-100"/>, 
                title: "Social Sharing", 
                description: "Seamless integration with social platforms" 
              },
              { 
                icon: <ChartBarIcon className="w-12 h-12 text-deep_green"/>, 
                title: "Analytics", 
                description: "Comprehensive blog performance tracking" 
              },
              { 
                icon: <CloudIcon className="w-12 h-12 text-deep_orange-300"/>, 
                title: "Cloud Sync", 
                description: "Automatic backup and cross-device sync" 
              }
            ].map((feature, index) => (
              <Card 
                key={index} 
                className="bg-white shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader 
                  floated={false} 
                  className="flex justify-center items-center h-24 bg-transparent"
                >
                  {feature.icon}
                </CardHeader>
                <CardBody className="text-center">
                  <Typography variant="h5" color="black" className="mb-2">
                    {feature.title}
                  </Typography>
                  <Typography color="gray">
                    {feature.description}
                  </Typography>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-deep_orange-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Typography 
            variant="h2" 
            color="black" 
            className="mb-6 text-3xl md:text-4xl font-bold"
          >
            Ready to Transform Your Blogging Experience?
          </Typography>
          <Typography 
            variant="lead" 
            className="mb-8 text-deep_orange-700"
          >
            Join thousands of bloggers who have simplified their content management.
          </Typography>
          <div className="flex justify-center space-x-4">
            {/* <Button 
              variant="filled" 
              color="deep-orange" 
              size="lg"
              className="bg-deep_orange-500 hover:bg-deep_orange-600"
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outlined" 
              color="deep-orange" 
              size="lg"
              className="border-deep_orange-500 text-deep_orange-500"
            >
              Contact Sales
            </Button> */}
          </div>
        </div>
      </div>
    </div></Layout>
  );
};

export default LandingPage;