'use server'

import { redirect } from 'next/navigation'
import { createClient as createServerClient } from '@/utils/supabase/server'
import bcrypt from 'bcrypt'

export async function adminSignup(formData) {
  const username = formData.get('username')
  const password = formData.get('password')
  const confirmPassword = formData.get('confirmPassword')

  // Basic validation
  if (!username || !password || !confirmPassword) {
    redirect('/admin/signup?message=Please fill in all fields')
  }

  if (password !== confirmPassword) {
    redirect('/admin/signup?message=Passwords do not match')
  }

  if (password.length < 6) {
     redirect('/admin/signup?message=Password should be at least 6 characters long');
  }

  const supabase = createServerClient()

  try {
    // Check if username already exists in the admin_users table
    const { data: existingUser, error: existingUserError } = await supabase
      .from('admin_users')
      .select('username')
      .eq('username', username)
      .single()

    if (existingUserError && existingUserError.code !== 'PGRST116') { // PGRST116 means row not found
      console.error('Error checking for existing admin user:', existingUserError)
      redirect('/admin/signup?message=An error occurred during signup')
    }

    if (existingUser) {
       redirect('/admin/signup?message=Username already exists')
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert the new admin user into the admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .insert([
        {
          username,
          hashed_password: hashedPassword,
          is_active: true // Default to active
        }
      ])
      .select()

    if (error) {
      console.error('Error creating admin user:', error)
      redirect('/admin/signup?message=An error occurred during signup')
    }

    console.log('Admin user signed up successfully:', data)

    // Redirect to the admin login page after successful signup
    redirect('/admin/login?message=Signup successful! Please log in.')

  } catch (error) {
    console.error('Error in admin signup process:', error)
    redirect('/admin/signup?message=An unexpected error occurred')
  }
} 