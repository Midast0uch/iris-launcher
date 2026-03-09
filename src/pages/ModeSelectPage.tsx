import { User, Code2, ArrowRight } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";

const ModeSelectPage = () => {
  const { setMode } = useApp();
  const navigate = useNavigate();

  const handleSelect = (mode: "personal" | "developer") => {
    setMode(mode);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 grid-pattern scanline">
      <div className="w-full max-w-2xl animate-enter">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center glow-primary">
              <span className="font-mono text-xl font-bold text-primary">IR</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome to IRIS</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Choose how you'd like to use IRIS. You can change this later in settings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Personal Mode */}
          <button
            onClick={() => handleSelect("personal")}
            className="group glass rounded-2xl p-6 text-left transition-all hover:bg-[hsl(230_15%_14%/0.55)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.1)] focus:outline-none"
          >
            <div className="h-12 w-12 rounded-lg bg-success/15 border border-success/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <User className="h-6 w-6 text-success" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">Personal Mode</h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Standard agent with curated skills. Network access is restricted by default. Ideal for daily use and personal tasks.
            </p>
            <div className="flex items-center gap-1 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Select</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </button>

          {/* Developer Mode */}
          <button
            onClick={() => handleSelect("developer")}
            className="group bg-card rounded-xl border border-border p-6 text-left transition-all hover:border-accent/50 hover:shadow-[0_0_20px_hsl(var(--accent)/0.15)] focus:outline-none focus:border-accent"
          >
            <div className="h-12 w-12 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Code2 className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">Developer Mode</h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              Full source access, git integration, diff review, and rebuild pipeline. Requires external drive for source verification.
            </p>
            <div className="flex items-center gap-1 text-xs font-mono text-accent opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Select</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModeSelectPage;
