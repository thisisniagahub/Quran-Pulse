// FIX: The error "File 'file:///types.ts' is not a module" is resolved by creating the correct content for types.ts. The import path is correct.
import type { IqraPage } from '../types';

// This data has been moved to public/data/iqraData.json to be fetched asynchronously.
// This array is kept to prevent breaking changes in case of any lingering imports, but it is now empty.
/**
 * @deprecated This array is deprecated. Iqra' content is now loaded asynchronously from `/data/iqraData.json`.
 * Its content has been moved there.
 */
export const iqraContent: IqraPage[] = [];