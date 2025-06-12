"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { sanitizeInput, validators } from "@/utils/validation";
import { handleError, ErrorTypes } from "@/utils/error-handler";

export async function signUpUser(formData) {
  console.log("Iniciando proceso de registro...");
  
  try {
    const rawEmail = formData.get("email")?.toString();
    const rawPassword = formData.get("password")?.toString();
    const rawConfirmPassword = formData.get("confirmPassword")?.toString();

    // 1. Sanitización de entradas
    const email = sanitizeInput(rawEmail);
    const password = sanitizeInput(rawPassword);
    const confirmPassword = sanitizeInput(rawConfirmPassword);

    // 2. Validación de campos obligatorios
    if (!email || !password || !confirmPassword) {
      const formattedError = handleError(
        { message: "Todos los campos son obligatorios." },
        { code: ErrorTypes.VALIDATION }
      );
      return {
        error: {
          message: formattedError.message,
          code: formattedError.type,
          id: formattedError.id,
        },
      };
    }

    // 3. Validaciones específicas
    const emailValidation = validators.email(email);
    if (!emailValidation.isValid) {
      const message = emailValidation.errors[0] || "Correo electrónico inválido.";
      const formattedError = handleError(
        { message },
        { code: ErrorTypes.VALIDATION, field: "email" }
      );
      return {
        error: {
          message: formattedError.message,
          code: formattedError.type,
          id: formattedError.id,
        },
      };
    }

    if (password !== confirmPassword) {
      const formattedError = handleError(
        { message: "Las contraseñas no coinciden." },
        { code: ErrorTypes.VALIDATION, field: "confirmPassword" }
      );
      return {
        error: {
          message: formattedError.message,
          code: formattedError.type,
          id: formattedError.id,
        },
      };
    }

    const passwordValidation = validators.password(password);
    if (!passwordValidation.isValid) {
      const message = passwordValidation.errors?.join(" ") || 
        "La contraseña no cumple con los requisitos de seguridad.";
      const formattedError = handleError(
        { message },
        { code: ErrorTypes.VALIDATION, field: "password" }
      );
      return {
        error: {
          message: formattedError.message,
          code: formattedError.type,
          id: formattedError.id,
        },
      };
    }

    // 4. Llamada a Supabase
    const supabase = await createSupabaseServerClient();
    console.log("Cliente Supabase creado para registro");

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000/auth/callback",
        data: {
          registration_timestamp: new Date().toISOString(),
        },
      },
    });

    // 5. Manejo de errores de Supabase
    if (signUpError) {
      console.error("Error de registro en Supabase:", signUpError);
      
      // Detectar error de usuario ya registrado
      if (signUpError.message === "User already registered") {
        const formattedError = handleError(
          { message: "Este correo electrónico ya está registrado" },
          { code: ErrorTypes.VALIDATION, field: "email" }
        );
        
        return {
          error: {
            message: formattedError.message,
            code: formattedError.type,
            id: formattedError.id,
            field: "email",
            originalError: signUpError.message
          },
        };
      }
      
      // Detectar error de base de datos
      if (signUpError.message === "Database error saving new user") {
        const formattedError = handleError(
          { message: "Error al crear el usuario. Por favor, inténtalo de nuevo más tarde." },
          { code: ErrorTypes.SERVER, field: null }
        );
        
        return {
          error: {
            message: formattedError.message,
            code: formattedError.type,
            id: formattedError.id,
            originalError: signUpError.message
          },
        };
      }

      // Detectar error de límite de tasa
      const rateLimitIndicators = [
        "over_email_send_rate_limit",
        "rate limit", 
        "rate exceeded",
        "too many requests",
        "429",
        "demasiadas solicitudes",
        "límite"
      ];
      
      const isRateLimit = rateLimitIndicators.some(indicator => 
        (signUpError.message || "").toLowerCase().includes(indicator.toLowerCase())
      );
      
      if (isRateLimit) {
        console.log("⛔ LÍMITE DE TASA DETECTADO EN EL REGISTRO");
        
        return {
          error: {
            message: "Se han realizado demasiados intentos de registro. Por favor, espera 3 minutos antes de intentarlo de nuevo.",
            code: "RATE_LIMIT_ERROR",
            isRateLimit: true,
            originalMessage: signUpError.message
          },
          rateLimited: true,
          originalError: signUpError,
        };
      }

      // Para otros errores de Supabase
      const formattedError = handleError(signUpError, {
        context: "Supabase SignUp",
      });
      return {
        error: {
          message: formattedError.message,
          code: formattedError.type,
          id: formattedError.id,
        },
      };
    }

    // Usuario no confirmado
    if (
      signUpData?.user &&
      signUpData.user.identities &&
      signUpData.user.identities.length === 0
    ) {
      return {
        error: {
          message: "Este correo electrónico ya está registrado pero no confirmado. Revisa tu bandeja de entrada.",
          code: "USER_NOT_CONFIRMED",
          id: `not-confirmed-${Date.now()}`
        }
      };
    }

    // 6. Registro exitoso
    if (signUpData?.user) {
      return {
        success: true,
        message: "¡Registro completado! Por favor revisa tu correo electrónico para verificar tu cuenta.",
        email: email,
      };
    }

    // Fallback para casos no manejados
    const unexpectedError = handleError(
      { message: "Ocurrió un error inesperado durante el registro." },
      { code: ErrorTypes.UNKNOWN }
    );
    return {
      error: {
        message: unexpectedError.message,
        code: unexpectedError.type,
        id: unexpectedError.id,
      },
    };
    
  } catch (error) {
    console.error("Error crítico en registro:", error);
    
    // Verificar si es un error de límite de tasa
    if (error.message && (
      error.message.toLowerCase().includes("rate limit") || 
      error.message.toLowerCase().includes("429") ||
      error.message.toLowerCase().includes("too many")
    )) {
      return {
        error: {
          message: "Se ha excedido el límite de intentos. Por favor espera 3 minutos.",
          code: "RATE_LIMIT_ERROR",
          isRateLimit: true
        },
        rateLimited: true
      };
    }
    
    return {
      error: {
        message: "Error inesperado durante el registro. Por favor, inténtalo más tarde.",
        code: "ERROR",
      }
    };
  }
}
