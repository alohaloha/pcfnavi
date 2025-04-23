import { Container } from "@/components/Container";

export default function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container className="py-8 md:py-12">
      {children}
    </Container>
  );
} 