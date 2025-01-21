export default function LandingPage() {
  return (
    <div>
      <section className=" text-white h-screen flex items-center justify-center text-center px-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Revolutionize Your Vision with Decentralized Funding
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Launch your innovative projects and connect with a global community
            of backers who believe in your ideas. Built on blockchain for
            transparency, security, and speed.
          </p>
          <div className="mt-8 space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
            <button className="bg-green-600 text-white px-6 py-3 rounded-md text-lg hover:bg-green-500 transition">
              Start Your Campaign
            </button>
            <button className="bg-gray-800 text-white px-6 py-3 rounded-md text-lg hover:bg-gray-700 transition">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
