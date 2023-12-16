import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Upfesto",
  description:
    "Upfesto started as a business idea, but it failed. However, I used the idea to create a tool for my own events and as a portfolio project.",
};

const paragraphs = [
  {
    title: "The idea",
    text: (
      <p>
        Hey, I&apos;m Vojta, the brain behind this site. First Upfesto idea was
        born in 2022 when organizing my birthday parties got trickier. Facebook
        events worked until we all moved on, and group chats were limiting.
        Unable to find the perfect tool, I thought it might be cool to do
        something on my own.
      </p>
    ),
    image: "pictures/about_idea.jpg",
  },
  {
    title: "Team up",
    text: (
      <p>
        Fortunately, I was not alone. In February 2023 I pitched the idea during
        one of the entrepreneurship courses at the University of Business and
        Economics in Prague and found an exceptional team of five: me (
        <a
          href="https://www.linkedin.com/in/vojtech-ruzicka/"
          className="underline"
        >
          Vojtech Ruzicka
        </a>
        ),{" "}
        <a
          href="https://www.linkedin.com/in/filipbartak/"
          className="underline"
        >
          Filip Bartak
        </a>
        ,{" "}
        <a href="https://www.linkedin.com/in/marco-hahn/" className="underline">
          Marco Hahn
        </a>
        ,{" "}
        <a href="https://www.linkedin.com/in/selecky/" className="underline">
          Martin Selecky
        </a>{" "}
        and{" "}
        <a
          href="https://www.linkedin.com/in/petr-%C5%A1lap%C3%A1k-694477198/"
          className="underline"
        >
          Petr Slapak
        </a>
        . Bursting with enthusiasm, we were all set to hit the ground running.
      </p>
    ),
    image: "pictures/about_work.jpg",
  },
  {
    title: "Let's grind",
    text: (
      <p>
        We had a clear goal – get the idea ready for the university startup
        competition in May. We did it all – shaping the concept, laying out a
        business plan, doing in-depth interviews and putting our idea to the
        test with PPC campaigns. The effort was intense, but we found joy in the
        process.
      </p>
    ),
    image: "pictures/about_grind.jpg",
  },
  {
    title: "To the moon",
    text: (
      <p>
        In just three months, we presented our idea to a panel of real VC
        investors and school representatives at the Startup VŠE competition. Our
        hard work paid off, as we proudly secured the{" "}
        <a
          href="https://fph.vse.cz/zpravodaj/soutez-startup-vse-organizovana-katedrou-podnikani-fph-a-xport-vse-zna-sve-viteze-za-ls-22-23/"
          className="underline"
        >
          2nd place
        </a>
        , validating our efforts.
      </p>
    ),
    image: "pictures/about_award.jpg",
  },
  {
    title: "What now?",
    text: (
      <p>
        After the competition, our team underwent a change, and we continued
        with just three of us –{" "}
        <a
          href="https://www.linkedin.com/in/filipbartak/"
          className="underline"
        >
          Filip
        </a>
        ,{" "}
        <a href="https://www.linkedin.com/in/marco-hahn/" className="underline">
          Marco
        </a>
        , and{" "}
        <a
          href="https://www.linkedin.com/in/vojtech-ruzicka/"
          className="underline"
        >
          myself
        </a>
        . Main critique from the judges was towards our business model. We still
        were not sure how to monetize the product, so we decided to take a step
        back and rethink the whole concept and validate the idea further.
      </p>
    ),
    image: "pictures/about_csob.jpg",
  },
  {
    title: "Validation to the end",
    text: (
      <p>
        We went all out, doing deep-dive interviews and hunting for untapped
        markets. The{" "}
        <a
          href="https://startituni.csob.cz/validation-camp-pardubice-6-7-10-23/"
          className="underline"
        >
          ČSOB validation camp
        </a>{" "}
        was our stop to fast-track things, but the monetization puzzle stayed
        elusive. Despite our love for the concept, in October 2023 we&apos;ve
        decided to hit pause and turn our attention to different projects.
      </p>
    ),
    image: "pictures/feature_information.png",
  },
  {
    title: "Farewell to Upfesto",
    text: (
      <p>
        While the Upfesto may be considered a{" "}
        <a href="https://matt-rickard.com/tarpit-ideas" className="underline">
          tarpit idea
        </a>
        , our journey with it has been a rich learning experience. We invested
        countless hours in seemingly useless aspects of the business, yet every
        second was a labor of love. Although Upfesto has reached its end, our
        passion for innovation lives on.
      </p>
    ),
    image: "pictures/about_enjoy.jpg",
  },
];

