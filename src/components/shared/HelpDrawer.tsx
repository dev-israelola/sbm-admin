import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useUIStore } from "@/store/ui-store";
import { KNOWLEDGE_BASE } from "@/data/knowledge-base";
import { useAuthStore } from "@/store/auth-store";
import { BookOpen } from "lucide-react";

export function HelpDrawer() {
  const open = useUIStore((s) => s.helpDrawerOpen);
  const setOpen = useUIStore((s) => s.setHelpDrawerOpen);
  const user = useAuthStore((s) => s.user);

  // Filter KB based on user roles
  const filteredKB = KNOWLEDGE_BASE.filter(
    (cat) => cat.roles.length === 0 || (user?.role && cat.roles.map(r => r.toLowerCase()).includes(user.role.toLowerCase() as any))
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <div className="px-6 py-4 border-b border-line bg-surface">
          <SheetTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4 text-accent" />
            Knowledge Base Quick Guide
          </SheetTitle>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <div className="rounded-xl border border-line bg-surface-muted p-4">
              <h3 className="font-semibold text-ink text-sm">Need deeper context?</h3>
              <p className="text-[13px] text-ink-muted mt-1 leading-relaxed">
                Explore the full-screen Knowledge Base for more detailed operational guides.
              </p>
              <Link
                to="/admin/guides"
                onClick={() => setOpen(false)}
                className="mt-4 block text-center rounded-lg bg-ink text-surface transition-opacity hover:opacity-90 py-2 text-[13px] font-medium"
              >
                Open Full Guides
              </Link>
            </div>

            <div className="space-y-6">
              {filteredKB.map((cat) => {
                const visibleTopics = cat.topics.filter(
                  topic => topic.roles.length === 0 || (user?.role && topic.roles.map(r => r.toLowerCase()).includes(user.role.toLowerCase() as any))
                );

                if (visibleTopics.length === 0) return null;

                return (
                  <div key={cat.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <cat.icon className="h-4 w-4 text-ink-muted" />
                      <h4 className="font-medium text-ink text-sm">{cat.title}</h4>
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      {visibleTopics.map((topic) => (
                        <AccordionItem key={topic.id} value={topic.id} className="border-line/50">
                          <AccordionTrigger className="text-[13px] text-ink hover:text-accent py-3 text-left">
                            {topic.title}
                          </AccordionTrigger>
                          <AccordionContent className="text-[14px] text-ink-muted prose-sm prose-p:leading-relaxed prose-a:text-accent max-w-none px-1">
                            {topic.content}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
