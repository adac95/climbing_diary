'use server'

import { createSupabaseServerClient } from '@utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return 'El email es requerido';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'El email no es válido';
  }
  return null;
}

function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return 'La contraseña es requerida';
  }
  if (password.length < 6) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  return null;
}

export async function login(formData) {
  console.log('🔍 Iniciando proceso de login...');
  
  // Verificar que formData sea un objeto FormData válido
  if (!(formData instanceof FormData)) {
    console.error('❌ Error: formData no es una instancia de FormData', { formData });
    return { 
      success: false, 
      error: 'Error en el formato de los datos del formulario',
      code: 'INVALID_FORM_DATA'
    };
  }
  
  const email = formData.get('email');
  const password = formData.get('password');

  console.log('📝 Datos del formulario recibidos:', { 
    email: email || 'No proporcionado',
    hasPassword: !!password,
    formDataKeys: Array.from(formData.keys()) 
  });

  try {
    // Validaciones
    const emailError = validateEmail(email);
    if (emailError) {
      console.log('❌ Error de validación de email:', emailError);
      return { 
        success: false, 
        error: emailError,
        code: 'INVALID_EMAIL'
      };
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      console.log('❌ Error de validación de contraseña:', passwordError);
      return { 
        success: false, 
        error: passwordError,
        code: 'INVALID_PASSWORD'
      };
    }

    console.log('🔑 Creando cliente Supabase...');
    const supabase = await createSupabaseServerClient();
    
    console.log('🔐 Iniciando sesión con Supabase...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    console.log('📨 Respuesta de Supabase:', { 
      hasData: !!data, 
      hasError: !!error,
      errorMessage: error?.message
    });

    if (error) {
      console.error('❌ Error al iniciar sesión:', {
        code: error.code,
        message: error.message,
        status: error.status
      });
      
      let errorMessage = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
      
      switch (error.status) {
        case 400:
          errorMessage = 'Credenciales inválidas. Por favor, verifica tu correo y contraseña.';
          break;
        case 429:
          errorMessage = 'Demasiados intentos. Por favor, espera un momento antes de intentar de nuevo.';
          break;
        case 500:
          errorMessage = 'Error del servidor. Por favor, inténtalo de nuevo más tarde.';
          break;
      }
      
      return { 
        success: false, 
        error: errorMessage,
        code: error.code || 'AUTH_ERROR'
      };
    }

    if (!data?.session) {
      console.error('❌ No se pudo crear la sesión:', data);
      return { 
        success: false, 
        error: 'No se pudo crear la sesión. Por favor, intenta de nuevo.',
        code: 'SESSION_CREATION_FAILED'
      };
    }

    console.log('✅ Inicio de sesión exitoso');
    revalidatePath('/', 'layout');
    
    return { 
      success: true,
      session: data.session
    };
    
  } catch (error) {
    console.error('🔥 Error en el servidor:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return { 
      success: false, 
      error: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.',
      code: 'UNEXPECTED_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }
}

export async function signup(formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // Validaciones
  const emailError = validateEmail(email);
  if (emailError) return { error: emailError };

  const passwordError = validatePassword(password);
  if (passwordError) return { error: passwordError };

  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      redirect(`/login?message=${encodeURIComponent(error.message)}&type=error`);
    }

    redirect(`/login?message=${encodeURIComponent('Revisa tu email para confirmar tu cuenta.')}&type=success`);
  } catch (error) {
    redirect(`/login?message=${encodeURIComponent('Error al registrarse. Por favor, intenta de nuevo.')}&type=error`);
  }
}