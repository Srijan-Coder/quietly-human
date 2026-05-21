import { client } from "@/sanity/lib/client";
import { leadMagnetSettingsQuery } from "@/sanity/lib/queries";
import { ResetForm } from "@/components/global/ResetForm";

export const revalidate = 60;

export default async function FreeResetLibrary() {
  let settings = null;
  try {
    settings = await client.fetch(leadMagnetSettingsQuery);
  } catch (err) {
    console.warn("Failed to fetch lead magnet settings");
  }

  return (
    <div className="min-h-screen pt-32 px-6 md:px-12 max-w-5xl mx-auto w-full pb-24 text-center">
      <div className="mb-16">
        <span className="text-xs uppercase tracking-widest text-brand-accent mb-6 block">Free Resource</span>
        <h1 className="text-5xl md:text-6xl font-serif text-brand-text mb-6">7-Day Emotional Reset</h1>
        <p className="text-brand-soft font-sans max-w-2xl mx-auto leading-relaxed">
          A gentle week-long journey delivered to your inbox. Designed to help you release the pressure of having everything figured out. Includes daily soft prompts, phone wallpapers, and a quiet audio meditation.
        </p>
      </div>

      <ResetForm settings={settings} />
    </div>
  );
}
