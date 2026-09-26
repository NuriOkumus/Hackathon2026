import Header from "@/components/Header";
import ProgramFlow from "@/components/ProgramFlow";
import Footer from "@/components/Footer";

export default function ProgramPage() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      <Header />
      <div className="pt-24">
        <ProgramFlow />
      </div>
      <Footer />
    </main>
  );
}
