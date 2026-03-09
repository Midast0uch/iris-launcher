import { Github, ArrowRight } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/dashboard/PageTransition";

interface GitHubGateProps {
  children: React.ReactNode;
}

const GitHubGate = ({ children }: GitHubGateProps) => {
  const { gitHubConnected } = useApp();
  const navigate = useNavigate();

  if (gitHubConnected) {
    return <>{children}</>;
  }

  return (
    <PageTransition>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass rounded-2xl p-10 max-w-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl glass-subtle flex items-center justify-center mx-auto">
            <Github className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">GitHub Connection Required</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connect your GitHub account first to access Git source control and diff review features.
            </p>
          </div>
          <Button
            onClick={() => navigate("/developer/github")}
            className="font-mono text-xs gap-2"
          >
            <Github className="h-4 w-4" />
            Connect GitHub
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default GitHubGate;
