import { DEFAULT_LOCATION_PROVIDER_OPTIONS, CLIENT_ID_STORAGE_KEY } from '../constants';

export namespace Platform {
  export const Constants = {
    DEFAULT_LOCATION_PROVIDER_OPTIONS,
    CLIENT_ID_STORAGE_KEY,
  };

  export namespace Types {
    export type IMarker = import('../types/platform').IMarker;
    export type IPopup = import('../types/platform').IPopup;
    export type MarkerFactoryOptions = import('../types/platform').MarkerFactoryOptions;
    export type PopupFactoryOptions = import('../types/platform').PopupFactoryOptions;
    export type IMarkerFactory = import('../types/platform').IMarkerFactory;
    export type IPopupFactory = import('../types/platform').IPopupFactory;
    export type MapBounds = import('../types/platform').MapBounds;
    export type MapStyle = import('../types/platform').MapStyle;
    export type EaseToOptions = import('../types/platform').EaseToOptions;
    export type IMapAdapter = import('../types/platform').IMapAdapter;
    export type IPlatformDOM = import('../types/platform').IPlatformDOM;
    export type LocationData = import('../types/platform').LocationData;
    export type LocationProviderOptions = import('../types/platform').LocationProviderOptions;
    export type ILocationProvider = import('../types/platform').ILocationProvider;
    export type IStyleInjector = import('../types/platform').IStyleInjector;
    export type IClientIdStorage = import('../types/platform').IClientIdStorage;
    export type IPlatformContext = import('../types/platform').IPlatformContext;
  }
}
