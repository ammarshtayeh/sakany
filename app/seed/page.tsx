"use client";

import { useState } from "react";
import { mockListings } from "@/data/mockData";
import { addListing } from "@/lib/firestore-service";
import Navbar from "@/components/Navbar";

export default function SeedPage() {
  const [status, setStatus] = useState("idle");
  const [log, setLog] = useState<string[]>([]);

  const handleSeed = async () => {
    setStatus("seeding");
    setLog([]);

    try {
      for (const listing of mockListings) {
        // Remove ID as Firestore generates it
        const { id, ...listingData } = listing;

        setLog((prev) => [...prev, `Uploading: ${listing.title}...`]);
        await addListing(listingData);
        setLog((prev) => [...prev, `✅ SUCCESS: ${listing.title}`]);
      }
      setStatus("complete");
      setLog((prev) => [...prev, "🎉 All data seeded successfully!"]);
    } catch (error) {
      setStatus("error");
      console.error(error);
      setLog((prev) => [...prev, `❌ ERROR: ${error}`]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-32 px-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-black mb-6">Database Seeder</h1>

        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
          <p className="mb-6 text-slate-600 font-bold">
            This tool will upload all {mockListings.length} items from
            `mockData.ts` to your Firestore database.
            <br />
            <span className="text-red-500">
              Warning: This will create duplicate data if run multiple times.
            </span>
          </p>

          <button
            onClick={handleSeed}
            disabled={status === "seeding" || status === "complete"}
            className={`w-full py-4 rounded-xl font-black text-white text-xl transition-all ${
              status === "idle" || status === "error"
                ? "bg-primary hover:scale-[1.02]"
                : "bg-slate-300"
            }`}
          >
            {status === "seeding" ? "Uploading..." : "Seed Database Now"}
          </button>

          <div className="mt-8 bg-slate-900 text-green-400 p-6 rounded-xl font-mono text-sm max-h-96 overflow-y-auto">
            {log.length === 0 ? (
              <span className="text-slate-500">
                // Logs will appear here...
              </span>
            ) : (
              log.map((entry, i) => <div key={i}>{entry}</div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
