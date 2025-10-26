import { Container, Title, Text, Stack } from "@mantine/core";
import classes from "./not-found.module.css";

export const metadata = { title: "404 — Halaman tidak ditemukan" };

export default function NotFound() {
  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.label}>404</div>
        <Title className={classes.title}>Halaman tidak ditemukan.</Title>
        <Text size="lg" ta="center" className={classes.description}>
          Maaf, alamat yang Anda akses tidak tersedia atau telah dipindahkan.
          Periksa kembali ejaan URL atau navigasikan melalui menu untuk
          melanjutkan pekerjaan Anda.
        </Text>
        <Text size="lg" ta="center" className={classes.description}>
          Jika Anda yakin ini sebuah kesalahan, silakan hubungi administrator
          sistem.
        </Text>
      </Container>
    </div>
  );
}
