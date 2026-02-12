export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="shimmer-container">
        <div className="shimmer shimmer-bg mb-6 h-8 w-64 rounded-md bg-muted/60" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col">
            <div className="shimmer shimmer-bg mb-2 h-4 w-24 rounded bg-muted/60" />
            <div className="shimmer shimmer-bg h-[400px] min-h-[200px] rounded-lg border border-border bg-muted/20" />
          </div>
          <div className="flex flex-col">
            <div className="shimmer shimmer-bg mb-2 h-4 w-32 rounded bg-muted/60" />
            <div className="shimmer shimmer-bg h-[400px] min-h-[200px] rounded-lg border border-border bg-muted/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
