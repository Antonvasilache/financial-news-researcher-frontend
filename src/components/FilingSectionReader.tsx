import { useState, useMemo } from "react";
import type { ParsedSecFilingResponse, FilingSection } from "../types/sec";

interface FilingSectionReaderProps {
  filing: ParsedSecFilingResponse;
}

export const FilingSectionReader = ({ filing }: FilingSectionReaderProps) => {
  const sections = useMemo(() => {
    return Object.values(filing.sections || {});
  }, [filing.sections]);

  const [activeTabKey, setActiveTabKey] = useState<string>(() => {
    if (sections.length > 0) return sections[0].item_id;
    return "raw_preview";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);

  // Update active tab when filing changes if current tab doesn't exist
  const activeSection: FilingSection | undefined = sections.find(
    (s) => s.item_id === activeTabKey
  );

  const isRawPreview = activeTabKey === "raw_preview";
  const activeContent = isRawPreview
    ? filing.raw_text_preview || "No raw text preview available."
    : activeSection?.content || "No content found for this section.";

  const activeTitle = isRawPreview
    ? "Raw Document Text Preview"
    : activeSection?.title || "Filing Section";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard write failure
    }
  };

  const renderHighlightedContent = (text: string, query: string) => {
    if (!query.trim()) {
      return text;
    }
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="search-highlight">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="filing-reader-container" data-testid="filing-section-reader">
      <div className="reader-sidebar">
        <h4>Filing Sections ({sections.length})</h4>
        <nav className="reader-section-list" aria-label="Filing sections">
          {sections.map((section) => (
            <button
              key={section.item_id}
              type="button"
              className={`section-nav-btn ${activeTabKey === section.item_id ? "active" : ""}`}
              onClick={() => setActiveTabKey(section.item_id)}
            >
              <div className="section-btn-title">{section.title}</div>
              <span className="section-btn-count">
                {section.character_count?.toLocaleString() || section.content.length.toLocaleString()} chars
              </span>
            </button>
          ))}
          <button
            type="button"
            className={`section-nav-btn ${isRawPreview ? "active" : ""}`}
            onClick={() => setActiveTabKey("raw_preview")}
          >
            <div className="section-btn-title">Raw Text Preview</div>
            <span className="section-btn-count">
              {filing.raw_text_preview?.length.toLocaleString() || 0} chars
            </span>
          </button>
        </nav>
      </div>

      <div className="reader-content-panel">
        <div className="reader-toolbar">
          <div className="reader-header-info">
            <h3>{activeTitle}</h3>
            <span className="reader-char-badge">
              {activeContent.length.toLocaleString()} characters
            </span>
          </div>

          <div className="reader-actions">
            <input
              type="search"
              placeholder="Search in this section..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="reader-search-input"
              aria-label="Search within section"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="reader-action-btn"
              title="Copy to clipboard"
            >
              {copied ? "✓ Copied" : "📋 Copy"}
            </button>
          </div>
        </div>

        <div className="reader-body">
          <pre className="reader-text-viewport" tabIndex={0}>
            {renderHighlightedContent(activeContent, searchQuery)}
          </pre>
        </div>
      </div>
    </div>
  );
};
