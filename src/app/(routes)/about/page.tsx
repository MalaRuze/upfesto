import {
  BirdIcon,
  BotIcon,
  BrushIcon,
  CalendarIcon,
  InfoIcon,
  Link2OffIcon,
  ListChecksIcon,
  MapIcon,
  MilestoneIcon,
  SendIcon,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Upfesto",
  description:
    "Upfesto started as a business idea, but it failed. However, I used the idea to create a tool for my own events and as a portfolio project.",
};

const paragraphs = [
  {
    title: "First idea",
    text: "Hey, I'm Vojta, the creator of this site. First Upfesto idea was born in 2022 when organizing my birthday parties got trickier. Facebook events worked until we all moved on, and group chats were limiting. Unable to find the perfect tool, I thought it might be cool to do something on my own.",
    image: "feature_information.png",
  },
  {
    title: "Team Up",
    text: "Fortunately, I was not alone. In February 2023 I pitched the idea during one of the entrepreneurship courses at the University of Business and Economics in Prague and found a great team. Now we were 5 - me (Vojtech Ruzicka), Filip Bartak, Marco Hahn, Mato Selecky and Petr Slapak. We were all excited and ready to go.",
    image: "about_work.jpg",
  },
  {
    title: "Grind",
    text: "We had a clear goal – get the idea ready for the university startup competition in May. We did it all – shaping the concept, laying out a business plan, doing in-depth interviews and putting our idea to the test with PPC campaigns. We worked hard but enjoyed the process.",
    image: "about_grind.jpg",
  },
  {
    title: "To the moon",
    text: "In just three months, we presented our idea to a panel of real VC investors and school representatives at the Startup VŠE competition. Our hard work paid off, as we proudly secured the 2nd place, validating our efforts.",
    image: "about_award.jpg",
  },
  {
    title: "What now?",
    text: "After the competition, our team underwent a change, and we continued with just three of us – Filip, Marco, and myself. Main critique from the judges was towards our business model. We still were not sure how to monetize the product, so we decided to take a step back and rethink the whole concept and validate the idea further.",
    image: "about_csob.jpg",
  },
  {
    title: "Validation to the end",
    text: "",
    image: "feature_information.png",
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
            src="about_presentation.jpg"
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
              <p className="mt-8 max-w-xl leading-7 text-gray-600 pl-4">
                {feature.text}
              </p>
            </div>
            <img
              src={feature.image}
              className="drop-shadow-xl rounded-xl max-h-96 mx-auto"
              alt={feature.title}
            />
          </div>
        ))}
      </div>
    </main>
  );
};

export default DashboardPage;
