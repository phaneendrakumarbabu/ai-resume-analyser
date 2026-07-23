import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function FirebaseTest() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testSignUp = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      console.log('=== FIREBASE TEST START ===');
      console.log('Email:', email);
      console.log('Password length:', password.length);
      console.log('Auth object:', auth);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      console.log('✅ SUCCESS!');
      console.log('User:', userCredential.user);
      
      setResult(`✅ SUCCESS! User created: ${userCredential.user.email} (UID: ${userCredential.user.uid})`);
    } catch (error: any) {
      console.error('❌ ERROR:', error);
      setResult(`❌ ERROR: ${error.code}\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Firebase Authentication Test</h1>
        
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">Test Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Test Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="minimum 6 characters"
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          
          <button
            onClick={testSignUp}
            disabled={loading || !email || !password}
            className="w-full bg-primary text-white py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Sign Up'}
          </button>
        </div>
        
        {result && (
          <div className="p-4 bg-muted rounded-lg">
            <h2 className="font-bold mb-2">Result:</h2>
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )}
        
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h2 className="font-bold mb-2">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Open browser console (F12)</li>
            <li>Enter a test email and password (min 6 chars)</li>
            <li>Click "Test Sign Up"</li>
            <li>Check console for detailed logs</li>
            <li>If you see an error, check the error code</li>
          </ol>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
          <h2 className="font-bold mb-2">Common Error Codes:</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><code>auth/operation-not-allowed</code> - Email/Password auth not enabled in Firebase Console</li>
            <li><code>auth/email-already-in-use</code> - Email already registered (this is actually good!)</li>
            <li><code>auth/weak-password</code> - Password too weak</li>
            <li><code>auth/invalid-email</code> - Invalid email format</li>
            <li><code>auth/network-request-failed</code> - Network/connectivity issue</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
