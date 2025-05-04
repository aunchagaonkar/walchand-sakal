import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Create interfaces for team member and stat data
interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
}

interface Stat {
  _id: string;
  label: string;
  value: string;
}

const About = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch team members
        const teamResponse = await fetch(`${import.meta.env.VITE_API_URL}/team`);
        const teamResult = await teamResponse.json();
        
        // Fetch stats
        const statsResponse = await fetch(`${import.meta.env.VITE_API_URL}/stats`);
        const statsResult = await statsResponse.json();
        
        if (teamResult.success && statsResult.success) {
          setTeamMembers(teamResult.data);
          setStats(statsResult.data);
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
      <main className="flex-1 pt-24 pb-20">
        {/* Hero Section */}
        <section className="bg-secondary/30 py-20 px-6 md:px-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium">About Lecture Series</h1>
              <p className="text-lg text-foreground/70 mt-6 leading-relaxed">
                Walchand-Sakal Lecture Series is a platform for the world's leading thinkers to share 
                their ideas that matter. Through our talks, we aim to inspire, educate, 
                and spark meaningful conversations that shape our collective future.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Mission */}
        <section className="py-20 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="inline-flex items-center space-x-2 mb-6">
                  <div className="h-[1px] w-10 bg-primary"></div>
                  <span className="text-sm font-medium text-primary">Our Mission</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-medium">Spreading powerful ideas that matter</h2>
                <p className="text-foreground/70 mt-6 leading-relaxed">
                  We believe that ideas have the power to change attitudes, lives, and 
                  ultimately, the world. Our mission is to discover and elevate the most 
                  important ideas being developed today and connect them with curious minds.
                </p>
                <p className="text-foreground/70 mt-4 leading-relaxed">
                  Through our carefully curated talks, we aim to provide a platform for 
                  visionaries across disciplines to share their insights, research, and 
                  innovation in an accessible and engaging format.
                </p>
                
                {loading ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="text-center">
                        <div className="h-10 bg-foreground/10 rounded animate-pulse"></div>
                        <div className="h-4 bg-foreground/10 rounded mt-2 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : error ? (
                  <div className="mt-12 text-red-500">
                    Failed to load stats. Please try again later.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                    {stats.map((stat) => (
                      <div key={stat._id} className="text-center">
                        <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                        <div className="text-sm text-foreground/70 mt-2">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent rounded-tl-xl"></div>
                  <img
                    src="https://res.cloudinary.com/dg2mm9fsw/image/upload/v1746339231/crmzd8wsici5a3pldtzt.jpg"
                    alt="A speaker giving a talk on stage"
                    className="rounded-xl w-full h-auto object-cover relative z-10 shadow-xl"
                  />
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-br-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-20 px-6 md:px-10 bg-secondary/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-medium">Our Values</h2>
              <p className="text-foreground/70 mt-4">
                These core principles guide everything we do at Walchand-Sakal Lecture Series.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Intellectual Curiosity",
                  description: "We foster a spirit of exploration and inquiry, challenging assumptions and embracing new perspectives."
                },
                {
                  title: "Accessibility",
                  description: "We believe knowledge should be accessible to all, presenting complex ideas in engaging and understandable ways."
                },
                {
                  title: "Diversity of Thought",
                  description: "We celebrate a wide range of perspectives, backgrounds, and disciplines to provide a comprehensive view of important topics."
                },
                {
                  title: "Rigorous Standards",
                  description: "We uphold high standards for intellectual integrity, fact-checking, and thoughtful presentation."
                },
                {
                  title: "Impact-Driven",
                  description: "We prioritize ideas that have the potential to create positive change in individuals, communities, and the world."
                },
                {
                  title: "Collaborative Spirit",
                  description: "We believe in the power of bringing together diverse thinkers to create solutions to our most pressing challenges."
                },
              ].map((value, index) => (
                <div 
                  key={value.title} 
                  className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full mb-4">
                    <span className="text-primary font-medium">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-medium mb-3">{value.title}</h3>
                  <p className="text-foreground/70">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-20 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-medium">Our Team</h2>
              <p className="text-foreground/70 mt-4">
                Meet the passionate developers who made the Walchand-Sakal Lecture Series website possible.
              </p>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="text-center">
                    <div className="w-32 h-32 mx-auto rounded-full bg-foreground/10 animate-pulse"></div>
                    <div className="h-6 bg-foreground/10 rounded mt-4 w-1/2 mx-auto animate-pulse"></div>
                    <div className="h-4 bg-foreground/10 rounded mt-2 w-3/4 mx-auto animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-red-500">
                Failed to load team data. Please try again later.
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <div className="flex flex-wrap justify-center gap-x-16 gap-y-12">
                  {teamMembers.map((member) => (
                    <div key={member._id} className="text-center w-[250px]">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-32 h-32 object-cover rounded-full mx-auto"
                      />
                      <h3 className="text-xl font-medium mt-4">{member.name}</h3>
                      <p className="text-foreground/70">{member.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-6 md:px-10 bg-primary/5">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-medium">Join us for our upcoming lectures</h2>
            <p className="text-foreground/70 mt-4 max-w-3xl mx-auto">
              Don't miss out on our next series of thought-provoking talks from leaders 
              in their fields. Register now to secure your spot.
            </p>
            <div className="mt-10">
              <Button asChild size="lg">
                <Link to="/episodes">
                  <span>Explore Episodes</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;
