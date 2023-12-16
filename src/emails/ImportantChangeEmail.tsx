import { EmailProps } from "@/emails/types";
import { baseUrl } from "@/lib/constants";
import { Body } from "@react-email/body";
import {
  Button,
  Container,
  Heading,
  Tailwind,
  Text,
} from "@react-email/components";
import { Html } from "@react-email/html";
import { Img } from "@react-email/img";
import { Section } from "@react-email/section";

const ImportantChangeEmail = ({ event, message }: EmailProps) => {
  return (
    <Tailwind>
      <Html>
        <Body className="bg-white font-sans px-4">
          <Section>
            <Container className="mx-auto py-5 w-580">
              <Section>
                <Img src={`${baseUrl}/logo_color.png`} className="h-8" />
              </Section>
              <Section className="mt-10 mb-4">
                <Text className="mb-0 font-semibold text-gray-600 text-base">
                  Important update in
                </Text>
                <Heading as="h1" className="text-3xl m-0 tracking-tight">
                  {event.title}
                </Heading>
              </Section>
              <Section className="p-6 bg-gray-200 rounded-lg w-full">
                <Text className="text-sm">{message}</Text>
              </Section>
              <Section>
                <Text className="mb-4 font-semibold text-gray-600 text-base">
                  To see event details, attendance or change your response:
                </Text>
                <Section className="w-full bg-yellow-400 rounded-xl">
                  <Button
                    href={`https://upfesto.com/event/${event.id}`}
                    className="p-4  w-full font-semibold  mx-auto text-center text-black "
                  >
                    Go to event page
                  </Button>
                </Section>
              </Section>
            </Container>
          </Section>
        </Body>
      </Html>
    </Tailwind>
  );
};

export default ImportantChangeEmail;
