"use client";

import { useParams } from "next/navigation";
import TicketNote from "@/features/document-generation/ui/TicketNote";
import { Button, Container, Group, Text, rem } from "@mantine/core";
import { IconPrinter } from "@tabler/icons-react";

// --- PERBARUI PRINT STYLES DI SINI ---
const printStyles = `
  @media print {
    /* Sembunyikan semua elemen di luar area cetak */
    body * {
      visibility: hidden;
    }
    .no-print {
      display: none !important;
    }
    
    /* Atur ukuran halaman */
    @page { 
      size: A4; 
      margin: 20mm; /* Margin 2cm di semua sisi */
    } 

    /* Tampilkan area cetak dan isinya */
    #printableArea, #printableArea * {
      visibility: visible;
    }

    /* Posisikan area cetak untuk mengisi halaman */
    #printableArea {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      margin: 0;
      padding: 0;
    }
    
    /* Hapus padding/margin dari container Mantine saat cetak */
    #printableArea > .mantine-Container-root {
       padding: 0;
       margin: 0;
       max-width: 100%;
    }

    /* Beri border pada Paper dan hapus shadow */
    #printableArea .mantine-Paper-root {
      border: 1px solid #000 !important;
      box-shadow: none !important;
      border-radius: 0 !important;
      /* Atur padding internal nota saat cetak */
      padding: ${rem(40)} !important; 
    }

    /* Pastikan tabel juga terlihat bagus */
    #printableArea .mantine-Table-table {
      border-collapse: collapse;
    }
    #printableArea .mantine-Table-th,
    #printableArea .mantine-Table-td {
      border: 1px solid #ccc;
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
    <Container size="md" py="xl">
      <style>{printStyles}</style>

      <Group justify="flex-end" mb="md" className="no-print">
        <Button
          leftSection={<IconPrinter size={16} />}
          onClick={handlePrint}
          variant="outline"
        >
          Cetak Nota
        </Button>
      </Group>

      <div id="printableArea">
        {ticketId ? (
          <TicketNote ticketId={ticketId} />
        ) : (
          <Text c="red">ID Tiket tidak valid.</Text>
        )}
      </div>
    </Container>
  );
}
