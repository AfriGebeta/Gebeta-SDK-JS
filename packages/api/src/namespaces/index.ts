import * as CommonModule from './common';
import * as MapModule from './map';
import * as ClusteringModule from './clustering';
import * as RoutingModule from './routing';
import * as NavigationModule from './navigation';
import * as TrackingModule from './tracking';
import * as GeocodingModule from './geocoding';
import * as FencingModule from './fencing';
import * as OverlayModule from './overlay';
import * as ComponentsModule from './components';
import * as EventsModule from './events';
import * as PlatformModule from './platform';
import * as ErrorsModule from './errors';

export namespace API {
  export namespace Common {
    export namespace Types {
      export type LngLat = CommonModule.Common.Types.LngLat;
      export type LngLatLike = CommonModule.Common.Types.LngLatLike;
    }
    export const Enums = CommonModule.Common.Enums;
  }

  export namespace Map {
    export namespace Types {
      export type ConstructorOptions = MapModule.Map.Types.ConstructorOptions;
      export type InitOptions = MapModule.Map.Types.InitOptions;
      export type SatelliteToggleOptions = MapModule.Map.Types.SatelliteToggleOptions;
    }
    export const Enums = MapModule.Map.Enums;
    export const Constants = MapModule.Map.Constants;
  }

  export namespace Clustering {
    export namespace Types {
      export type Options = ClusteringModule.Clustering.Types.Options;
    }
    export const Constants = ClusteringModule.Clustering.Constants;
  }

  export namespace Routing {
    export namespace Types {
      export type RouteData = RoutingModule.Routing.Types.RouteData;
      export type RouteInstruction = RoutingModule.Routing.Types.RouteInstruction;
      export type RouteSummary = RoutingModule.Routing.Types.RouteSummary;
      export type DirectionsOptions = RoutingModule.Routing.Types.DirectionsOptions;
      export type DisplayRouteOptions = RoutingModule.Routing.Types.DisplayRouteOptions;
      export type RouteStyleOptions = RoutingModule.Routing.Types.RouteStyleOptions;
    }
    export const Constants = RoutingModule.Routing.Constants;
  }

  export namespace Navigation {
    export namespace Types {
      export type StartOptions = NavigationModule.Navigation.Types.StartOptions;
      export type ControllerOptions = NavigationModule.Navigation.Types.ControllerOptions;
    }
    export namespace Events {
      export type ProgressEvent = NavigationModule.Navigation.Events.ProgressEvent;
      export type StepChangeEvent = NavigationModule.Navigation.Events.StepChangeEvent;
      export type StartEvent = NavigationModule.Navigation.Events.StartEvent;
      export type StopEvent = NavigationModule.Navigation.Events.StopEvent;
      export type OffRouteEvent = NavigationModule.Navigation.Events.OffRouteEvent;
      export type ArriveEvent = NavigationModule.Navigation.Events.ArriveEvent;
    }
    export const Constants = NavigationModule.Navigation.Constants;
  }

  export namespace Tracking {
    export namespace Types {
      export type ClientOptions = TrackingModule.Tracking.Types.ClientOptions;
      export type HttpClientOptions = TrackingModule.Tracking.Types.HttpClientOptions;
      export type LocationProvider = TrackingModule.Tracking.Types.LocationProvider;
      export type LocationData = TrackingModule.Tracking.Types.LocationData;
      export type Role = TrackingModule.Tracking.Types.Role;
    }
    export const Enums = TrackingModule.Tracking.Enums;
    export const Constants = TrackingModule.Tracking.Constants;
  }

  export namespace Geocoding {
    export namespace Types {
      export type Result = GeocodingModule.Geocoding.Types.Result;
    }
    export const Constants = GeocodingModule.Geocoding.Constants;
  }

  export namespace Fencing {
    export namespace Types {
      export type Definition = FencingModule.Fencing.Types.Definition;
      export type StyleOptions = FencingModule.Fencing.Types.StyleOptions;
      export type PointOptions = FencingModule.Fencing.Types.PointOptions;
      export type RenderOptions = FencingModule.Fencing.Types.RenderOptions;
    }
    export namespace Events {
      export type CompletedEvent = FencingModule.Fencing.Events.CompletedEvent;
    }
    export const Enums = FencingModule.Fencing.Enums;
    export const Constants = FencingModule.Fencing.Constants;
  }

  export namespace Overlay {
    export namespace Types {
      export type Options = OverlayModule.Overlay.Types.Options;
      export type MarkerData = OverlayModule.Overlay.Types.MarkerData;
      export type AddMarkerResult = OverlayModule.Overlay.Types.AddMarkerResult;
      export type ClusterData = OverlayModule.Overlay.Types.ClusterData;
    }
  }

