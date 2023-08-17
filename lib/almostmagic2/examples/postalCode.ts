import { generate, generateOrThrow } from "../generate";

export const getPostalCode = ( location: string ) =>
  generate( 'Postal code', location );