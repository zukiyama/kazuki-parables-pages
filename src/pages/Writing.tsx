import Navigation from "@/components/Navigation";

const Writing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading text-5xl font-bold text-ink-black mb-8">
            Writing
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="font-body text-xl text-muted-foreground leading-relaxed">
              Content coming soon...
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-card border-t border-border py-12 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-muted-foreground">
            Email: contact@kazukiyamakawa.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Writing;