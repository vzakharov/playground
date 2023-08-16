import { generate, generateOrThrow } from "../generate";

export const getPostalCode = ( location: string ) =>
  generateOrThrow( 'postalCode', location );