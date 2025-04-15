
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Flame, Lock, Mail, Shield, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

// Define form schema with Zod
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().default(false),
});

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "You've successfully logged in!",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Please check your credentials and try again",
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
            Inspire Safety
          </h1>
          <p className="text-muted-foreground">
            Admin Dashboard for Safety Training Management
          </p>
        </div>

        <Card className="backdrop-blur-sm border border-secondary/20 shadow-lg animate-scale-in">
          <CardHeader className="space-y-1 border-b border-secondary/20">
            <CardTitle className="text-xl text-black flex items-center gap-2">
              <Shield size={18} className="text-success-green" />
              Sign in
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                          placeholder="admin@inspiresafety.org"
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
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-black/90 flex items-center gap-2">
                          <Lock size={14} className="text-success-green" />
                          Password
                        </Label>
                        <a
                          href="#"
                          className="text-xs text-success-green hover:text-success-green/80 transition-colors"
                        >
                          Forgot Password?
                        </a>
                      </div>
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
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          id="remember"
                          className="border-secondary/40 data-[state=checked]:bg-success-green/90"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <Label
                        htmlFor="remember"
                        className="text-sm font-normal text-black/80"
                      >
                        Remember me for 30 days
                      </Label>
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
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
                <div className="relative flex items-center justify-center my-2">
                  <div className="absolute border-t border-secondary/20 w-full"></div>
                  <div className="relative bg-white px-4 text-xs text-muted-foreground">or</div>
                </div>
                <Link to="/signup">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full flex gap-2"
                  >
                    <UserPlus size={16} />
                    Create New Account
                  </Button>
                </Link>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="border-t border-secondary/20">
            <p className="text-center text-sm text-muted-foreground w-full">
              Need more info?{" "}
              <a href="#" className="text-success-green hover:text-success-green/80 transition-colors">
                Contact support
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Index;
