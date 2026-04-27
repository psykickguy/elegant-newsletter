import DownloadLinksCard from "../components/DownloadLinksCard";

export default function SharePage() {
  const shareData = {
    title: "Frontend and AI Shifts: What's Next?",
    pdfUrl: "https://example.com/sample.pdf",
    zipUrl: "https://example.com/sample.zip",
    linkedinPostUrl: "https://linkedin.com",
    slideUrls: [
      "https://example.com/slide-1.png",
      "https://example.com/slide-2.png",
      "https://example.com/slide-3.png",
    ],
    metadata: {
      totalSlides: 6,
      theme: "modernSaaS",
      createdAt: "2026-04-12",
    },
  };

  return (
    <div className="min-h-screen bg-slate-100 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8">
          <h1 className="text-5xl font-bold text-slate-900">
            {shareData.title}
          </h1>

          <p className="text-slate-500 text-lg mt-4">
            Preview carousel slides, download assets, and access LinkedIn post.
          </p>
        </div>

        {/* Carousel Preview */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Carousel Preview
          </h2>

          <div className="grid grid-cols-3 gap-6">
            {shareData.slideUrls.map((slide, index) => (
              <div
                key={index}
                className="rounded-3xl overflow-hidden border border-slate-200 bg-slate-50"
              >
                <img
                  src={slide}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-[260px] object-cover"
                />

                <div className="p-4">
                  <p className="text-slate-700 font-medium">
                    Slide {index + 1}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Download Links */}
        <DownloadLinksCard
          pdfUrl={shareData.pdfUrl}
          zipUrl={shareData.zipUrl}
          slideUrls={shareData.slideUrls}
          linkedinPostUrl={shareData.linkedinPostUrl}
        />

        {/* Metadata */}
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Metadata</h2>

          <div className="grid grid-cols-3 gap-6">
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
              <p className="text-slate-500 text-sm">Total Slides</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {shareData.metadata.totalSlides}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
              <p className="text-slate-500 text-sm">Theme</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {shareData.metadata.theme}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
              <p className="text-slate-500 text-sm">Created At</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {shareData.metadata.createdAt}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
