import { Layout } from "@/components/layout/layout";
import { Link } from "wouter";
import { CONSENT_FORM_URL } from "@/lib/consent";

export default function Consent() {
  return (
    <Layout>
      <main className="flex flex-col w-full min-h-screen pt-32 pb-24 px-6 md:px-12 bg-background">
        <div className="max-w-3xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/15 text-foreground text-sm font-medium mb-6 border border-secondary/20">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            Consent
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6 tracking-tight">Consent Form</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Please complete this form before sharing your story with The Mouthpiece. It tells us how you are
            comfortable with your story being used. Once done, you can{" "}
            <Link href="/#share" className="text-primary underline">share your story here</Link>.
          </p>
          <div className="bg-card rounded-3xl border border-border/60 shadow-sm overflow-hidden">
            <iframe
              src={CONSENT_FORM_URL}
              title="The Mouthpiece consent form"
              className="w-full border-0"
              style={{ height: "1400px" }}
            >
              Loading...
            </iframe>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Form not loading?{" "}
            <a href={CONSENT_FORM_URL.replace("?embedded=true", "")} target="_blank" rel="noreferrer" className="text-primary underline">
              Open it in a new tab
            </a>.
          </p>
        </div>
      </main>
    </Layout>
  );
}
