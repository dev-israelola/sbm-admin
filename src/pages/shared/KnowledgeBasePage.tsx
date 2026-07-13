import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { KNOWLEDGE_BASE, KnowledgeCategory, KnowledgeTopic } from "@/data/knowledge-base";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";

export function KnowledgeBasePage() {
  const user = useAuthStore((s) => s.user);
  
  // Filter categories by role
  const visibleCategories = KNOWLEDGE_BASE.filter(
    (cat) => cat.roles.length === 0 || (user?.role && cat.roles.map(r => r.toLowerCase()).includes(user.role.toLowerCase() as any))
  );

  const [activeCategory, setActiveCategory] = useState<string>(visibleCategories[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");

  const activeCatObj = visibleCategories.find((c) => c.id === activeCategory) || visibleCategories[0];

  // Search logic
  const normalizedQuery = searchQuery.toLowerCase().trim();
  const searchResults: { cat: KnowledgeCategory; topic: KnowledgeTopic }[] = [];
  if (normalizedQuery) {
    for (const cat of visibleCategories) {
      for (const topic of cat.topics) {
        if (topic.roles.length > 0 && !(user?.role && topic.roles.map(r => r.toLowerCase()).includes(user.role.toLowerCase() as any))) continue;
        if (
          topic.title.toLowerCase().includes(normalizedQuery) ||
          topic.excerpt.toLowerCase().includes(normalizedQuery)
        ) {
          searchResults.push({ cat, topic });
        }
      }
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Help & Resources"
        title="Knowledge Base"
        description="Comprehensive guides and operational manuals tailored perfectly to your administrative role."
      />

      <div className="mt-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
            <input
              type="text"
              placeholder="Search guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-line bg-surface py-2.5 pl-9 pr-3 text-[13px] text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          {!normalizedQuery && (
            <div className="space-y-1 sticky top-24">
              {visibleCategories.map((cat) => (
                <div key={cat.id} className="mb-2">
                  <button
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium transition-colors",
                      activeCategory === cat.id
                        ? "bg-accent/10 text-accent font-bold"
                        : "text-ink-muted hover:bg-surface-muted hover:text-ink"
                    )}
                  >
                    <cat.icon className="h-4 w-4" />
                    {cat.title}
                    {activeCategory !== cat.id && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
                  </button>
                  {activeCategory === cat.id && (
                    <div className="ml-9 mt-1 flex flex-col space-y-1 border-l border-line pl-3">
                       {cat.topics.filter(topic => topic.roles.length === 0 || (user?.role && topic.roles.map(r => r.toLowerCase()).includes(user.role.toLowerCase() as any))).map(topic => (
                          <button 
                            key={topic.id} 
                            onClick={() => {
                              const el = document.getElementById(topic.id);
                              if (el) {
                                // Add offset so header doesn't cover title
                                const y = el.getBoundingClientRect().top + window.scrollY - 100;
                                window.scrollTo({ top: y, behavior: 'smooth' });
                              }
                            }}
                            className="text-[12.5px] text-left text-ink-muted hover:text-accent py-1.5 px-2 rounded hover:bg-surface-muted transition-colors leading-relaxed"
                          >
                            {topic.title}
                          </button>
                       ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 bg-surface border border-line/70 rounded-xl px-8 py-10 shadow-sm">
          {normalizedQuery ? (
            <div className="space-y-8">
              <h2 className="font-display text-xl font-medium">Search Results ({searchResults.length})</h2>
              {searchResults.length === 0 ? (
                <div className="rounded-xl border border-line bg-surface p-8 text-center text-ink-muted">
                  No topics found matching "{searchQuery}". Try different keywords.
                </div>
              ) : (
                <div className="space-y-10">
                  {searchResults.map(({ cat, topic }) => (
                    <article key={topic.id} className="scroll-mt-20">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 text-[11px] font-medium text-accent uppercase tracking-wider mb-2">
                          <cat.icon className="h-3 w-3" />
                          <span>{cat.title}</span>
                        </div>
                        <h3 className="text-2xl font-display font-semibold text-ink leading-tight">{topic.title}</h3>
                        <p className="mt-3 text-ink-muted text-[15px] italic border-l-2 border-accent/40 pl-4 bg-accent/5 py-2.5 pr-2 rounded-r">{topic.excerpt}</p>
                      </div>
                      <div className="prose prose-sm md:prose-base prose-ink max-w-none prose-a:text-accent prose-headings:font-display prose-headings:font-medium">
                        {topic.content}
                      </div>
                      <hr className="mt-12 border-line/70" />
                    </article>
                  ))}
                </div>
              )}
            </div>
          ) : (
            activeCatObj && (
              <div className="space-y-12">
                <div className="border-b border-line pb-6">
                  <h2 className="text-3xl font-display font-bold text-ink leading-tight flex items-center gap-3">
                    <activeCatObj.icon className="h-8 w-8 text-accent/80" />
                    {activeCatObj.title}
                  </h2>
                  <p className="mt-3 text-ink-muted text-[15px] leading-relaxed">{activeCatObj.description}</p>
                </div>

                <div className="space-y-16">
                  {activeCatObj.topics
                    .filter((topic) => topic.roles.length === 0 || (user?.role && topic.roles.map(r => r.toLowerCase()).includes(user.role.toLowerCase() as any)))
                    .map((topic) => (
                      <article key={topic.id} id={topic.id} className="scroll-mt-20 group">
                        <div className="mb-6">
                          <h3 className="text-2xl font-display font-semibold text-ink group-hover:text-accent transition-colors">{topic.title}</h3>
                          <p className="mt-3 text-[15px] italic text-ink-muted border-l-2 border-accent/40 bg-accent/5 py-2.5 pr-2 pl-4 rounded-r">{topic.excerpt}</p>
                        </div>
                        <div className="prose prose-sm md:prose-base prose-ink max-w-none prose-a:text-accent prose-headings:font-display prose-headings:font-medium">
                          {topic.content}
                        </div>
                        <div className="mt-12 border-t border-line/50"></div>
                      </article>
                    ))}
                </div>
              </div>
            )
          )}
        </main>
      </div>
    </>
  );
}