const technologies = [
  {
    name: "NextJs",
    logo: "/technology_logos/nextjs_logo.svg",
    link: "https://nextjs.org/",
  },
  {
    name: "Typescript",
    logo: "/technology_logos/typescript_logo.svg",
    link: "https://www.typescriptlang.org/",
  },
  {
    name: "TailwindCss",
    logo: "/technology_logos/tailwind_logo.svg",
    link: "https://tailwindcss.com/",
  },
  {
    name: "Prisma",
    logo: "/technology_logos/prisma_logo.svg",
    link: "https://www.prisma.io/",
  },
  {
    name: "MySQL",
    logo: "/technology_logos/mysql_logo.svg",
    link: "https://www.mysql.com/",
  },
  {
    name: "Resend",
    logo: "/technology_logos/resend_logo.svg",
    link: "https://resend.io/",
  },
  {
    name: "Clerk",
    logo: "/technology_logos/clerk_logo.svg",
    link: "https://clerk.dev/",
  },
  {
    name: "Google Maps API",
    logo: "/technology_logos/googlemaps_logo.svg",
    link: "https://developers.google.com/maps",
  },
  {
    name: "Vercel",
    logo: "/technology_logos/vercel_logo.svg",
    link: "https://vercel.com/",
  },
  {
    name: "Planetscale",
    logo: "/technology_logos/planetscale_logo.svg",
    link: "https://planetscale.com/",
  },
];

const DashboardPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="w-full bg-gray-100 pt-20 px-6">
        <div className="max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-2">
          <div>
            <p className="font-semibold">About </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Not just a portfolio project
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Upfesto was supposed to be a business. Lets see how it all
              started.
            </p>
          </div>
          <img
            src="pictures/about_presentation.jpg"
            className="rounded-xl mx-auto lg:m-10 lg:-mb-20 -mb-40 mt-10 max-h-96 "
          />
        </div>
      </div>
      <div className="w-full max-w-screen-lg flex flex-col lg:mt-40 mt-52 px-6 lg:px-0 space-y-32">
        {paragraphs.map((feature, key) => (
          <div
            className="grid grid-cols-1 gap-10 lg:gap-32 lg:grid-cols-2"
            key={key}
          >
            <div className={` ${key % 2 === 0 && "lg:order-2"}`}>
              <h3 className="text-2xl sm:text-4xl font-bold mt-2">
                {feature.title}
              </h3>
              <div className="mt-8 max-w-xl leading-7 text-gray-600 pl-4">
                {feature.text}
              </div>
            </div>
            <img
              src={feature.image}
              className="drop-shadow-xl rounded-xl max-h-96 mx-auto"
              alt={feature.title}
            />
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-100 mt-32 px-6 py-10">
        <div className="max-w-screen-lg mx-auto grid grid-cols-1 lg:grid-cols-2 items-center lg:gap-20 gap-10">
          <div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight ">
              Why this site exists?
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600 ">
              Despite Upfesto's shortcomings, I made the decision to salvage the
              basic concept and transform it into a portfolio project to enhance
              and showcase my skills. <br />
              <br />
              Main technologies used on this site:
            </p>
            <dl className="grid grid-cols-4 gap-8 my-10 items-center">
              {technologies.map((technology, key) => (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <dd key={key}>
                        <a href={technology.link}>
                          <img
                            src={technology.logo}
                            alt={technology.name}
                            className="max-h-8 mx-auto drop-shadow-xl"
                          />
                        </a>
                      </dd>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{technology.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </dl>
            <p className="mt-4 text-lg leading-8 text-gray-600 ">
              See the full source code on{" "}
              <a
                href="https://github.com/MalaRuze/upfesto"
                className="underline"
              >
                Github
              </a>
              .
            </p>
          </div>
          <img
            src="pictures/about_grind.jpg"
            className="rounded-xl  max-h-96 mx-auto drop-shadow-xl"
          />
        </div>
      </div>
      <div className="w-full px-6  mt-10 mb-4">
        <div className="mx-auto max-w-screen-lg">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight ">
            Contact me
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600 ">
            Suggestion, feature request or job offer? ... hit me up:)
          </p>
          <dl className="mt-4 flex gap-6 items-center">
            <dd>
              <a href="mailto:vojtech.ruzic@gmail.com">
                <Mail className="h-9 w-9" strokeWidth={2} />
              </a>
            </dd>
            <dd>
              <a href="https://www.linkedin.com/in/vojtech-ruzicka/">
                <img src="linkedin_logo_dark.png" className="h-8 w-8" />
              </a>
            </dd>
            <dd>
              <a href="https://github.com/MalaRuze">
                <img src="github_logo_dark.png" className="h-8 w-8" />
              </a>
            </dd>
          </dl>
        </div>
      </div>
    </main>
  );
};

export default DashboardPage;
