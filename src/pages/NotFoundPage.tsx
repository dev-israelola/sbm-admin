import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-dvh grid place-items-center bg-bg">
      <div className="text-center">
        <p className="eyebrow">404</p>
        <h1 className="font-display text-2xl mt-1 text-ink">Page not found.</h1>
        <Button asChild className="mt-6">
          <Link to="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
