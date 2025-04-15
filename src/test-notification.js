import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

async function testNotification() {
  try {
    console.log('Testing notification function...')
    const { data, error } = await supabase.functions.invoke('notification-handler', {
      body: {
        userId: "2023.taha.sayyed@ves.ac.in",
        userEmail: "2023.taha.sayyed@ves.ac.in",
        userNumber: "+15005550006",
        mergeTags: {
          comment: "Test notification from Edge Function"
        }
      }
    })

    if (error) {
      console.error('Error:', error)
      return
    }

    console.log('Success:', data)
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the test
testNotification() 