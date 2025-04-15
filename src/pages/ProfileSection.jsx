
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ProfileSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState({
    email: "",
    name: "",
    role: "",
    phone: "",
    bio: "",
    avatarUrl: ""
  });
  const { toast } = useToast();

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        
        // Get current session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData?.session?.user) {
          const user = sessionData.session.user;
          
          // Get profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            // PGRST116 is not found, which is fine for a new user
            throw profileError;
          }

          // Handle possibly null profileData with defaults
          setUserProfile({
            email: user.email || "",
            name: profileData?.name || user.user_metadata?.name || "",
            role: profileData?.role || "User",
            phone: profileData?.phone || "",
            bio: profileData?.bio || "",
            avatarUrl: profileData?.avatar_url || ""
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile information",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [toast]);

  const handleProfileUpdate = async () => {
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error("Not authenticated");
      
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: userProfile.name,
          bio: userProfile.bio,
          phone: userProfile.phone,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
      
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 2MB",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      // Upload file
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
        
      const avatarUrl = data.publicUrl;
      
      // Update profile with avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });
        
      if (updateError) throw updateError;
      
      setUserProfile({
        ...userProfile,
        avatarUrl
      });
      
      toast({
        title: "Avatar Updated",
        description: "Your profile picture has been updated"
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Upload Failed",
        description: error.message || "Could not upload profile picture",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserProfile({
      ...userProfile,
      [id]: value
    });
  };

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-5">
      <Card className="elegant-card overflow-hidden col-span-2">
        <CardHeader className="border-b border-white/5 bg-card/80">
          <CardTitle className="text-lg font-semibold text-white">Profile Picture</CardTitle>
          <CardDescription>Update your photo and personal details</CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex flex-col items-center">
          <Avatar className="h-24 w-24 border-2 border-white/10 mb-4">
            {userProfile.avatarUrl ? (
              <AvatarImage src={userProfile.avatarUrl} alt="Profile" />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-safety-orange to-accent text-white text-xl">
                {userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase() || "U"}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={() => document.getElementById('avatar-upload')?.click()}>
              Upload New
            </Button>
            <input 
              id="avatar-upload" 
              type="file" 
              className="hidden" 
              accept="image/png, image/jpeg, image/gif"
              onChange={handleAvatarUpload}
            />
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Allowed formats: JPG, PNG, GIF. Maximum size: 2MB
          </p>
        </CardContent>
      </Card>

      <Card className="elegant-card overflow-hidden col-span-3">
        <CardHeader className="border-b border-white/5 bg-card/80">
          <CardTitle className="text-lg font-semibold text-white">Personal Information</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleProfileUpdate(); }}>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={userProfile.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={userProfile.email}
                disabled
                className="opacity-70"
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed directly. Please contact support.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={userProfile.phone}
                  onChange={handleInputChange}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input 
                  id="role" 
                  value={userProfile.role}
                  disabled
                  className="opacity-70"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Write a short bio about yourself"
                className="resize-none"
                rows={4}
                value={userProfile.bio}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;
