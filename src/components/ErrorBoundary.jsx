
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = { hasError: false };
  }

 
  static getDerivedStateFromError(error) {
  
    return { hasError: true };
  }

  
  componentDidCatch(error, errorInfo) {
 
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">
              Something went wrong.
            </h1>
            <p className="text-gray-600">
              Please refresh the page or try again later.
            </p>
          </div>
        </div>
      );
    }

    
    return this.props.children; 
  }
}

export default ErrorBoundary;