import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="min-h-screen relative flex items-center justify-center px-6 md:px-10 pt-24 pb-20 overflow-hidden">
      {/* Background gradient and patterns */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/30 to-background z-0"></div>
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto z-10 w-full flex justify-center">
        <div className="flex flex-col items-center text-center">
          <div className="flex flex-col items-center space-y-12 animate-fade-in [animation-delay:0.2s] opacity-0" style={{animationFillMode: 'forwards'}}>
            {/* Label */}
            <div className="inline-flex items-center space-x-3">
              <div className="h-[1.5px] w-14 bg-primary"></div>
              <span className="text-base font-medium text-primary">2025</span>
            </div>
            
            {/* Main heading */}
            <h1 className="elegant-title text-6xl md:text-7xl lg:text-8xl leading-tight">
              Ideas that <br />
              <span className="text-primary font-normal">shape tomorrow</span>
            </h1>
            
            {/* Description */}
            <p className="text-xl text-foreground/70 max-w-2xl leading-relaxed">
              Join us for thought-provoking conversations with leading thinkers
              and innovators who are redefining our world through their ideas
              and expertise.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-6 pt-6">
              <Button asChild size="lg" className="rounded-full px-10 py-7 text-lg hover:scale-105 transition-transform">
                <Link to="/episodes">
                  Watch Episodes
                  <ArrowRight size={20} className="ml-3" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-10 py-7 text-lg hover:shadow-md transition-all">
                <Link to="/speakers">
                  Meet Our Speakers
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
