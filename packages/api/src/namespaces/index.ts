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
      export type Options = GeocodingModule.Geocoding.Types.Options;
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
}
