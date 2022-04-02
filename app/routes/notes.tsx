import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, Outlet, useLoaderData } from "@remix-run/react";
import { Sun, MoonStars, Logout, Plus, Note } from "tabler-icons-react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getNoteListItems } from "~/models/note.server";
import {
  ActionIcon,
  AppShell,
  Group,
  Header,
  Navbar,
  Title,
  useMantineColorScheme,
  Anchor,
  Text,
  ThemeIcon,
  Stack,
  UnstyledButton,
} from "@mantine/core";
import { To } from "history";

type LoaderData = {
  noteListItems: Awaited<ReturnType<typeof getNoteListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const noteListItems = await getNoteListItems({ userId });
  return json<LoaderData>({ noteListItems });
};

export default function NotesPage() {
  const data = useLoaderData() as LoaderData;
  const user = useUser();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }} p="xs">
          <Navbar.Section grow mt="xs">
            <Stack>
              <MenuEntry
                to="new"
                icon={
                  <ThemeIcon variant="light">
                    <Plus size={16} />
                  </ThemeIcon>
                }
                label="New Note"
              />
              {data.noteListItems.length === 0 ? (
                <Text>No notes yet</Text>
              ) : (
                data.noteListItems.map((note) => (
                  <MenuEntry
                    key={note.id}
                    to={note.id}
                    icon={
                      <ThemeIcon color="yellow" variant="light">
                        <Note size={16} />
                      </ThemeIcon>
                    }
                    label={note.title}
                  />
                ))
              )}
            </Stack>
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={60}>
          <Group sx={{ height: "100%" }} px={20} position="apart">
            <Anchor component={Link} to="." variant="gradient">
              <Title order={1}>Notes</Title>
            </Anchor>

            <Text>{user.email}</Text>

            <Group>
              <ActionIcon
                variant="default"
                onClick={() => toggleColorScheme()}
                size="lg"
                aria-label="switch-theme-mode"
              >
                {colorScheme === "dark" ? (
                  <Sun size={20} />
                ) : (
                  <MoonStars size={20} />
                )}
              </ActionIcon>

              <Form action="/logout" method="post">
                <ActionIcon
                  variant="default"
                  size="lg"
                  type="submit"
                  aria-label="logout"
                >
                  <Logout size={20} />
                </ActionIcon>
              </Form>
            </Group>
          </Group>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Outlet />
    </AppShell>
  );
}

interface MenuEntryProps {
  icon: JSX.Element;
  label: string;
  to: To;
}
const MenuEntry = ({ icon, label, to }: MenuEntryProps) => (
  <UnstyledButton
    aria-label={label}
    component={Link}
    to={to}
    sx={(theme) => ({
      display: "block",
      width: "100%",
      padding: theme.spacing.xs,
      borderRadius: theme.radius.sm,
      color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[1],
      },
    })}
  >
    <Group>
      {icon}
      <Text>{label}</Text>
    </Group>
  </UnstyledButton>
);
