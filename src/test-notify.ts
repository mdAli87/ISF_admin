import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xaltintlvsmmpgapczlp.supabase.co'
const supabaseAnonKey = 'YOUR_ANON_KEY' // Get this from your project settings

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testNotification() {
  try {
    const { data, error } = await supabase.functions.invoke('notify', {
      body: {
        userId: "2023.taha.sayyed@ves.ac.in",
        userEmail: "2023.taha.sayyed@ves.ac.in",
        userNumber: "+15005550006",
        mergeTags: {
          "comment": "testComment"
        }
      }
    })

    if (error) {
      console.error('Error:', error)
      return
    }

    console.log('Success:', data)
  } catch (error) {
    console.error('Error:', error)
  }
}

// To run this test:
// 1. Replace YOUR_ANON_KEY with your actual anon key from project settings
// 2. Run: npm install @supabase/supabase-js
// 3. Run: npx ts-node src/test-notify.ts

testNotification() 