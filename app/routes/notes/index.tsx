import { Anchor, Text } from "@mantine/core";
import { Link } from "@remix-run/react";

export default function NoteIndexPage() {
  return (
    <Text>
      No note selected. Select a note on the left, or{" "}
      <Anchor component={Link} to="new">
        create a note.
      </Anchor>
    </Text>
  );
}
