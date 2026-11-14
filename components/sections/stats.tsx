import { Counter } from "@/components/motion/counter";
import { Reveal } from "@/components/motion/reveal";
import { pickLocale, type HomeContent } from "@/lib/data";

export async function Stats({ content }: { content: HomeContent }) {
  const { locale } = content;
  if (content.stats.length === 0) return null;

  return (
    <section className="border-y border-border bg-bg-elevated">
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-10 py-14 lg:grid-cols-4">
        {content.stats.map((stat, index) => (
          <Reveal key={`${stat.label.en}-${index}`} delay={index * 0.06} y={20}>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
                <Counter value={Number(stat.value)} suffix={stat.suffix} />
              </span>
              <span className="text-sm text-muted">{pickLocale(stat.label, locale)}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}