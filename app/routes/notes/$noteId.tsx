import { Box, Button, Divider, Text, Title } from "@mantine/core";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Note } from "~/models/note.server";
import { deleteNote } from "~/models/note.server";
import { getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  note: Note;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  const note = await getNote({ userId, id: params.noteId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  return json<LoaderData>({ note });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  await deleteNote({ userId, id: params.noteId });

  return redirect("/notes");
};

export default function NoteDetailsPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <Box>
      <Title order={3}>{data.note.title}</Title>
      <Text py="1.5rem">{data.note.body}</Text>

      <Divider my="md" />

      <Form method="post">
        <Button type="submit">Delete</Button>
      </Form>
    </Box>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return (
    <Box>
      <Text>An unexpected error occurred: {error.message}</Text>
    </Box>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <Box>
        <Text>Note not found</Text>
      </Box>
    );
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
