import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

function extractYoutubeId(url) {
  if (!url) return null;
  
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  
  return (match && match[2].length === 11) ? match[2] : null;
}

interface EpisodeFormProps {
  isEdit?: boolean;
}

interface FormData {
  title: string;
  date: string;
  speaker: string;
  speakerRole: string;
  thumbnail: string;
  duration: string;
  summary: string;
  videoId: string;
  topics: string;
}

const initialFormData: FormData = {
  title: "",
  date: "",
  speaker: "",
  speakerRole: "",
  thumbnail: "",
  duration: "",
  summary: "",
  videoId: "",
  topics: "",
};

const EpisodeForm: React.FC<EpisodeFormProps> = ({ isEdit = false }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchLoading, setFetchLoading] = useState(isEdit);
  const [summarizing, setSummarizing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!isEdit || !id) {
      // for new episodes, set today's date by default
      setFormData(prev => ({...prev, date: today}));
      return;
    }

    const fetchEpisode = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_API_URL}/episodes/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        const data = await response.json();

        if (data.success) {
          // format date from API to YYYY-MM-DD for input
          const apiDate = new Date(data.data.date);
          const formattedDate = apiDate.toISOString().split('T')[0];

          setFormData({
            title: data.data.title,
            date: formattedDate,
            speaker: data.data.speaker,
            speakerRole: data.data.speakerRole,
            thumbnail: data.data.thumbnail,
            duration: data.data.duration,
            summary: data.data.summary,
            videoId: data.data.videoId,
            topics: data.data.topics ? data.data.topics.join(", ") : "",
          });
        } else {
          setError("Failed to fetch episode");
          toast({
            title: "Error",
            description: "Failed to fetch episode details",
            variant: "destructive",
          });
        }
      } catch (err) {
        setError("Error connecting to the server");
        toast({
          title: "Error",
          description: "Failed to connect to the server",
          variant: "destructive",
        });
        console.error(err);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchEpisode();
  }, [id, isEdit, toast, today]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert comma-separated topics to array
      const topicsArray = formData.topics
        .split(",")
        .map((topic) => topic.trim())
        .filter((topic) => topic);

      const token = localStorage.getItem("token");
      const url = isEdit
        ? `${import.meta.env.VITE_API_URL}/episodes/${id}`
        : `${import.meta.env.VITE_API_URL}/episodes`;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          ...formData,
          topics: topicsArray,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: isEdit 
            ? "Episode updated successfully" 
            : "New episode created successfully",
        });
        navigate("/admin/episodes");
      } else {
        setError(data.error || "Failed to save episode");
        toast({
          title: "Error",
          description: data.error || "Failed to save episode",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("Error connecting to the server");
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Function to generate summary from YouTube transcript using Gemini API
  const handleGenerateSummary = async () => {
    const videoId = extractYoutubeId(formData.videoId);
    
    if (!videoId) {
      toast({
        title: "Invalid YouTube Video ID",
        description: "Please enter a valid YouTube video ID or URL",
        variant: "destructive",
      });
      return;
    }

    setSummarizing(true);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/episodes/generate-summary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ videoId }),
      });

      const data = await response.json();

      if (data.success && data.data.summary) {
        setFormData(prev => ({
          ...prev,
          summary: data.data.summary
        }));
        
        toast({
          title: "Summary Generated",
          description: "The summary has been successfully created and added to the form",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to generate summary. Make sure the video has captions available.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to connect to the server",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setSummarizing(false);
    }
  };

  if (fetchLoading) {
    return <div className="text-center py-10">Loading episode data...</div>;
  }

  return (
    <div className="space-y-6">
      <Button 
        variant="outline" 
        className="gap-2"
        onClick={() => navigate("/admin/episodes")}
      >
        <ArrowLeft size={16} />
        Back to Episodes
      </Button>

      <h1 className="text-3xl font-bold tracking-tight">
        {isEdit ? "Edit Episode" : "Create New Episode"}
      </h1>

      <Card>
        <CardContent className="pt-6">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="duration">Duration (e.g. "22:15")</Label>
                  <Input
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="MM:SS"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="speaker">Speaker Name</Label>
                  <Input
                    id="speaker"
                    name="speaker"
                    value={formData.speaker}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="speakerRole">Speaker Role</Label>
                  <Input
                    id="speakerRole"
                    name="speakerRole"
                    value={formData.speakerRole}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="videoId">Video ID</Label>
                <Input
                  id="videoId"
                  name="videoId"
                  value={formData.videoId}
                  onChange={handleChange}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  YouTube video Link or ID (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or "dQw4w9WgXcQ")
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="topics">Topics (comma-separated)</Label>
                <Input
                  id="topics"
                  name="topics"
                  value={formData.topics}
                  onChange={handleChange}
                  placeholder="AI, Technology, Future"
                  required
                />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="summary">Summary</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateSummary}
                    disabled={summarizing || !formData.videoId}
                    className="flex items-center gap-1"
                  >
                    <Sparkles size={16} />
                    {summarizing ? "Generating..." : "Create Summary"}
                  </Button>
                </div>
                <Textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows={5}
                  required
                />
                {summarizing && (
                  <p className="text-sm text-muted-foreground">
                    Fetching transcript and generating summary... This may take a moment.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/episodes")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : isEdit ? "Update Episode" : "Create Episode"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EpisodeForm;