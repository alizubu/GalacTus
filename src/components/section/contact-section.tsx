import { Mail, Phone, MapPin } from "lucide-react";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { ContactForm } from "@/components/contact-form";
import type { ContentMap } from "@/lib/portfolio-data";

export default function ContactSection({ content = {} }: { content?: ContentMap }) {
  const email = content.contact_email ?? "shelveyedias@gmail.com";
  const phone = content.contact_phone ?? "+880 1835-412133";
  const address = content.contact_address ?? "51 Brickfield Road, Patherghata, Chittagong";
  const heading = content.contact_heading ?? "Get in Touch";
  const subtext = content.contact_subtext ?? "Want to discuss a project or strategy? Reach out — I respond to all serious business inquiries.";
  const availability = content.contact_availability ?? "Monday – Friday, 10 AM – 7 PM (BST)";

  const contactInfo = [
    { icon: Mail, label: "Email", value: email, href: `mailto:${email}`, external: false },
    { icon: Phone, label: "Mobile", value: phone, href: `tel:${phone.replace(/\s|-/g, "")}`, external: false },
    { icon: MapPin, label: "Office", value: address, href: "https://maps.google.com/?q=Patherghata+Chittagong+Bangladesh", external: true },
  ];

  return (
    <div className="border rounded-xl relative mt-6">
      <div className="absolute -top-4 border bg-primary z-10 rounded-xl px-4 py-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-background text-sm font-medium">Contact</span>
      </div>
      <div className="absolute inset-0 top-0 left-0 right-0 h-32 overflow-hidden pointer-events-none">
        <FlickeringGrid className="h-full w-full" squareSize={2} gridGap={2}
          style={{ maskImage: "linear-gradient(to bottom, black, transparent)", WebkitMaskImage: "linear-gradient(to bottom, black, transparent)" }} />
      </div>

      <div className="relative pt-12 pb-10 px-4 sm:px-8">
        <div className="flex flex-col items-center text-center gap-2 mb-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tighter">{heading}</h2>
          <p className="text-muted-foreground text-balance max-w-md text-sm sm:text-base">{subtext}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h3 className="text-base font-semibold text-foreground">Contact Information</h3>
            {contactInfo.map((item) => (
              <a key={item.label} href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 rounded-xl border bg-card p-4 hover:bg-accent/50 transition-colors duration-200 no-underline group">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                  <item.icon size={16} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</span>
                  <span className="text-sm font-medium text-foreground leading-snug break-words">{item.value}</span>
                </div>
              </a>
            ))}
            <p className="text-xs text-muted-foreground mt-1">🕙 Available {availability}</p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-base font-semibold text-foreground">Send a Message</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
