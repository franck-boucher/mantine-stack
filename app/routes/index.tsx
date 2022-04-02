import {
  Box,
  Center,
  Container,
  Image,
  Title,
  Text,
  Button,
  Group,
  Anchor,
} from "@mantine/core";
import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";
import background from "~/assets/background.svg";
import mantineLogo from "~/assets/mantine.svg";

export default function Index() {
  const user = useOptionalUser();
  return (
    <Container size="xl">
      <Box pt="2rem">
        <Box
          sx={{
            position: "relative",
            borderRadius: "1rem",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#1A1B1E",
              position: "absolute",
              top: "0px",
              right: "0px",
              bottom: "0px",
              left: "0px",
            }}
          >
            <img
              src={background}
              alt="Sonic Youth On Stage"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>

          <Center
            pt="8rem"
            pb="3.5rem"
            sx={{ position: "relative", flexDirection: "column" }}
          >
            <Title
              order={1}
              sx={{
                color: "#339af0",
                fontSize: "8rem",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                "@media (max-width: 1100px)": {
                  fontSize: "5rem",
                },
                "@media (max-width: 730px)": {
                  fontSize: "3rem",
                },
              }}
            >
              MANTINE STACK
            </Title>

            <Text size="xl" color="white" weight={500} align="center" mx="2rem">
              Check the README.md file for instructions on how to get this
              project deployed.
            </Text>

            <Box mt="2rem">
              {user ? (
                <Button component={Link} to="/notes" variant="white" size="lg">
                  View Notes for {user.email}
                </Button>
              ) : (
                <Group>
                  <Button component={Link} to="/join" variant="white" size="lg">
                    Sign up
                  </Button>
                  <Button component={Link} to="/login" size="lg">
                    Log In
                  </Button>
                </Group>
              )}
            </Box>

            <a href="https://remix.run">
              <Image
                src="https://user-images.githubusercontent.com/1500684/158298926-e45dafff-3544-4b69-96d6-d3bcc33fc76a.svg"
                alt="Remix"
                mt="4rem"
                width="14rem"
              />
            </a>
          </Center>
        </Box>

        <Group position="center" mt="2rem" sx={{ gap: "2rem" }}>
          {[
            {
              src: "https://user-images.githubusercontent.com/1500684/157764397-ccd8ea10-b8aa-4772-a99b-35de937319e1.svg",
              alt: "Fly.io",
              href: "https://fly.io",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157764395-137ec949-382c-43bd-a3c0-0cb8cb22e22d.svg",
              alt: "SQLite",
              href: "https://sqlite.org",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157764484-ad64a21a-d7fb-47e3-8669-ec046da20c1f.svg",
              alt: "Prisma",
              href: "https://prisma.io",
            },
            {
              src: mantineLogo,
              alt: "Mantine",
              href: "https://mantine.dev",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157764454-48ac8c71-a2a9-4b5e-b19c-edef8b8953d6.svg",
              alt: "Cypress",
              href: "https://www.cypress.io",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157772386-75444196-0604-4340-af28-53b236faa182.svg",
              alt: "MSW",
              href: "https://mswjs.io",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157772447-00fccdce-9d12-46a3-8bb4-fac612cdc949.svg",
              alt: "Vitest",
              href: "https://vitest.dev",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157772662-92b0dd3a-453f-4d18-b8be-9fa6efde52cf.png",
              alt: "Testing Library",
              href: "https://testing-library.com",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157772934-ce0a943d-e9d0-40f8-97f3-f464c0811643.svg",
              alt: "Prettier",
              href: "https://prettier.io",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157772990-3968ff7c-b551-4c55-a25c-046a32709a8e.svg",
              alt: "ESLint",
              href: "https://eslint.org",
            },
            {
              src: "https://user-images.githubusercontent.com/1500684/157773063-20a0ed64-b9f8-4e0b-9d1e-0b65a3d4a6db.svg",
              alt: "TypeScript",
              href: "https://typescriptlang.org",
            },
          ].map((img) => (
            <Anchor
              key={img.href}
              href={img.href}
              sx={{
                display: "flex",
                width: "8rem",
                height: "4rem",
                justifyContent: "center",
              }}
              className="flex h-16 w-32 justify-center p-1 grayscale transition hover:grayscale-0 focus:grayscale-0"
            >
              <img alt={img.alt} src={img.src} style={{ maxWidth: "100%" }} />
            </Anchor>
          ))}
        </Group>
      </Box>
    </Container>
  );
}
