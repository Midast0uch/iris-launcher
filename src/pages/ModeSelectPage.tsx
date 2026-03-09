import { User, Code2, ArrowRight } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LiquidIcon } from "@/components/dashboard/LiquidIcon";

const ModeSelectPage = () => {
  const { setMode } = useApp();
  const navigate = useNavigate();

  const handleSelect = (mode: "personal" | "developer") => {
    setMode(mode);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center mb-12">
          <div className="flex justify-center mb-5">
            <LiquidIcon color="primary" size="xl" bounce>
              <span className="font-mono text-xl font-bold text-primary">IR</span>
            </LiquidIcon>
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">Welcome to IRIS</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto tracking-wide">
            Choose how you'd like to use IRIS. You can change this later in settings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <motion.button
            onClick={() => handleSelect("personal")}
            className="group glass-card rounded-2xl p-7 text-left focus:outline-none focus:ring-2 focus:ring-primary/20"
            whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 20 } }}
            whileTap={{ scale: 0.98 }}
          >
            <LiquidIcon color="success" size="lg" bounce className="mb-5">
              <User className="h-6 w-6" />
            </LiquidIcon>
            <h3 className="text-base font-semibold text-foreground mb-1.5 tracking-tight">Personal Mode</h3>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed tracking-wide">
              Standard agent with curated skills. Network access is restricted by default. Ideal for daily use and personal tasks.
            </p>
            <div className="flex items-center gap-1 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>Select</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </motion.button>

          <motion.button
            onClick={() => handleSelect("developer")}
            className="group glass-card rounded-2xl p-7 text-left focus:outline-none focus:ring-2 focus:ring-accent/20"
            whileHover={{ y: -4, transition: { type: "spring", stiffness: 400, damping: 20 } }}
            whileTap={{ scale: 0.98 }}
          >
            <LiquidIcon color="accent" size="lg" bounce className="mb-5">
              <Code2 className="h-6 w-6" />
            </LiquidIcon>
            <h3 className="text-base font-semibold text-foreground mb-1.5 tracking-tight">Developer Mode</h3>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed tracking-wide">
              Full source access, git integration, diff review, and rebuild pipeline. Requires external drive for source verification.
            </p>
            <div className="flex items-center gap-1 text-xs font-mono text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>Select</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default ModeSelectPage;
