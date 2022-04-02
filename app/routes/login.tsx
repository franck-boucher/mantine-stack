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
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";

import { createUserSession, getUserId } from "~/session.server";
import { verifyLogin } from "~/models/user.server";
import { validateEmail } from "~/utils";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return json({});
};

interface ActionData {
  errors?: {
    email?: string;
    password?: string;
  };
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo");
  const remember = formData.get("remember");

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

  const user = await verifyLogin(email, password);

  if (!user) {
    return json<ActionData>(
      { errors: { email: "Invalid email or password" } },
      { status: 400 }
    );
  }

  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/notes",
  });
};

export const meta: MetaFunction = () => {
  return {
    title: "Login",
  };
};

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/notes";
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
            <Button type="submit">Log in</Button>

            <Group position="apart">
              <Checkbox label="Remember me" id="remember" name="remember" />
              <Anchor
                component={Link}
                to={{
                  pathname: "/join",
                  search: searchParams.toString(),
                }}
                type="button"
                color="gray"
                size="xs"
                align="center"
              >
                Don't have an account? Sign up
              </Anchor>
            </Group>
          </Stack>
        </Form>
      </Paper>
    </Center>
  );
}
