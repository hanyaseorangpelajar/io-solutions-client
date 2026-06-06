// Tipe data ini merepresentasikan data dari backend /kb-entry
export type KBEntry = {
  id: string;
  gejala: string;
  modelPerangkat: string;
  diagnosis: string;
  solusi: string;
  sourceTicketId: {
    _id: string;
    nomorTiket: string;
  };
  tags: {
    id: string;
    nama: string;
  }[];
  dibuatOleh: {
    _id: string;
    nama: string;
  };
  dibuatPada: string;
  diperbaruiPada: string;
};
