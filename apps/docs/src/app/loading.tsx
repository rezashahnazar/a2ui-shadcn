export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="shimmer-container space-y-8">
        <div className="shimmer shimmer-bg h-10 w-48 rounded-md bg-muted/60" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="shimmer shimmer-bg h-32 rounded-lg border border-border/50 bg-muted/30"
            />
          ))}
        </div>
        <div className="shimmer shimmer-bg h-64 rounded-lg border border-border/50 bg-muted/30" />
      </div>
    </div>
  );
}
