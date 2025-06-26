import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { subtitle, title } from "@/components/primitives";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Avec&nbsp;</span>
        <span className={title({ color: "violet" })}>SOOSMART GROUP&nbsp;</span>
        <br />
        <span className={title()}>
          La technologie au service de la confiance.
        </span>
        <div className={subtitle({ class: "mt-4" })}>
          Votre réseau est le cœur de votre activité — protégez-le avec des
          solutions à la hauteur de vos ambitions
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={siteConfig.links.docs}
        >
          Documentation
        </Link>
      </div>
    </section>
  );
}