  export namespace Platform {
    export const Constants = PlatformModule.Platform.Constants;
    export namespace Types {
      export type IMarker = PlatformModule.Platform.Types.IMarker;
      export type IPopup = PlatformModule.Platform.Types.IPopup;
      export type MarkerFactoryOptions = PlatformModule.Platform.Types.MarkerFactoryOptions;
      export type PopupFactoryOptions = PlatformModule.Platform.Types.PopupFactoryOptions;
      export type IMarkerFactory = PlatformModule.Platform.Types.IMarkerFactory;
      export type IPopupFactory = PlatformModule.Platform.Types.IPopupFactory;
      export type MapBounds = PlatformModule.Platform.Types.MapBounds;
      export type MapStyle = PlatformModule.Platform.Types.MapStyle;
      export type EaseToOptions = PlatformModule.Platform.Types.EaseToOptions;
      export type IMapAdapter = PlatformModule.Platform.Types.IMapAdapter;
      export type IPlatformDOM = PlatformModule.Platform.Types.IPlatformDOM;
      export type LocationData = PlatformModule.Platform.Types.LocationData;
      export type LocationProviderOptions = PlatformModule.Platform.Types.LocationProviderOptions;
      export type ILocationProvider = PlatformModule.Platform.Types.ILocationProvider;
      export type IStyleInjector = PlatformModule.Platform.Types.IStyleInjector;
    }
  }

  export namespace Components {
    export namespace Types {
      export type GebetaMapProps = ComponentsModule.Components.Types.GebetaMapProps;
      export type NavigationUIProps = ComponentsModule.Components.Types.NavigationUIProps;
    }
  }

  export namespace Events {
    export namespace Types {
      export type MapPayload = EventsModule.Events.Types.MapPayload;
      export type EventMap = EventsModule.Events.Types.EventMap;
    }
  }

  export namespace Errors {
    export namespace Types {
      export type GebetaErrorDetails = ErrorsModule.Errors.Types.GebetaErrorDetails;
      export type ApiErrorResponse = ErrorsModule.Errors.Types.ApiErrorResponse;
    }
    export const Codes = ErrorsModule.Errors.Codes;
    export const Domains = ErrorsModule.Errors.Domains;
    export namespace Classes {
      export const GebetaError = ErrorsModule.Errors.Classes.GebetaError;
      export namespace Validation {
        export const ValidationError = ErrorsModule.Errors.Classes.Validation.ValidationError;
      }
      export namespace Network {
        export const NetworkError = ErrorsModule.Errors.Classes.Network.NetworkError;
        export const NetworkTimeoutError = ErrorsModule.Errors.Classes.Network.NetworkTimeoutError;
        export const NetworkOfflineError = ErrorsModule.Errors.Classes.Network.NetworkOfflineError;
      }
      export namespace Api {
        export const ApiError = ErrorsModule.Errors.Classes.Api.ApiError;
        export const BadRequestError = ErrorsModule.Errors.Classes.Api.BadRequestError;
        export const UnauthorizedError = ErrorsModule.Errors.Classes.Api.UnauthorizedError;
        export const ForbiddenError = ErrorsModule.Errors.Classes.Api.ForbiddenError;
        export const NotFoundError = ErrorsModule.Errors.Classes.Api.NotFoundError;
        export const RateLimitError = ErrorsModule.Errors.Classes.Api.RateLimitError;
        export const ServerError = ErrorsModule.Errors.Classes.Api.ServerError;
      }
      export namespace Business {
        export const BusinessLogicError = ErrorsModule.Errors.Classes.Business.BusinessLogicError;
        export const GeocodingError = ErrorsModule.Errors.Classes.Business.GeocodingError;
        export const RoutingError = ErrorsModule.Errors.Classes.Business.RoutingError;
        export const NavigationError = ErrorsModule.Errors.Classes.Business.NavigationError;
        export const TrackingError = ErrorsModule.Errors.Classes.Business.TrackingError;
      }
      export namespace Platform {
        export const PlatformError = ErrorsModule.Errors.Classes.Platform.PlatformError;
        export const GeolocationDeniedError =
          ErrorsModule.Errors.Classes.Platform.GeolocationDeniedError;
        export const GeolocationUnavailableError =
          ErrorsModule.Errors.Classes.Platform.GeolocationUnavailableError;
        export const GeolocationTimeoutError =
          ErrorsModule.Errors.Classes.Platform.GeolocationTimeoutError;
      }
    }
    export namespace Factories {
      export namespace Validation {
        export const createValidationError =
          ErrorsModule.Errors.Factories.Validation.createValidationError;
      }
      export namespace Network {
        export const createNetworkError = ErrorsModule.Errors.Factories.Network.createNetworkError;
        export const createNetworkTimeoutError =
          ErrorsModule.Errors.Factories.Network.createNetworkTimeoutError;
        export const createNetworkOfflineError =
          ErrorsModule.Errors.Factories.Network.createNetworkOfflineError;
      }
      export namespace Api {
        export const createApiError = ErrorsModule.Errors.Factories.Api.createApiError;
      }
      export namespace Business {
        export const createGeocodingError =
          ErrorsModule.Errors.Factories.Business.createGeocodingError;
        export const createRoutingError = ErrorsModule.Errors.Factories.Business.createRoutingError;
        export const createNavigationError =
          ErrorsModule.Errors.Factories.Business.createNavigationError;
        export const createTrackingError =
          ErrorsModule.Errors.Factories.Business.createTrackingError;
      }
    }
    export namespace Utils {
      export const isGebetaError = ErrorsModule.Errors.Utils.isGebetaError;
      export const getErrorCode = ErrorsModule.Errors.Utils.getErrorCode;
      export const getErrorDomain = ErrorsModule.Errors.Utils.getErrorDomain;
      export const formatErrorForLogging = ErrorsModule.Errors.Utils.formatErrorForLogging;
      export const parseApiErrorResponse = ErrorsModule.Errors.Utils.parseApiErrorResponse;
      export const extractRequestId = ErrorsModule.Errors.Utils.extractRequestId;
    }
  }
}
