import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const NewsletterSubscription = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setEmail("");
        toast({
          title: "Success!",
          description: "Thank you for subscribing to our newsletter!",
        });
      } else {
        throw new Error(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to subscribe. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-medium text-center">Subscribe to our Newsletter</h2>
      <p className="text-foreground/70 mt-4 text-center">
        Get the latest updates on upcoming lectures, speaker announcements, and exclusive content.
      </p>
      
      {success ? (
        <div className="mt-8 bg-primary/10 p-6 rounded-lg text-center">
          <h3 className="font-medium text-lg">Thank you for subscribing!</h3>
          <p className="mt-2">You've been added to our newsletter. We're excited to share our upcoming events with you.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="email" 
                placeholder="Enter your email address"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </div>
        </form>
      )}
      
      <p className="text-xs text-center mt-4 text-muted-foreground">
        By subscribing, you agree to receive email communications from us.
        You can unsubscribe at any time.
      </p>
    </div>
  );
};

export default NewsletterSubscription;