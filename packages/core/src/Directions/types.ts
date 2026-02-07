/**
 * Raw directions API response structure (Valhalla format).
 */
export interface DirectionsApiResponse {
  /** Response status */
  msg?: 'ok' | 'error';
  /** Valhalla trip format (required for successful responses) */
  trip?: {
    legs: Array<{
      shape: string;
      maneuvers?: Array<{
        type?: number;
        instruction?: string;
        verbal_pre_transition_instruction?: string;
        verbal_post_transition_instruction?: string;
        bearing_after?: number;
        time?: number;
        length?: number;
        begin_shape_index?: number;
        [key: string]: unknown;
      }>;
      summary?: {
        length?: number;
        time?: number;
        [key: string]: unknown;
      };
      [key: string]: unknown;
    }>;
    locations?: Array<{
      lat: number;
      lon?: number;
      lng?: number;
      [key: string]: unknown;
    }>;
    summary?: {
      length?: number;
      time?: number;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  /** Error details */
  error?: {
    message?: string;
    [key: string]: unknown;
  };
  /** Additional properties */
  [key: string]: unknown;
}
