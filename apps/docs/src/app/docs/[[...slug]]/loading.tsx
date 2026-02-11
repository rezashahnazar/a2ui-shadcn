export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="shimmer-container">
        <div className="mb-8 flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="shimmer shimmer-bg h-5 w-20 rounded bg-muted/60" />
          ))}
        </div>
        <article className="space-y-6">
          <div className="shimmer shimmer-bg h-10 w-64 rounded-md bg-muted/60" />
          <div className="space-y-4">
            <div className="shimmer shimmer-bg h-4 w-full rounded bg-muted/40" />
            <div className="shimmer shimmer-bg h-4 w-[80%] rounded bg-muted/40" />
            <div className="shimmer shimmer-bg h-4 w-3/4 rounded bg-muted/40" />
          </div>
          <div className="shimmer shimmer-bg mt-8 h-48 rounded-lg border border-border bg-muted/30" />
        </article>
      </div>
    </div>
  );
}
