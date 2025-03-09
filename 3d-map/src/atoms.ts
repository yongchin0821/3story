// atoms.ts
import { atom } from "jotai";

const selectedRegionIndexAtom = atom<number | null>(null);

export default selectedRegionIndexAtom;
