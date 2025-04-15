
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Flame, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

// Define form schema with Zod
const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: ""
    },
  });

  const handleSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account Created",
        description: "Your account has been created successfully. Please check your email for verification.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup Failed",
        description: error.message || "Could not create your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-pale-green/10 to-white p-4 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-success-green/5 to-light-green/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-mint-green/5 to-pale-green/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-success-green to-light-green flex items-center justify-center shadow-lg animate-glow">
              <Flame className="h-9 w-9 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold font-montserrat text-black mb-2 tracking-tight">
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Join Inspire Safety to manage training programs
          </p>
        </div>

        <Card className="backdrop-blur-sm border border-secondary/20 shadow-lg animate-scale-in">
          <CardHeader className="space-y-1 border-b border-secondary/20">
            <CardTitle className="text-xl text-black flex items-center gap-2">
              <User size={18} className="text-success-green" />
              Sign Up
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Create a new account to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="name" className="text-black/90 flex items-center gap-2">
                        <User size={14} className="text-success-green" />
                        Full Name
                      </Label>
                      <FormControl>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          className="bg-white/50 border-secondary/30 focus:border-success-green/50 focus:ring-success-green/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="email" className="text-black/90 flex items-center gap-2">
                        <Mail size={14} className="text-success-green" />
                        Email
                      </Label>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john.doe@example.com"
                          className="bg-white/50 border-secondary/30 focus:border-success-green/50 focus:ring-success-green/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="password" className="text-black/90 flex items-center gap-2">
                        <Lock size={14} className="text-success-green" />
                        Password
                      </Label>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="bg-white/50 border-secondary/30 focus:border-success-green/50 focus:ring-success-green/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-black/90 flex items-center gap-2">
                        <Lock size={14} className="text-success-green" />
                        Confirm Password
                      </Label>
                      <FormControl>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          className="bg-white/50 border-secondary/30 focus:border-success-green/50 focus:ring-success-green/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  variant="success"
                  animation="shine"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/" className="text-success-green hover:text-success-green/80 transition-colors">
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="border-t border-secondary/20 flex justify-center">
            <Link to="/" className="text-sm text-muted-foreground flex items-center gap-1 hover:text-success-green/80 transition-colors">
              <ArrowLeft size={14} />
              Back to Login
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
