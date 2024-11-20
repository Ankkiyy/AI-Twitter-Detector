import React, { useState, useEffect } from 'react'; 
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
const LoginSignup: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const mode = searchParams.get('mode');

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setIsLoginMode(mode !== 'signup');
  }, [mode]);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string) => 
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});
      setSuccessMessage('');

      const newErrors: { [key: string]: string } = {};
      if (!validateEmail(email)) newErrors.email = 'Invalid email format';
      if (!validatePassword(password)) newErrors.password = 
        'Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character';

      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        try {
          const headersList = {
            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)",
            "Content-Type": "application/json",
          };

          const bodyContent = JSON.stringify({ email, password });

          const response = await fetch("http://127.0.0.1:10007/api/v1/auth/user/login", {
            method: "POST",
            headers: headersList,
            body: bodyContent,
          });

          if (response.ok) {
            setSuccessMessage("Login successful! Redirecting...");
            setTimeout(() => navigate('/ai'), 1500);
          } else {
            const data = await response.json();
            setErrors({ general: data.detail || "Login failed. Please try again." });
          }
        } catch (error) {
          setErrors({ general: "Network error. Please try again." });
        }
      }
    };

    return (
  
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            required
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        </div>
        {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
        {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
        <button className="w-full bg-teal-600 text-white py-2 rounded-lg">Login</button>
        <div className="text-sm text-center mt-4">
          <p>
            Don't have an account? <Link to="/LoginSignup?mode=signup" className="text-teal-600 hover:underline"> sign up</Link>
          </p>
          <p>
            If you've forgotten your password <Link to="/ForgotPassword" className="text-teal-600 hover:underline"> forgot password?</Link>
          </p>
        </div>
      </form>

    );
  };

  const SignupForm = () => {
    const [formData, setFormData] = useState({
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      phone: '',
      phone2: '',
      address: '',
      pin_code: '',
      state: '',
      city: '',
      country: '',
      type: 'user'
    });

    const submitSignup = async () => {
      const headers = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        "Content-Type": "application/json",
      };

      const bodyContent = JSON.stringify(formData);

      try {
        const response = await fetch("http://127.0.0.1:10007/api/v1/auth/user/create", {
          method: "POST",
          headers,
          body: bodyContent,
        });

        if (response.ok) {
          setSuccessMessage("Signup successful! Redirecting to login...");
          setTimeout(() => navigate('/LoginSignup?mode=login'), 2000);
        } else {
          const data = await response.json();
          setErrors({ general: data.detail || "Signup failed. Please try again." });
        }
      } catch (error) {
        setErrors({ general: "Network error. Please try again." });
      }
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});
      setSuccessMessage('');

      const newErrors: { [key: string]: string } = {};
      if (!formData.first_name) newErrors.first_name = 'First name is required';
      if (!formData.last_name) newErrors.last_name = 'Last name is required';
      if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
      if (!validatePassword(formData.password)) newErrors.password = 
        'Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character';
      if (!formData.pin_code) newErrors.pin_code = 'Pincode is required';

      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        submitSignup();
      }
    };

    return (
   
      <form
      className="space-y-6 mx-auto my-12 max-w-md"
      onSubmit={handleSubmit}
      >
      {[
        { label: 'First Name', name: 'first_name', type: 'text' },
        { label: 'Last Name', name: 'last_name', type: 'text' },
        { label: 'Email', name: 'email', type: 'email' },
        { label: 'Password', name: 'password', type: 'password' },
        { label: 'Phone', name: 'phone', type: 'text' },
        { label: 'Secondary Phone', name: 'phone2', type: 'text' },
        { label: 'Address', name: 'address', type: 'text' },
        { label: 'Pincode', name: 'pin_code', type: 'text' },
        { label: 'State', name: 'state', type: 'text' },
        { label: 'City', name: 'city', type: 'text' },
        { label: 'Country', name: 'country', type: 'text' },
      ].map(({ label, name, type }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <input
            type={type}
            value={formData[name as keyof typeof formData]}
            onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
            required
          />
          {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
        </div>
      ))}
      {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
      {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
      <button className="w-full bg-teal-600 text-white py-2 rounded-lg">Sign Up</button>
      <div className="text-sm text-center mt-4">
        <p>
          Already have an account?{' '}
          <Link to="/LoginSignup?mode=login" className="text-teal-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </form>
    
    );
  
  };

 return (
  <>
  <Header/>
  <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-24 py-16">
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {isLoginMode ? 'Login' : 'Sign Up'}
      </h2>
      {isLoginMode ? <LoginForm /> : <SignupForm />}
    </div>
  </div>
  <Footer/>
  </>
)
};


export default LoginSignup;
