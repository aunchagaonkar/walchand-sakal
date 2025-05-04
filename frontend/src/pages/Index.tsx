import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/ui/HeroSection";
import FeaturedTalk from "@/components/ui/FeaturedTalk";
import SpeakerCard from "@/components/ui/SpeakerCard";
import NewsletterSubscription from "@/components/ui/newsletter/NewsletterSubscription";

// Create interfaces for data
interface FeaturedTalkType {
  _id: string;
  title: string;
  speaker: string;
  speakerRole: string;
  thumbnail: string;
  duration: string;
  featured: boolean;
}

interface FeaturedSpeakerType {
  _id: string;
  name: string;
  role: string;
  organization: string;
  image: string;
  bio: string;
  topics?: string[];
}

const Index = () => {
  const [featuredTalks, setFeaturedTalks] = useState<FeaturedTalkType[]>([]);
  const [featuredSpeakers, setFeaturedSpeakers] = useState<FeaturedSpeakerType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured talks
        const talksResponse = await fetch(`${import.meta.env.VITE_API_URL}/featured-talks`);
        const talksResult = await talksResponse.json();
        
        // Fetch featured speakers
        const speakersResponse = await fetch(`${import.meta.env.VITE_API_URL}/featured-speakers`);
        const speakersResult = await speakersResponse.json();
        
        if (talksResult.success && speakersResult.success) {
          setFeaturedTalks(talksResult.data);
          setFeaturedSpeakers(speakersResult.data);
        } else {
          setError("Failed to fetch data");
        }
      } catch (err) {
        setError("Error connecting to the server");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Featured Talks Section */}
        <section className="py-20 px-6 md:px-10 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-medium">Featured Talks</h2>
                <p className="text-foreground/70 mt-4 max-w-2xl">
                  Discover our curated collection of the most insightful and impactful 
                  conversations from leading thinkers around the world.
                </p>
              </div>
              <Link 
                to="/episodes" 
                className="inline-flex items-center text-primary font-medium mt-6 md:mt-0 group"
              >
                View All Episodes
                <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-lg overflow-hidden shadow-md bg-secondary/20 animate-pulse h-64"></div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-red-500">
                Failed to load featured talks. Please try again later.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredTalks.map((talk, index) => (
                  <FeaturedTalk
                    key={talk._id}
                    id={talk._id}
                    title={talk.title}
                    speaker={talk.speaker}
                    speakerRole={talk.speakerRole}
                    thumbnail={talk.thumbnail}
                    duration={talk.duration}
                    featured={talk.featured}
                    delay={index * 100}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Speakers Section */}
        <section className="py-20 px-6 md:px-10 bg-secondary/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-medium">Meet Our Speakers</h2>
                <p className="text-foreground/70 mt-4 max-w-2xl">
                  Our speakers are visionaries, pioneers, and thought leaders who are 
                  pushing boundaries and redefining what's possible.
                </p>
              </div>
              <Link 
                to="/speakers" 
                className="inline-flex items-center text-primary font-medium mt-6 md:mt-0 group"
              >
                View All Speakers
                <ArrowRight size={18} className="ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg p-6 shadow-md animate-pulse h-80"></div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-red-500">
                Failed to load featured speakers. Please try again later.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredSpeakers.map((speaker, index) => (
                  <SpeakerCard
                    key={speaker._id}
                    id={speaker._id}
                    name={speaker.name}
                    role={speaker.role}
                    organization={speaker.organization}
                    image={speaker.image}
                    bio={speaker.bio}
                    topics={speaker.topics || []}
                    delay={index * 100}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Newsletter Subscription Section */}
        <section className="py-20 px-6 md:px-10 bg-white">
          <div className="max-w-5xl mx-auto">
            <NewsletterSubscription />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
