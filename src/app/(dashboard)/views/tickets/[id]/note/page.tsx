"use client";

import { useParams } from "next/navigation";
import TicketNote from "@/features/document-generation/ui/TicketNote"; // Adjust path if needed
import { Button, Container, Group, Text } from "@mantine/core";
import { IconPrinter } from "@tabler/icons-react";

// Basic print styles (can be moved to a CSS file)
const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    #printableArea, #printableArea * {
      visibility: visible;
    }
    #printableArea {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      margin: 0;
      padding: 0;
    }
    .no-print {
      display: none !important;
    }
    /* Add more specific print styles if needed */
    @page { 
      size: A4; 
      margin: 20mm; /* Example margin */
    } 
  }
`;

export default function TicketNotePage() {
  const params = useParams<{ id: string }>();
  const ticketId = params?.id ?? "";

  const handlePrint = () => {
    window.print();
  };

  return (
    // Container helps constrain width on screen, but print styles override it
    <Container size="md" py="xl">
      {/* Inject print styles */}
      <style>{printStyles}</style>

      {/* Add a print button that disappears when printing */}
      <Group justify="flex-end" mb="md" className="no-print">
        <Button
          leftSection={<IconPrinter size={16} />}
          onClick={handlePrint}
          variant="outline"
        >
          Cetak Nota
        </Button>
      </Group>

      {/* Render the TicketNote component inside a printable area */}
      <div id="printableArea">
        {ticketId ? (
          <TicketNote ticketId={ticketId} />
        ) : (
          <Text c="red">ID Tiket tidak valid.</Text> // Fallback
        )}
      </div>
    </Container>
  );
}
