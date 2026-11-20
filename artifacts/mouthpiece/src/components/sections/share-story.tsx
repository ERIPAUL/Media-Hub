import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateStorySubmission } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mic, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CONSENT_FORM_URL, CONSENT_STORAGE_KEY } from "@/lib/consent";

const formSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  story: z.string().min(10, "Please share a brief summary of your story"),
  preferredContactMethod: z.enum(["email", "phone", "either"]),
});

export function ShareStory() {
  const { toast } = useToast();
  const createStory = useCreateStorySubmission();
  const [consentDone, setConsentDone] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(CONSENT_STORAGE_KEY) === "1") setConsentDone(true);
    } catch {}
  }, []);

  const confirmConsent = () => {
    try { localStorage.setItem(CONSENT_STORAGE_KEY, "1"); } catch {}
    setConsentDone(true);
    setConsentOpen(false);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      story: "",
      preferredContactMethod: "email",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createStory.mutate({ data }, {
      onSuccess: () => {
        toast({
          title: "Application Received",
          description: "Thank you for trusting us with your story. We will be in touch soon.",
        });
        form.reset();
      },
      onError: () => {
        toast({
          title: "Something went wrong",
          description: "Please check your information and try again.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <section id="share" className="py-24 md:py-32 bg-background border-b border-border/60">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
              <Mic className="w-4 h-4" />
              Be Our Guest
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">Share Your Story</h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Your voice matters. If you'd like to share your journey of grief and healing on The Mouthpiece, 
              please fill out the application below. This is a safe, dignified space.
            </p>
          </div>

          <div className="bg-card rounded-3xl shadow-sm border border-border/60 p-8 md:p-12 relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-[60px] pointer-events-none"></div>

            {!consentDone && (
              <div className="relative z-10 text-center py-8">
                <ShieldCheck className="w-10 h-10 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-serif font-bold text-foreground mb-3">Fill this form before sharing your story</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We ask everyone to complete a short consent form first. It takes a few minutes.
                </p>
                <Button size="lg" className="rounded-full h-12 px-8 text-white" onClick={() => setConsentOpen(true)}>
                  Fill the consent form
                </Button>
                <div className="mt-4">
                  <button type="button" className="text-sm text-muted-foreground underline" onClick={confirmConsent}>
                    I have already filled it
                  </button>
                </div>
              </div>
            )}

            <Dialog open={consentOpen} onOpenChange={setConsentOpen}>
              <DialogContent className="max-w-2xl w-[95vw] max-h-[92vh] flex flex-col">
                <DialogHeader>
                  <DialogTitle className="font-serif">Consent form</DialogTitle>
                  <DialogDescription>Fill this form before sharing your story, then tap the button below.</DialogDescription>
                </DialogHeader>
                <iframe src={CONSENT_FORM_URL} title="The Mouthpiece consent form" className="w-full flex-1 min-h-[55vh] border-0 rounded-lg" />
                <Button className="rounded-full text-white" onClick={confirmConsent}>I have filled the form</Button>
              </DialogContent>
            </Dialog>

            {consentDone && (<Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold">Full Name</FormLabel>
                        <FormControl>
                          <Input className="h-12 bg-background border-border/60 focus-visible:ring-primary rounded-xl" placeholder="Jane Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold">Email Address</FormLabel>
                        <FormControl>
                          <Input className="h-12 bg-background border-border/60 focus-visible:ring-primary rounded-xl" type="email" placeholder="jane@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-semibold">Phone Number <span className="text-muted-foreground font-normal">(Optional)</span></FormLabel>
                        <FormControl>
                          <Input className="h-12 bg-background border-border/60 focus-visible:ring-primary rounded-xl" type="tel" placeholder="+1 (555) 000-0000" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferredContactMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormLabel className="text-foreground font-semibold">Preferred Contact Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-wrap gap-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0 bg-background border border-border/60 px-4 py-2.5 rounded-lg cursor-pointer hover:border-primary/40 transition-colors">
                              <FormControl>
                                <RadioGroupItem value="email" className="text-primary border-primary" />
                              </FormControl>
                              <FormLabel className="font-medium cursor-pointer m-0">Email</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0 bg-background border border-border/60 px-4 py-2.5 rounded-lg cursor-pointer hover:border-primary/40 transition-colors">
                              <FormControl>
                                <RadioGroupItem value="phone" className="text-primary border-primary" />
                              </FormControl>
                              <FormLabel className="font-medium cursor-pointer m-0">Phone</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0 bg-background border border-border/60 px-4 py-2.5 rounded-lg cursor-pointer hover:border-primary/40 transition-colors">
                              <FormControl>
                                <RadioGroupItem value="either" className="text-primary border-primary" />
                              </FormControl>
                              <FormLabel className="font-medium cursor-pointer m-0">Either</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="story"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold">Tell Us About Your Story</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Briefly describe your experience and what you'd like to share..." 
                          className="min-h-32 resize-y bg-background border-border/60 focus-visible:ring-primary rounded-xl p-4" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="w-full rounded-full h-14 text-base font-semibold bg-primary hover:bg-primary/90 text-white transition-all shadow-md hover:shadow-lg" disabled={createStory.isPending}>
                  {createStory.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  Apply to Share Your Story
                </Button>
              </form>
            </Form>)}
          </div>
        </div>
      </div>
    </section>
  );
}