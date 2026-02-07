import { ErrorCode, ErrorDomain } from '../errors';
import { GebetaError as GebetaErrorClass } from '../errors/base';
import { ValidationError as ValidationErrorClass } from '../errors/validation';
import {
  NetworkError as NetworkErrorClass,
  NetworkTimeoutError as NetworkTimeoutErrorClass,
  NetworkOfflineError as NetworkOfflineErrorClass,
} from '../errors/network';
import {
  ApiError as ApiErrorClass,
  BadRequestError as BadRequestErrorClass,
  UnauthorizedError as UnauthorizedErrorClass,
  ForbiddenError as ForbiddenErrorClass,
  NotFoundError as NotFoundErrorClass,
  RateLimitError as RateLimitErrorClass,
  ServerError as ServerErrorClass,
} from '../errors/api';
import {
  BusinessLogicError as BusinessLogicErrorClass,
  GeocodingError as GeocodingErrorClass,
  RoutingError as RoutingErrorClass,
  NavigationError as NavigationErrorClass,
  TrackingError as TrackingErrorClass,
} from '../errors/business';
import {
  PlatformError as PlatformErrorClass,
  GeolocationDeniedError as GeolocationDeniedErrorClass,
  GeolocationUnavailableError as GeolocationUnavailableErrorClass,
  GeolocationTimeoutError as GeolocationTimeoutErrorClass,
} from '../errors/platform';
import * as FactoriesModule from '../errors/factories';
import * as UtilsModule from '../errors/utils';

export namespace Errors {
  export namespace Types {
    export type GebetaErrorDetails = import('../errors/types').GebetaErrorDetails;
    export type ApiErrorResponse = import('../errors/types').ApiErrorResponse;
  }

  export const Codes = ErrorCode;
  export const Domains = ErrorDomain;

  export namespace Classes {
    export const GebetaError = GebetaErrorClass;

    export namespace Validation {
      export const ValidationError = ValidationErrorClass;
    }

    export namespace Network {
      export const NetworkError = NetworkErrorClass;
      export const NetworkTimeoutError = NetworkTimeoutErrorClass;
      export const NetworkOfflineError = NetworkOfflineErrorClass;
    }

    export namespace Api {
      export const ApiError = ApiErrorClass;
      export const BadRequestError = BadRequestErrorClass;
      export const UnauthorizedError = UnauthorizedErrorClass;
      export const ForbiddenError = ForbiddenErrorClass;
      export const NotFoundError = NotFoundErrorClass;
      export const RateLimitError = RateLimitErrorClass;
      export const ServerError = ServerErrorClass;
    }

    export namespace Business {
      export const BusinessLogicError = BusinessLogicErrorClass;
      export const GeocodingError = GeocodingErrorClass;
      export const RoutingError = RoutingErrorClass;
      export const NavigationError = NavigationErrorClass;
      export const TrackingError = TrackingErrorClass;
    }

    export namespace Platform {
      export const PlatformError = PlatformErrorClass;
      export const GeolocationDeniedError = GeolocationDeniedErrorClass;
      export const GeolocationUnavailableError = GeolocationUnavailableErrorClass;
      export const GeolocationTimeoutError = GeolocationTimeoutErrorClass;
    }
  }

  export namespace Factories {
    export namespace Validation {
      export const createValidationError = FactoriesModule.createValidationError;
    }

    export namespace Network {
      export const createNetworkError = FactoriesModule.createNetworkError;
      export const createNetworkTimeoutError = FactoriesModule.createNetworkTimeoutError;
      export const createNetworkOfflineError = FactoriesModule.createNetworkOfflineError;
    }

    export namespace Api {
      export const createApiError = FactoriesModule.createApiError;
    }

    export namespace Business {
      export const createGeocodingError = FactoriesModule.createGeocodingError;
      export const createRoutingError = FactoriesModule.createRoutingError;
      export const createNavigationError = FactoriesModule.createNavigationError;
      export const createTrackingError = FactoriesModule.createTrackingError;
    }
  }

  export namespace Utils {
    export const isGebetaError = UtilsModule.isGebetaError;
    export const getErrorCode = UtilsModule.getErrorCode;
    export const getErrorDomain = UtilsModule.getErrorDomain;
    export const formatErrorForLogging = UtilsModule.formatErrorForLogging;
    export const parseApiErrorResponse = UtilsModule.parseApiErrorResponse;
    export const extractRequestId = UtilsModule.extractRequestId;
  }
}
