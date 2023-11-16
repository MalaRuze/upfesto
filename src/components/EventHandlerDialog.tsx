import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {NewEventFormDataSchema, UpdateEventFormDataSchema} from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { getEventById } from "@/lib/events";
import { Event } from "@prisma/client";
import {getTimeFromDate} from "@/lib/utils";

type CreateProps = {
    mode: "create";
};

type UpdateProps = {
    mode: "update";
    event: Event;
};

const getEventFormSchema = (mode: "create" | "update") => {
    switch (mode) {
        case "create":
            return NewEventFormDataSchema;
        case "update":
            return UpdateEventFormDataSchema;
    }

}

const EventHandlerDialog = (props: CreateProps | UpdateProps) => {
    const { user } = useUser();
    const schema = getEventFormSchema(props.mode);
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: async () => {
            switch (props.mode) {
                case "create":
                    return {
                        timeFrom: "12:00",
                        hostId: user?.id,
                    } as z.infer<typeof schema>;
                case "update":
                    return {
                        id: props.event.id,
                        title: props.event.title,
                        description: props.event.description,
                        location: props.event.location,
                        imageUrl: props.event.imageUrl,
                        dateCreated: props.event.dateCreated,
                        dateFrom: props.event.dateFrom,
                        timeFrom: getTimeFromDate(props.event.dateFrom),
                        dateTo: props.event.dateTo,
                        timeTo: props.event.dateTo ? getTimeFromDate(props.event.dateTo) : undefined,
                        hostId: props.event.hostId,
                    } as z.infer<typeof schema>;
            }
        },
    });

    // Rest of your component logic
};