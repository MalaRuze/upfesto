import { WebhookEvent } from "@clerk/backend";
import { headers } from "next/headers";
import { Webhook } from "svix";
import axios from "axios";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``;

enum UserEventType {
  CREATED = "user.created",
  UPDATED = "user.updated",
  DELETED = "user.deleted",
}

// validate the request
async function validateRequest(request: Request) {
  const payloadString = await request.text();
  const headerPayload = headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id")!,
    "svix-timestamp": headerPayload.get("svix-timestamp")!,
    "svix-signature": headerPayload.get("svix-signature")!,
  };
  const wh = new Webhook(webhookSecret);
  return wh.verify(payloadString, svixHeaders) as WebhookEvent;
}

//handle request
const handler = async (request: Request) => {
  try {
    const payload = await validateRequest(request);
    const event = payload.type;
    // process the event
    switch (event) {
      case UserEventType.CREATED: {
        const newUserData = {
          id: payload.data.id,
          firstName: payload.data.first_name,
          lastName: payload.data.last_name,
          fullName: `${payload.data.first_name} ${payload.data.last_name}`,
          email: payload.data.email_addresses[0].email_address,
          profileImageUrl: payload.data.profile_image_url,
        };
        await axios.post("http://localhost:3000/api/users", newUserData);
        break;
      }
      case UserEventType.UPDATED: {
        const updatedUserData = {
          id: payload.data.id,
          firstName: payload.data.first_name,
          lastName: payload.data.last_name,
          fullName: `${payload.data.first_name} ${payload.data.last_name}`,
          email: payload.data.email_addresses[0].email_address,
          profileImageUrl: payload.data.profile_image_url,
        };
        await axios.put(`api/user/${payload.data.id}`, updatedUserData);
        break;
      }
      case UserEventType.DELETED: {
        const deletedUserData = {
          id: payload.data.id,
        };
        await axios.delete(`api/user/${payload.data.id}`, {
          data: deletedUserData,
        });
        break;
      }
    }
    // everything went well
    return Response.json({ message: "Received" }, { status: 200 });
  } catch (e) {
    // something went wrong
    // no changes were made to the database
    return Response.error();
  }
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
