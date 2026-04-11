export default function DownloadLinksCard({
  pdfUrl,
  zipUrl,
  slideUrls = [],
  linkedinPostUrl,
}) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-10 rounded-[32px] border border-slate-200 bg-white shadow-lg p-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-6">
        Download Assets
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl bg-slate-900 text-white px-6 py-4 font-semibold text-center"
        >
          Download PDF
        </a>

        <a
          href={zipUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl bg-cyan-600 text-white px-6 py-4 font-semibold text-center"
        >
          Download ZIP
        </a>

        <a
          href={slideUrls?.[0]}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl bg-slate-100 text-slate-900 px-6 py-4 font-semibold text-center border border-slate-200"
        >
          Download Slides
        </a>

        <a
          href={linkedinPostUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl bg-blue-600 text-white px-6 py-4 font-semibold text-center"
        >
          Open LinkedIn Post
        </a>
      </div>
    </div>
  );
}
