export const sortIds = (id1: string, id2: string) => {
  return id1 < id2 ? [id1, id2] as const : [id2, id1] as const;
}

