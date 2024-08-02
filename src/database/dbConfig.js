import { app } from '../config/bootloader';
import { getDatabase } from "firebase/database";

export const database = getDatabase(app);