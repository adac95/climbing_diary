// Tipos de errores conocidos
export const ErrorTypes = {
  AUTH: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  DATABASE: 'DATABASE_ERROR',
  NETWORK: 'NETWORK_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  PERMISSION: 'PERMISSION_ERROR',
  SERVER: 'SERVER_ERROR',
  RATE_LIMIT: 'RATE_LIMIT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Mensajes de error amigables para el usuario
const userFriendlyMessages = {
  [ErrorTypes.AUTH]: 'Error de autenticación. Por favor, inicia sesión nuevamente.',
  [ErrorTypes.VALIDATION]: 'Los datos proporcionados no son válidos.',
  [ErrorTypes.DATABASE]: 'Error al acceder a los datos. Por favor, intenta más tarde.',
  [ErrorTypes.NETWORK]: 'Error de conexión. Verifica tu conexión a internet.',
  [ErrorTypes.NOT_FOUND]: 'El recurso solicitado no fue encontrado.',
  [ErrorTypes.PERMISSION]: 'No tienes permisos para realizar esta acción.',
  [ErrorTypes.SERVER]: 'Error del servidor. Por favor, intenta más tarde.',
  [ErrorTypes.RATE_LIMIT]: 'Has alcanzado el límite de solicitudes. Por favor, inténtalo más tarde.',
  [ErrorTypes.UNKNOWN]: 'Ha ocurrido un error inesperado.'
};

// Función para determinar el tipo de error
const getErrorType = (error) => {
  if (error.status === 401 || error.message?.includes('auth')) {
    return ErrorTypes.AUTH;
  }
  if (error.status === 400 || error.message?.includes('validation')) {
    return ErrorTypes.VALIDATION;
  }
  if (error.status === 404) {
    return ErrorTypes.NOT_FOUND;
  }
  if (error.status === 403) {
    return ErrorTypes.PERMISSION;
  }
  // Check for navigator existence for server-side compatibility
  if (error.message?.includes('network') || (typeof navigator !== 'undefined' && !navigator.onLine)) {
    return ErrorTypes.NETWORK;
  }
  // Detectar errores de límite de tasa
  if (error.status === 429 || error.message?.includes('rate limit') || error.code === 'over_email_send_rate_limit') {
    return ErrorTypes.RATE_LIMIT;
  }
  if (error.status >= 500) {
    return ErrorTypes.SERVER;
  }
  return ErrorTypes.UNKNOWN;
};

// Función principal de manejo de errores
export const handleError = (error, context = {}) => {
  // Prioritize error type from context if available and valid.
  const errorType = Object.values(ErrorTypes).includes(context.code)
    ? context.code
    : getErrorType(error);

  const timestamp = new Date().toISOString();

  // For validation errors, use the specific message from the original error.
  // For other errors, use the generic user-friendly message.
  const message = (errorType === ErrorTypes.VALIDATION && error.message)
    ? error.message
    : userFriendlyMessages[errorType];

  // Crear objeto de error estructurado para logging
  const errorObject = {
    type: errorType,
    message: message,
    originalError: error.message,
    timestamp,
    context,
    stack: error.stack
  };

  // Log del error (en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Details:', {
      ...errorObject,
      context
    });
  }

  // En producción, podrías enviar el error a un servicio de monitoreo
  if (process.env.NODE_ENV === 'production') {
    // Aquí podrías integrar servicios como Sentry, LogRocket, etc.
    // sendToErrorMonitoring(errorObject);
  }

  // Retornar objeto con información segura para el usuario
  return {
    type: errorType,
    message: message,
    id: timestamp // Útil para referencia en soporte
  };
};

// Función para manejar errores de API
export const handleApiError = async (response) => {
  if (!response.ok) {
    const error = new Error('API Error');
    error.status = response.status;
    
    try {
      error.data = await response.json();
    } catch {
      error.data = null;
    }
    
    throw error;
  }
  return response;
};

// HOC para manejo de errores en componentes
export const withErrorBoundary = (WrappedComponent) => {
  return class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
      handleError(error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return (
          <div className="error-boundary">
            <h2>Algo salió mal</h2>
            <p>{userFriendlyMessages[getErrorType(this.state.error)]}</p>
            <button onClick={() => this.setState({ hasError: false })}>
              Intentar de nuevo
            </button>
          </div>
        );
      }

      return <WrappedComponent {...this.props} />;
    }
  };
}; 