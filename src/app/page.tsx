import { Button } from "@/components/ui/button";
import {
  BeerIcon,
  BirdIcon,
  BotIcon,
  BrushIcon,
  CakeIcon,
  CalendarIcon,
  HeartIcon,
  InfoIcon,
  Link2OffIcon,
  ListChecksIcon,
  MapIcon,
  MilestoneIcon,
  SendIcon,
  TrendingUp,
  TrophyIcon,
} from "lucide-react";
import Link from "next/link";

const eventTypes = [
  {
    name: "Sport",
    description:
      "Kick off your sports event stress-free! We handle the invites and updates, so you can score big on the field without missing a beat.",
    icon: TrophyIcon,
  },
  {
    name: "Social",
    description:
      "Casual friday beer, or a fancy cocktail party? We got you covered! You are just a few clicks away from a great night out. ",
    icon: BeerIcon,
  },
  {
    name: "Wedding",
    description:
      "Is Upfesto able to handle a big, 200 guests, extravaganza wedding? Nobody tried yet, but i bet it can! ",
    icon: HeartIcon,
  },
  {
    name: "Birthday",
    description:
      "Forget the hassle — our platform takes care of invites and updates, letting you focus on making your best birthday party.",
    icon: CakeIcon,
  },
];

const features = [
  {
    name: "Everything in one place",
    image: "pictures/feature_information.png",
    subfeatures: [
      {
        name: "Event details",
        description:
          "Provide your guests with all the information they need to know.",
        icon: InfoIcon,
      },
      {
        name: "Map",
        description:
          "No one gets lost. Show your guests where the event is taking place.",
        icon: MapIcon,
      },
      {
        name: "Make it your own",
        description:
          "Customize the event page image and description to match your event theme and style.",
        icon: BrushIcon,
      },
    ],
  },
  {
    name: "Keep your guests updated",
    image: "pictures/feature_posts.png",
    subfeatures: [
      {
        name: "Posts",
        description:
          "Keep your guests updated with posts. Share the latest news and more.",
        icon: MilestoneIcon,
      },
      {
        name: "Auto updates",
        description:
          "Your guests will be notified when important information changes.",
        icon: BotIcon,
      },
    ],
  },
  {
    name: "Guests list on a glance",
    image: "pictures/feature_attendance.png",
    subfeatures: [
      {
        name: "Easy invitation",
        description:
          "Just share the event page with guests through email or your favorite chat app.",
        icon: SendIcon,
      },
      {
        name: "No social media needed",
        description:
          "Your guests can be in one place, besides the social media they use.",
        icon: Link2OffIcon,
      },
      {
        name: "Attendance list",
        description: "Keep track of the attendance on your event page.",
        icon: ListChecksIcon,
      },
    ],
  },
  {
    name: "Never miss a thing",
    image: "pictures/feature_calendar.png",
    subfeatures: [
      {
        name: "Add to calendar",
        description:
          "Your guests can add the event to their calendar, so they never miss a thing.",
        icon: CalendarIcon,
      },
      {
        name: "Email notifications",
        description:
          "Your guests will be notified when you create new post or important information changes.",
        icon: BirdIcon,
      },
    ],
  },
];

const Home = () => {
  return (
    <main className="flex min-h-[80vh] flex-col items-center">
      {/* heading section */}
      <div className="relative px-6 py-14 lg:px-8 w-full">
        <div
          className="absolute inset-x-0 -top-40 -z-20 transform-gpu overflow-hidden blur-3xl sm:-top-80 "
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3800C3] to-[#FFCE00] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-3xl py-2 sm:py-20 min-h-[85vh]">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Simplify your event planning
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Invite your friends, track RSVPs, and much more. Upfesto is the
              easiest way to plan your next event.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/dashboard">
                <Button>Get started</Button>
              </Link>
              <a
                href="#features"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
          <img src="pictures/showcase.png" className="drop-shadow-xl" />
        </div>
        <div
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#3800C3] to-[#FFCE00] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>
      </div>
      {/* event types */}
      <div className="mx-auto max-w-3xl px-6 lg:text-center" id="features">
        <p className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">
          BBQ or wedding? We got you covered!
        </p>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Your event, your way. Enjoy the freedom to plan and execute diverse
          occasions, with our platform as your trusted ally.
        </p>
      </div>
      <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl px-6">
        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {eventTypes.map((eventType) => (
            <div key={eventType.name} className="relative pl-16">
              <dt className="text-base font-semibold leading-7 ">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <eventType.icon
                    className="h-6 w-6 text-black"
                    aria-hidden="true"
                    strokeWidth={1.5}
                  />
                </div>
                {eventType.name}
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-600">
                {eventType.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      {/* features */}
      <div className="w-full max-w-screen-xl flex flex-col my-40 px-6 space-y-32">
        {features.map((feature, key) => (
          <div
            className="grid grid-cols-1 gap-10 lg:gap-32 lg:grid-cols-2"
            key={key}
          >
            <div className={` ${key % 2 !== 0 && "lg:order-2"}`}>
              <h3 className="text-2xl sm:text-4xl font-bold mt-2">
                {feature.name}
              </h3>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                {feature.subfeatures.map((subfeature, key) => (
                  <div className="relative pl-9" key={key}>
                    <dt className="inline font-semibold text-gray-900">
                      <subfeature.icon
                        className="absolute left-1 top-1 h-5 w-5 text-primary"
                        aria-hidden="true"
                      />
                      {subfeature.name}.
                    </dt>
                    <dd className="inline ml-1.5">{subfeature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <img
              src={feature.image}
              className="drop-shadow-xl rounded-xl max-h-96 mx-auto"
              alt={feature.name}
            />
          </div>
        ))}
      </div>
      {/* call to action */}
      <div className="flex flex-col gap-8 mb-32 items-center">
        <h3 className="font-bold text-2xl sm:text-4xl">
          Create your first event now!
        </h3>
        <Link href="/dashboard">
          <Button>Get started</Button>
        </Link>
      </div>
      {/* business note */}
      <div className="w-full bg-gray-100 outline outline-gray-100 outline-[2rem]">
        <div className="w-full mx-auto max-w-screen-xl py-16 px-6">
          <h3 className="font-bold text-2xl sm:text-4xl flex items-center gap-3">
            <TrendingUp
              className="w-10 h-10 text-primary flex-shrink-0"
              strokeWidth={3}
            />
            Can Upfesto be a sustaiunable business?
          </h3>
          <p className="mt-6 text-lg leading-8 text-gray-600 ml-14">
            Probably not:/ But it was a fun project to work on. See the full
            Upfesto story
            <Link
              href="/about"
              className="underline ml-1.5 font-bold text-black"
            >
              here
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
};

export default Home;
