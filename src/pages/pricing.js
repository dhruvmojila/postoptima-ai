export default function Pricing() {
  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6">Pricing</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">Free</h3>
          <ul className="list-disc pl-4">
            <li>5 analyses/day</li>
            <li>Basic optimization</li>
            <li>Ads supported</li>
          </ul>
        </div>
        <div className="border p-4 rounded">
          <h3 className="text-xl font-semibold mb-2">Premium – $9.99/month</h3>
          <ul className="list-disc pl-4">
            <li>Unlimited usage</li>
            <li>Advanced suggestions</li>
            <li>No ads</li>
          </ul>
          <button className="bg-purple-600 text-white px-6 py-2 mt-4 rounded hover:bg-purple-700 transition">
            Upgrade
          </button>
        </div>
      </div>
    </main>
  );
}
