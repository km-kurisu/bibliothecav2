const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcrypt')
const dotenv = require('dotenv')
const path = require('path')

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

// Validate required environment variables
const requiredEnvVars = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar])

if (missingEnvVars.length > 0) {
  console.error('Error: Missing required environment variables:')
  missingEnvVars.forEach(envVar => console.error(`- ${envVar}`))
  console.error('\nPlease make sure these variables are set in your .env.local file')
  process.exit(1)
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createAdminUser() {
  try {
    // Get admin credentials from command line arguments or use defaults
    const username = process.argv[2] || 'admin'
    const email = process.argv[3] || 'admin@example.com'
    const password = process.argv[4] || 'Admin123!@#' // Default secure password

    // Validate email format
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
    if (!emailRegex.test(email)) {
      console.error('Error: Invalid email format')
      process.exit(1)
    }

    // Validate username length
    if (username.length < 3 || username.length > 50) {
      console.error('Error: Username must be between 3 and 50 characters')
      process.exit(1)
    }

    // Check if username or email already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from('admin_users')
      .select('username, email')
      .or(`username.eq.${username},email.eq.${email}`)
      .maybeSingle()

    if (existingUserError) {
      console.error('Error checking for existing admin user:', existingUserError)
      process.exit(1)
    }

    if (existingUser) {
      if (existingUser.username === username) {
        console.error('Error: Username already exists')
        process.exit(1)
      }
      if (existingUser.email === email) {
        console.error('Error: Email already exists')
        process.exit(1)
      }
    }

    // Hash the password with increased salt rounds
    const hashedPassword = await bcrypt.hash(password, 12)

    // Insert the new admin user
    const { data, error } = await supabase
      .from('admin_users')
      .insert([
        {
          username,
          email,
          hashed_password: hashedPassword,
          is_active: true,
          failed_login_attempts: 0
        }
      ])
      .select()

    if (error) {
      console.error('Error creating admin user:', error)
      process.exit(1)
    }

    console.log('\nAdmin user created successfully!')
    console.log('--------------------------------')
    console.log(`Username: ${username}`)
    console.log(`Email: ${email}`)
    console.log(`Password: ${password}`)
    console.log('--------------------------------')
    console.log('\nPlease save these credentials securely.')
    console.log('You can now log in to the admin dashboard.')

  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

// Run the script
createAdminUser() 