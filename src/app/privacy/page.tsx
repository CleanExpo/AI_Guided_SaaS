import React from 'react';
export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div className="prose max-w-none">
          <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
          <p className="mb-4">We collect information to provide better services:
          <ul className="list-disc ml-6 space-y-2">
          <li>Account information when you register</li>
            <li>Project data and application code</li>
            <li>Usage data and analytics</li>
            <li>Communication data when you contact us</li>
          
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to:
          <ul className="list-disc ml-6 space-y-2">
          <li>Provide and maintain our services</li>
            <li>Improve user experience</li>
            <li>Send important updates</li>
            <li>Ensure security and prevent fraud</li>
          
        
      
    
  );
}