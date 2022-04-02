import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import * as React from "react";
import {
  Anchor,
  Button,
  Center,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";

import { getUserId, createUserSession } from "~/session.server";

import { createUser, getUserByEmail } from "~/models/user.server";
import { validateEmail } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string") {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return json<ActionData>(
      { errors: { email: "A user already exists with this email" } },
      { status: 400 }
    );
  }

  const user = await createUser(email, password);

  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/",
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function Join() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData() as ActionData;
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (actionData?.errors?.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors?.password) {
      passwordRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Center sx={{ height: "100%" }}>
      <Paper radius="md" p="xl" withBorder sx={{ minWidth: "25rem" }}>
        <Form method="post">
          <Group direction="column" grow>
            <TextInput
              required
              label="Email address"
              id="email"
              ref={emailRef}
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              error={actionData?.errors?.email}
            />
            <PasswordInput
              required
              label="Password"
              id="password"
              ref={passwordRef}
              name="password"
              type="password"
              autoComplete="new-password"
              error={actionData?.errors?.password}
            />
          </Group>

          <input type="hidden" name="redirectTo" value={redirectTo} />

          <Stack mt="xl">
            <Button type="submit">Create Account</Button>
            <Anchor
              component={Link}
              to={{
                pathname: "/login",
                search: searchParams.toString(),
              }}
              type="button"
              color="gray"
              size="xs"
              align="center"
            >
              Already have an account? Login
            </Anchor>
          </Stack>
        </Form>
      </Paper>
    </Center>
  );
}
