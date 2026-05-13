export function MapsTutorial() {
  const steps = [
    {
      n: "1",
      emoji: "🔍",
      title: "Open Google Maps",
      desc: 'Search for your gym name on maps.google.com or the Google Maps app',
    },
    {
      n: "2",
      emoji: "📍",
      title: "Open your gym's listing",
      desc: "Click on your gym from the search results to open the full listing",
    },
    {
      n: "3",
      emoji: "🔗",
      title: 'Tap "Share"',
      desc: 'Click the Share button → then "Copy link". On mobile: tap ⋮ → Share',
    },
    {
      n: "4",
      emoji: "📋",
      title: "Paste the link here",
      desc: 'The link looks like: maps.app.goo.gl/XYZ or google.com/maps/place/...',
    },
  ]

  return (
    <div className="bg-gray-950 p-5 space-y-3">
      {steps.map(({ n, emoji, title, desc }, i) => (
        <div key={n} className="flex items-start gap-4">
          <div className="flex flex-col items-center shrink-0">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-black">
              {n}
            </div>
            {i < steps.length - 1 && (
              <div className="w-px h-5 bg-gray-700 mt-1" />
            )}
          </div>
          <div className="pt-1 pb-2 min-w-0">
            <p className="text-white text-sm font-bold leading-tight">
              <span className="mr-1.5">{emoji}</span>{title}
            </p>
            <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{desc}</p>
          </div>
        </div>
      ))}

      <div className="mt-2 rounded-xl bg-gray-800 border border-gray-700 px-4 py-3">
        <p className="text-[11px] text-gray-400 mb-1 font-medium">Example link</p>
        <p className="text-green-400 text-xs font-mono break-all">maps.app.goo.gl/AbCdEfGhIjK</p>
      </div>
    </div>
  )
}
