"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { signUpUser } from "./actions";
import styles from "./signup.module.css";
import Message from "@/components/Message";
import { ErrorTypes } from "@/utils/error-handler";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  
  const [formState, setFormState] = useState({ message: null, type: "error" });
  const [isLoading, setIsLoading] = useState(false);
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTimer, setCooldownTimer] = useState(0);
  const formRef = useRef(null);
  const timerRef = useRef(null);
  const endTimeRef = useRef(0);
  const cooldownTimeRef = useRef(0); // Agregamos la referencia faltante
  
  // Elemento para mostrar el tiempo en el mensaje sin causar re-renderizados
  const timerDisplayRef = useRef(null);
  
  // Obtener el tiempo de cooldown para mostrar en mensajes de error
  const getCooldownTime = () => {
    if (!cooldown) return 0;
    return Math.ceil((endTimeRef.current - Date.now()) / 1000);
  };
  
  // Función para actualizar el texto del mensaje de cooldown sin re-renderizar
  const updateTimerDisplay = () => {
    if (!cooldown) return;
    
    const now = Date.now();
    const secondsLeft = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
    
    // Actualizar el mensaje si la referencia existe
    if (timerDisplayRef.current) {
      const minutes = Math.floor(secondsLeft / 60);
      const seconds = secondsLeft % 60;
      
      // Formato adecuado del mensaje
      let timeMessage;
      if (minutes > 0) {
        timeMessage = `${minutes} minuto${minutes > 1 ? 's' : ''}`;
        if (seconds > 0) timeMessage += ` y ${seconds} segundo${seconds > 1 ? 's' : ''}`;
      } else {
        timeMessage = `${seconds} segundo${seconds > 1 ? 's' : ''}`;
      }
      
      timerDisplayRef.current.innerText = `El botón se habilitará después de ${timeMessage}`;
    }
    
    // Verificar si el tiempo ha expirado
    if (secondsLeft <= 0) {
      // Limpiar el intervalo
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Deshabilitar el cooldown
      setCooldown(false);
      
      // Limpiar el mensaje de error cuando termine el cooldown
      setFormState({ message: null, type: "error" });
      
      // Limpiar datos de localStorage
      localStorage.removeItem('signupLastAttempt');
      localStorage.removeItem('signupCooldownDuration');
      localStorage.removeItem('signupEndTime');
    }
  };
  
  // Iniciar temporizador de cooldown
  const startCooldown = (durationMs) => {
    // Limpiar temporizador existente si hay uno
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const now = Date.now();
    endTimeRef.current = now + durationMs;
    cooldownTimeRef.current = Math.ceil(durationMs / 1000);
    
    setCooldown(true);
    
    // Guardar en localStorage
    localStorage.setItem('signupLastAttempt', now.toString());
    localStorage.setItem('signupCooldownDuration', durationMs.toString());
    localStorage.setItem('signupEndTime', endTimeRef.current.toString());
    
    // Actualizar visualización cada segundo sin re-renderizar el componente
    updateTimerDisplay(); // Actualizar inmediatamente
    // No es necesario configurar un intervalo aquí, se hace en useEffect
  };
  
  // Verificar si hay un cooldown activo en localStorage al cargar la página
  useEffect(() => {
    const endTimeStored = localStorage.getItem('signupEndTime');
    
    if (endTimeStored) {
      const endTime = parseInt(endTimeStored);
      const now = Date.now();
      
      if (endTime > now) {
        endTimeRef.current = endTime;
        setCooldown(true);
        
        // Iniciar temporizador con actualización DOM directa
        timerRef.current = setInterval(updateTimerDisplay, 1000);
      } else {
        // El tiempo ya pasó, limpiar localStorage
        localStorage.removeItem('signupLastAttempt');
        localStorage.removeItem('signupCooldownDuration');
        localStorage.removeItem('signupEndTime');
      }
    }
    
    // Limpiar al desmontar
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  // Efecto para actualizar la referencia DOM después del renderizado
  // Actualizar el temporizador cuando cambia el estado de cooldown 
  useEffect(() => {
    if (cooldown) {
      // Ejecutar una vez inmediatamente
      updateTimerDisplay();
      
      // Verificar cada segundo (equilibrio entre precisión y rendimiento)
      const checkInterval = setInterval(() => {
        updateTimerDisplay();
      }, 1000);
      
      // Guardar referencia al intervalo
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = checkInterval;
    }
  }, [cooldown]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Verificar cooldown - si está activo, mostrar mensaje y no hacer nada más
    if (cooldown) {
      setFormState({
        message: `Se han realizado demasiadas solicitudes de registro. Por favor, espera ${Math.floor(getCooldownTime() / 60)} minutos y ${getCooldownTime() % 60} segundos antes de intentarlo nuevamente.`,
        type: "error",
        persistent: true
      });
      return;
    }
    
    setIsLoading(true);
    setFormState({ message: null, type: "error" });

    try {
      const formData = new FormData(event.currentTarget);
      const result = await signUpUser(formData);
      console.log("Resultado completo del servidor:", result);

      // 1. VERIFICAR ESPECÍFICAMENTE LÍMITE DE TASA
      // Comprobamos todas las posibles formas en que puede venir el error
      if (
        result?.rateLimited === true || 
        (result?.error?.code === 'RATE_LIMIT_ERROR') ||
        (result?.error?.code === 'RATE_LIMIT') ||
        (result?.error?.isRateLimit === true) ||
        (result?.error?.message && (
          result.error.message.includes('límite') ||
          result.error.message.includes('rate limit') ||
          result.error.message.includes('demasiados intentos')
        ))
      ) {
        console.log("✅ LÍMITE DE TASA DETECTADO", result);
        
        // Activar cooldown largo (3 minutos)
        startCooldown(3 * 60 * 1000);
        
        // Mensaje de error persistente y claro
        setFormState({
          message: "Se han realizado demasiados intentos de registro. Por favor, espera 3 minutos antes de intentarlo de nuevo.",
          type: "error",
          persistent: true // No se auto-cierra
        });
        
        return; // Importante: terminar la función para no procesar más lógica
      }
      
      // 2. MANEJO DE OTROS ERRORES
      else if (result?.error) {
        console.log("❌ Error en registro:", result.error);
        
        setFormState({
          message: result.error.message || "Ha ocurrido un error durante el registro.",
          type: "error"
        });
      } 
      
      // 3. REGISTRO EXITOSO
      else if (result?.success) {
        // Cooldown corto para evitar registros repetidos accidentales
        startCooldown(30 * 1000); // 30 segundos
        
        setFormState({
          message: result.message || "¡Registro exitoso! Por favor revisa tu correo para verificar tu cuenta.",
          type: "success",
          email: result.email
        });
        
        // Limpiar formulario
        event.target.reset();
      } 
      
      // 4. RESPUESTA NO RECONOCIDA
      else {
        console.log("⚠️ Respuesta no reconocida:", result);
        setFormState({
          message: "Ha ocurrido un error desconocido durante el registro.",
          type: "error"
        });
      }
    } 
    
    // 5. CAPTURA DE EXCEPCIONES NO MANEJADAS
    catch (error) {
      console.error("⛔ ERROR NO CONTROLADO:", error);
      
      // Si parece error de límite de tasa por el mensaje
      if (error.message && (
        error.message.toLowerCase().includes("rate limit") || 
        error.message.toLowerCase().includes("rate exceeded") ||
        error.message.toLowerCase().includes("429") ||
        error.message.toLowerCase().includes("demasiados intentos") ||
        error.message.toLowerCase().includes("límite")
      )) {
        console.log("✅ Límite de tasa detectado en excepción");
        startCooldown(3 * 60 * 1000);
        
        setFormState({
          message: "Se ha excedido el límite de intentos de registro. Por favor espera 3 minutos.",
          type: "error",
          persistent: true
        });
      } else {
        setFormState({
          message: "Ha ocurrido un problema al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.",
          type: "error"
        });
      }
    } 
    
    // 6. FINALIZACIÓN (se ejecuta siempre)
    finally {
      setIsLoading(false);
    }
  };

  const handleMessageDismiss = () => {
    // Solo permitir cerrar el mensaje si no hay cooldown activo
    if (!cooldown) {
      setFormState({ message: null, type: "error" });
    }
  };

  // Estado para determinar si muestra el formulario o el mensaje de verificación
  const showVerificationMessage = formState.type === "success" && formState.message;
  
  return (
    <div className={styles.container}>
      {showVerificationMessage ? (
        <div className={styles.signupCard}>
          <div className={styles.verificationContainer}>
            <h2 className={styles.title}>Verifica tu Correo Electrónico</h2>
            <div className={styles.successIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.97 4.97a.75.75 0 0 1 1.071 1.05l-5.296 5.337a.75.75 0 0 1-1.07.02L3.22 7.913a.75.75 0 0 1 1.06-1.06l2.68 2.683 4.007-4.048a.75.75 0 0 1 1.06 0z"/>
              </svg>
            </div>
            <p className={styles.verificationText}>
              Hemos enviado un enlace de verificación a <strong>{formState.email}</strong>
            </p>
            <p className={styles.verificationInstructions}>
              Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
            </p>
            <p className={styles.verificationNote}>
              Si no encuentras el correo, revisa tu carpeta de spam o correo no deseado.
            </p>
            <div className={styles.verificationActions}>
              <button 
                onClick={() => setFormState({ message: null, type: "error" })}
                className={styles.buttonSecondary}>
                Volver al registro
              </button>
              <Link href="/login" className={styles.buttonPrimary}>
                Ir a iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.signupCard}>
          <h2 className={styles.title}>Crear Cuenta</h2>

          {formState.message && (
            <Message
              message={formState.message}
              type={formState.type}
              persistent={formState.persistent} 
              onDismiss={handleMessageDismiss}
            />
          )}

        <div className={styles.inputGroup}>
          <label htmlFor='email' className={styles.label}>
            Correo Electrónico
          </label>
          <input
            type='email'
            id='email'
            name='email'
            className={styles.input}
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor='password' className={styles.label}>
            Contraseña
          </label>
          <input
            type='password'
            id='password'
            name='password'
            className={styles.input}
            required
            disabled={isLoading}
          />
          <small className={styles.passwordHint}>
            Debe tener al menos 12 caracteres, incluyendo mayúsculas,
            minúsculas, números y caracteres especiales.
          </small>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor='confirmPassword' className={styles.label}>
            Confirmar Contraseña
          </label>
          <input
            type='password'
            id='confirmPassword'
            name='confirmPassword'
            className={styles.input}
            required
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={isLoading || cooldown}
        >
          {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
        </button>
        
        {cooldown && (
          <p className={styles.cooldownMessage} ref={timerDisplayRef}>
            El botón se habilitará en unos momentos...
          </p>
        )}

        <p className={styles.loginLink}>
          ¿Ya tienes una cuenta? <Link href='/login'>Inicia sesión</Link>
        </p>
      </form>
      )}
    </div>
  );
}
